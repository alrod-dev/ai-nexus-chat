import { AIProvider, Provider } from '@/types';
import { openaiProvider } from './openai';
import { anthropicProvider } from './anthropic';
import { ollamaProvider } from './ollama';

const providers: Record<Provider, AIProvider> = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
  ollama: ollamaProvider,
};

export function getProvider(name: Provider): AIProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown provider: ${name}`);
  }
  return provider;
}

export function getAvailableProviders(): Provider[] {
  const available: Provider[] = [];

  if (process.env.OPENAI_API_KEY) {
    available.push('openai');
  }
  if (process.env.ANTHROPIC_API_KEY) {
    available.push('anthropic');
  }
  if (process.env.OLLAMA_BASE_URL) {
    available.push('ollama');
  }

  return available;
}

export { openaiProvider, anthropicProvider, ollamaProvider };
