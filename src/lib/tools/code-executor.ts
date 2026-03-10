import { ToolExecutor } from '@/types';

export const codeExecutorTool: ToolExecutor = {
  name: 'execute_code',

  async execute(input: Record<string, any>): Promise<string> {
    // IMPORTANT: Code execution is disabled by default for security reasons
    // Only enable this in secure environments with proper sandboxing

    const codeExecutionEnabled = process.env.ENABLE_CODE_EXECUTION === 'true';

    if (!codeExecutionEnabled) {
      return 'Error: Code execution is disabled. Enable with ENABLE_CODE_EXECUTION=true in production-grade sandbox environment only.';
    }

    const code = input.code as string;
    const language = input.language as string || 'javascript';

    if (!code || code.trim().length === 0) {
      return 'Error: Code is required';
    }

    // Only allow JavaScript execution with restrictions
    if (language !== 'javascript') {
      return `Error: Only JavaScript execution is supported. Requested: ${language}`;
    }

    try {
      // Restrict access to dangerous globals
      const sandbox = {
        console: console,
        Math: Math,
        Date: Date,
        JSON: JSON,
        isNaN: isNaN,
        isFinite: isFinite,
        parseInt: parseInt,
        parseFloat: parseFloat,
      };

      // Create a controlled function
      // eslint-disable-next-line no-new-func
      const fn = new Function(
        ...Object.keys(sandbox),
        `"use strict"; return (async () => { ${code} })()`
      );

      const result = await fn(...Object.values(sandbox));

      return `Execution result:\n${JSON.stringify(result, null, 2)}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error executing code: ${message}`;
    }
  },
};
