'use client';

import { ToolResult } from '@/types';
import clsx from 'clsx';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ToolOutputProps {
  results: ToolResult[];
}

export function ToolOutput({ results }: ToolOutputProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 my-3">
      {results.map((result) => (
        <div
          key={result.toolUseId}
          className={clsx(
            'p-3 rounded-lg text-sm',
            result.content.includes('Error')
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          )}
        >
          <div className="flex items-start gap-2">
            {result.content.includes('Error') ? (
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
            ) : (
              <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={16} />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">Tool Result</p>
              <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                {result.content}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
