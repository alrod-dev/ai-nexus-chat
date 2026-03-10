import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getProvider, getAvailableProviders } from '@/lib/providers';
import { getEnabledTools, executeTool } from '@/lib/tools';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { ChatMessage } from '@/types';

interface ChatRequest {
  conversationId?: string;
  message: string;
  model: string;
  systemPrompt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const rateLimitKey = getRateLimitKey(userId, '/api/chat');
    const rateLimitConfig = rateLimit(
      rateLimitKey,
      parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '30'),
      60 * 1000
    );

    if (!rateLimitConfig.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetAt: rateLimitConfig.resetAt,
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body: ChatRequest = await request.json();
    const { conversationId, message, model, systemPrompt } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!model || !getAvailableProviders().includes(model as any)) {
      return NextResponse.json(
        { error: `Invalid model: ${model}` },
        { status: 400 }
      );
    }

    // Get or create conversation
    let conv;
    if (conversationId) {
      conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      if (!conv || conv.userId !== userId) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
    } else {
      conv = await prisma.conversation.create({
        data: {
          userId,
          model,
          title: message.substring(0, 50),
        },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    // Build message history
    const history: ChatMessage[] = conv.messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    // Add new user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    };

    history.push(userMessage);

    // Save user message to database
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        role: 'user',
        content: message,
      },
    });

    // Get provider and tools
    const provider = getProvider(model as any);
    const tools = getEnabledTools();
    const chatOptions = {
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt,
      tools: tools.length > 0 ? tools : undefined,
    };

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        let messageId = '';

        try {
          // Save initial assistant message
          const savedMessage = await prisma.message.create({
            data: {
              conversationId: conv!.id,
              role: 'assistant',
              content: '',
            },
          });
          messageId = savedMessage.id;

          await provider.stream(
            history,
            (chunk: string) => {
              fullResponse += chunk;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`)
              );
            },
            chatOptions
          );

          // Update message with full response
          await prisma.message.update({
            where: { id: messageId },
            data: { content: fullResponse },
          });

          // Update conversation title if first message
          if (conv!.messages.length === 0) {
            await prisma.conversation.update({
              where: { id: conv!.id },
              data: { title: message.substring(0, 100) },
            });
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Chat error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMessage })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        model: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      conversations,
      availableProviders: getAvailableProviders(),
      enabledTools: getEnabledTools(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
