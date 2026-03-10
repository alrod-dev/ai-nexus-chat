import axios from 'axios';
import { ToolExecutor } from '@/types';

export const webSearchTool: ToolExecutor = {
  name: 'web_search',

  async execute(input: Record<string, any>): Promise<string> {
    const query = input.query as string;

    if (!query || query.trim().length === 0) {
      return 'Error: Query is required';
    }

    try {
      // Using Google Custom Search API - requires GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID
      const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
      const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

      if (!apiKey || !engineId) {
        return 'Error: Google Search API not configured. Set GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID environment variables.';
      }

      const response = await axios.get(
        'https://www.googleapis.com/customsearch/v1',
        {
          params: {
            q: query,
            key: apiKey,
            cx: engineId,
            num: 5,
          },
          timeout: 10000,
        }
      );

      if (!response.data.items || response.data.items.length === 0) {
        return `No search results found for "${query}"`;
      }

      const results = response.data.items.map(
        (item: any, index: number) =>
          `${index + 1}. ${item.title}\nURL: ${item.link}\nSnippet: ${item.snippet}`
      );

      return results.join('\n\n');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error performing web search: ${message}`;
    }
  },
};
