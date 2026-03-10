import axios from 'axios';
import { AIProvider, ChatMessage, ChatOptions, ChatResponse } from '@/types';

const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export const ollamaProvider: AIProvider = {
  name: 'ollama',
  model: 'mistral',

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    try {
      const response = await axios.post(`${baseURL}/api/chat`, {
        model: this.model,
        messages: formattedMessages,
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.7,
          top_p: options?.topP ?? 1,
          num_predict: options?.maxTokens ?? 2000,
        },
      });

      return {
        content: response.data.message?.content || '',
        stopReason: response.data.done ? 'stop' : 'length',
      };
    } catch (error) {
      console.error('Ollama error:', error);
      throw new Error('Failed to communicate with Ollama service');
    }
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

    try {
      const response = await axios.post(
        `${baseURL}/api/chat`,
        {
          model: this.model,
          messages: formattedMessages,
          stream: true,
          options: {
            temperature: options?.temperature ?? 0.7,
            top_p: options?.topP ?? 1,
            num_predict: options?.maxTokens ?? 2000,
          },
        },
        {
          responseType: 'stream',
        }
      );

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          try {
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
              if (line.trim()) {
                const json = JSON.parse(line);
                if (json.message?.content) {
                  onChunk(json.message.content);
                }
              }
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        });

        response.data.on('end', () => resolve());
        response.data.on('error', (error: Error) => reject(error));
      });
    } catch (error) {
      console.error('Ollama stream error:', error);
      throw new Error('Failed to stream from Ollama service');
    }
  },
};
