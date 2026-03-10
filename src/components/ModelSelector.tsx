'use client';

import { Provider } from '@/types';
import clsx from 'clsx';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: Provider[];
}

const MODEL_LABELS: Record<Provider, string> = {
  openai: 'GPT-4 Turbo',
  anthropic: 'Claude 3 Opus',
  ollama: 'Local (Mistral)',
};

export function ModelSelector({
  selectedModel,
  onModelChange,
  availableModels,
}: ModelSelectorProps) {
  if (availableModels.length === 0) {
    return (
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
        No AI providers configured. Check your environment variables.
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {availableModels.map((model) => (
        <button
          key={model}
          onClick={() => onModelChange(model)}
          className={clsx(
            'px-3 py-2 rounded-lg font-medium text-sm transition-colors',
            selectedModel === model
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          {MODEL_LABELS[model]}
        </button>
      ))}
    </div>
  );
}
