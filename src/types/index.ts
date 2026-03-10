export type Provider = 'openai' | 'anthropic' | 'ollama';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
}

export interface ToolResult {
  toolUseId: string;
  content: string;
}

export interface AIProvider {
  name: Provider;
  model: string;
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  stream(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    options?: ChatOptions
  ): Promise<void>;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  tools?: Tool[];
  systemPrompt?: string;
}

export interface ChatResponse {
  content: string;
  toolCalls?: ToolCall[];
  stopReason?: string;
}

export interface Tool {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolExecutor {
  name: string;
  execute(input: Record<string, any>): Promise<string>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface ConversationData {
  id: string;
  userId: string;
  title?: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
  messages: MessageData[];
}

export interface MessageData {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  createdAt: Date;
}
