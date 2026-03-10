import { ToolExecutor } from '@/types';

// Simple safe math expression evaluator
function safeEval(expression: string): number {
  // Remove whitespace
  const sanitized = expression.replace(/\s/g, '');

  // Only allow digits, operators, parentheses, and decimal points
  if (!/^[\d+\-*/().]+$/.test(sanitized)) {
    throw new Error('Invalid characters in expression');
  }

  // Use Function constructor as a safer alternative to eval
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${sanitized}`)();

    if (typeof result !== 'number' || isNaN(result)) {
      throw new Error('Invalid calculation result');
    }

    return result;
  } catch (error) {
    throw new Error('Failed to evaluate expression');
  }
}

export const calculatorTool: ToolExecutor = {
  name: 'calculator',

  async execute(input: Record<string, any>): Promise<string> {
    const expression = input.expression as string;

    if (!expression || expression.trim().length === 0) {
      return 'Error: Expression is required';
    }

    try {
      const result = safeEval(expression);
      return `${expression} = ${result}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error: ${message}`;
    }
  },
};
