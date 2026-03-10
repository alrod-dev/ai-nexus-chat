'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { MessageBubble } from './MessageBubble';
import { ModelSelector } from './ModelSelector';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Provider } from '@/types';
import { Send, Loader } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  availableProviders: Provider[];
}

export function ChatInterface({ availableProviders }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isLoading, error, sendMessage, stop, model, setModel } = useChat();
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Cmd+Enter': () => {
      if (!isLoading && input.trim()) {
        handleSend();
      }
    },
    'Ctrl+Enter': () => {
      if (!isLoading && input.trim()) {
        handleSend();
      }
    },
    Escape: () => {
      if (isLoading) {
        stop();
      }
    },
  });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput('');

    try {
      await sendMessage(userInput);
      inputRef.current?.focus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        onSelectConversation={(id) => console.log('Select:', id)}
        onNewConversation={() => setInput('')}
        onDeleteConversation={(id) => console.log('Delete:', id)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Nexus Chat
          </h1>
          <ThemeToggle />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to AI Nexus Chat
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  Start a conversation with multiple AI models. Switch between OpenAI, Anthropic,
                  and Ollama seamlessly.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Keyboard Shortcuts:
                  </p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>
                      <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">
                        Cmd/Ctrl + Enter
                      </kbd>{' '}
                      to send
                    </li>
                    <li>
                      <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">
                        Escape
                      </kbd>{' '}
                      to stop
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isLoading={isLoading && index === messages.length - 1}
            />
          ))}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
          <ModelSelector
            selectedModel={model}
            onModelChange={setModel}
            availableModels={availableProviders}
          />

          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Shift+Enter for new line)"
              disabled={isLoading}
              rows={3}
              className={clsx(
                'flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg',
                'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                'placeholder-gray-500 dark:placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'resize-none'
              )}
            />
            {isLoading ? (
              <button
                onClick={stop}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Loader size={20} className="animate-spin" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={clsx(
                  'px-4 py-3 bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2',
                  !input.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                )}
              >
                <Send size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
