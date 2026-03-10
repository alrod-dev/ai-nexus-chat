'use client';

import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '@/types';

interface UseChatOptions {
  conversationId?: string;
  model?: string;
  systemPrompt?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState(options.conversationId);
  const [model, setModel] = useState(options.model || 'openai');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      setError(null);
      setIsLoading(true);

      // Add user message to state
      const newUserMessage: ChatMessage = {
        role: 'user',
        content: userMessage,
      };

      setMessages((prev) => [...prev, newUserMessage]);

      try {
        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            message: userMessage,
            model,
            systemPrompt: options.systemPrompt,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to get response');
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        let fullResponse = '';
        const decoder = new TextDecoder();

        // Set conversation ID from first response
        if (!conversationId) {
          const firstChunk = await reader.read();
          const text = decoder.decode(firstChunk.value);
          // Extract conversationId from response if provided
        }

        // Read stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.delta) {
                  fullResponse += parsed.delta;
                  // Update message as it streams
                  setMessages((prev) => {
                    const updated = [...prev];
                    if (updated[updated.length - 1]?.role === 'assistant') {
                      updated[updated.length - 1].content = fullResponse;
                    }
                    return updated;
                  });
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        // Add full assistant message
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: fullResponse,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request cancelled');
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          console.error('Chat error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, model, options.systemPrompt]
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setConversationId(undefined);
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    model,
    setModel,
    sendMessage,
    stop,
    reset,
  };
}
