import OpenAI from 'openai';
import { AIProvider, ChatMessage, ChatOptions, ChatResponse } from '@/types';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openaiProvider: AIProvider = {
  name: 'openai',
  model: 'gpt-4-turbo',

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    const response = await client.chat.completions.create({
      model: this.model,
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      top_p: options?.topP ?? 1,
      ...(options?.tools && {
        tools: options.tools.map((tool) => ({
          type: 'function' as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          },
        })),
      }),
    });

    const choice = response.choices[0];
    const toolCalls = choice.message.tool_calls?.map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      input: JSON.parse(tc.function.arguments),
    }));

    return {
      content: choice.message.content || '',
      toolCalls,
      stopReason: choice.finish_reason,
    };
  },

  async stream(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    options?: ChatOptions
  ): Promise<void> {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    const stream = await client.chat.completions.create({
      model: this.model,
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      top_p: options?.topP ?? 1,
      stream: true,
      ...(options?.tools && {
        tools: options.tools.map((tool) => ({
          type: 'function' as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          },
        })),
      }),
    });

    for await (const event of stream) {
      if (event.choices[0]?.delta?.content) {
        onChunk(event.choices[0].delta.content);
      }
    }
  },
};
