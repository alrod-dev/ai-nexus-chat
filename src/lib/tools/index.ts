import { Tool, ToolExecutor } from '@/types';
import { webSearchTool } from './web-search';
import { calculatorTool } from './calculator';
import { codeExecutorTool } from './code-executor';

const toolRegistry: Record<string, ToolExecutor> = {
  web_search: webSearchTool,
  calculator: calculatorTool,
  execute_code: codeExecutorTool,
};

export function getToolDefinitions(): Tool[] {
  return [
    {
      name: 'web_search',
      description:
        'Search the web for information about a topic. Returns relevant search results with titles, URLs, and snippets.',
      input_schema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to perform',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'calculator',
      description:
        'Evaluate mathematical expressions. Supports basic arithmetic operations (+, -, *, /) and parentheses.',
      input_schema: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'The mathematical expression to evaluate (e.g., "2 * (3 + 4)")',
          },
        },
        required: ['expression'],
      },
    },
    {
      name: 'execute_code',
      description: 'Execute JavaScript code and return the result. Use with caution.',
      input_schema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The JavaScript code to execute',
          },
          language: {
            type: 'string',
            description: 'Programming language (only "javascript" is supported)',
            default: 'javascript',
          },
        },
        required: ['code'],
      },
    },
  ];
}

export function getEnabledTools(): Tool[] {
  const enableWebSearch = process.env.ENABLE_WEB_SEARCH !== 'false';
  const enableCodeExecution = process.env.ENABLE_CODE_EXECUTION === 'true';

  const allTools = getToolDefinitions();

  return allTools.filter((tool) => {
    if (tool.name === 'web_search' && !enableWebSearch) return false;
    if (tool.name === 'execute_code' && !enableCodeExecution) return false;
    return true;
  });
}

export async function executeTool(
  toolName: string,
  input: Record<string, any>
): Promise<string> {
  const tool = toolRegistry[toolName];

  if (!tool) {
    throw new Error(`Tool not found: ${toolName}`);
  }

  return tool.execute(input);
}

export function hasEnabledTool(toolName: string): boolean {
  const enabledTools = getEnabledTools();
  return enabledTools.some((tool) => tool.name === toolName);
}
