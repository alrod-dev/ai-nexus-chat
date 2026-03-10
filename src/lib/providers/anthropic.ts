import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, ChatMessage, ChatOptions, ChatResponse } from '@/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const anthropicProvider: AIProvider = {
  name: 'anthropic',
  model: 'claude-3-opus-20240229',

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const formattedMessages = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    const systemPrompt = options?.systemPrompt || 'You are a helpful AI assistant.';

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens ?? 2000,
      system: systemPrompt,
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.7,
      top_p: options?.topP ?? 1,
      ...(options?.tools && {
        tools: options.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.input_schema,
        })),
      }),
    });

    const content =
      response.content.find((block) => block.type === 'text')?.text || '';
    const toolCalls = response.content
      .filter((block) => block.type === 'tool_use')
      .map((block: any) => ({
        id: block.id,
        name: block.name,
        input: block.input,
      }));

    return {
      content,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason: response.stop_reason,
    };
  },

  async stream(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    options?: ChatOptions
  ): Promise<void> {
    const formattedMessages = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    const systemPrompt = options?.systemPrompt || 'You are a helpful AI assistant.';

    const stream = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens ?? 2000,
      system: systemPrompt,
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.7,
      top_p: options?.topP ?? 1,
      stream: true,
      ...(options?.tools && {
        tools: options.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.input_schema,
        })),
      }),
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk(event.delta.text);
      }
    }
  },
};
