'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '@/types';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  const memoizedMarkdown = useMemo(() => {
    if (isUser) {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto text-sm">
                {children}
              </code>
            ),
          pre: ({ children }) => <pre className="overflow-x-auto">{children}</pre>,
          table: ({ children }) => (
            <table className="border-collapse border border-gray-300 dark:border-gray-700 my-2">
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1">
              {children}
            </td>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 font-bold">
              {children}
            </th>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  }, [message.content, isUser]);

  return (
    <div className={clsx('flex w-full mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-2xl px-4 py-2 rounded-lg',
          isUser
            ? 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
        )}
      >
        <div className="prose dark:prose-invert max-w-none text-sm">
          {memoizedMarkdown}
        </div>

        {isLoading && (
          <div className="flex gap-1 mt-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {!isUser && !isLoading && (
          <button
            onClick={copyToClipboard}
            className="mt-2 text-xs opacity-60 hover:opacity-100 flex items-center gap-1 transition-opacity"
          >
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
