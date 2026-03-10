# AI Nexus Chat

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)](https://tailwindcss.com/)

A production-grade, multi-model AI chat platform built with Next.js 14, TypeScript, and Tailwind CSS. Seamlessly switch between OpenAI's GPT-4, Anthropic's Claude, and locally-hosted Ollama models.

## Features

- **Multi-Model Support**: Unified interface for OpenAI, Anthropic, and Ollama
- **Real-Time Streaming**: Server-Sent Events (SSE) for responsive chat experience
- **Conversation Persistence**: PostgreSQL + Prisma for storing chat history
- **Function Calling**: Built-in tools for web search, calculator, and code execution
- **Authentication**: NextAuth.js with JWT sessions
- **Dark/Light Mode**: Seamless theme switching with next-themes
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Keyboard Shortcuts**: Power user features (Cmd+Enter, Escape to stop)
- **Rate Limiting**: Request throttling to prevent abuse
- **Markdown Rendering**: Full support for markdown, code syntax highlighting
- **Type-Safe**: Full TypeScript coverage for reliability

## Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        UI["React Components"]
        Hooks["Custom Hooks"]
    end

    subgraph App["Next.js App Router"]
        ChatPage["Chat Page"]
        AuthAPI["Auth Routes"]
        ChatAPI["Chat API"]
    end

    subgraph Core["Core Services"]
        ProviderFactory["Provider Factory"]
        OpenAI["OpenAI Provider"]
        Anthropic["Anthropic Provider"]
        Ollama["Ollama Provider"]
        Tools["Tool Registry"]
    end

    subgraph Tools["Available Tools"]
        WebSearch["Web Search"]
        Calculator["Calculator"]
        CodeExec["Code Executor"]
    end

    subgraph Data["Data Layer"]
        Prisma["Prisma ORM"]
        DB["PostgreSQL"]
    end

    subgraph External["External Services"]
        OpenAIAPI["OpenAI API"]
        AnthropicAPI["Anthropic API"]
        OllamaService["Ollama Service"]
    end

    UI -->|Events| Hooks
    Hooks -->|API Calls| ChatAPI
    ChatAPI -->|Routes| AuthAPI
    ChatAPI -->|Selects| ProviderFactory
    ProviderFactory -->|Dispatches to| OpenAI
    ProviderFactory -->|Dispatches to| Anthropic
    ProviderFactory -->|Dispatches to| Ollama
    ChatAPI -->|Executes| Tools
    Tools -->|Uses| WebSearch
    Tools -->|Uses| Calculator
    Tools -->|Uses| CodeExec
    ChatAPI -->|Stores| Prisma
    Prisma -->|Reads/Writes| DB
    OpenAI -->|HTTP| OpenAIAPI
    Anthropic -->|HTTP| AnthropicAPI
    Ollama -->|HTTP| OllamaService
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Next.js 14** - App Router, server components
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering with syntax highlighting

### Backend
- **Next.js API Routes** - Serverless functions
- **NextAuth.js** - Authentication & authorization
- **Prisma** - ORM with type generation
- **PostgreSQL** - Relational database

### AI/ML
- **OpenAI SDK** - GPT-4 Turbo integration
- **Anthropic SDK** - Claude 3 integration
- **Axios** - HTTP client for Ollama

### DevOps & Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **GitHub Actions** - CI/CD pipeline

## Prerequisites

- **Node.js**: 18+ (20+ recommended)
- **npm** or **yarn**
- **PostgreSQL**: 12+
- One or more API keys:
  - OpenAI API key (for GPT-4 access)
  - Anthropic API key (for Claude access)
  - Local Ollama installation (optional, for local models)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/alrod-dev/ai-nexus-chat.git
cd ai-nexus-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_nexus_chat"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# AI Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
OLLAMA_BASE_URL="http://localhost:11434"

# Features
ENABLE_WEB_SEARCH="true"
ENABLE_CODE_EXECUTION="false"

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE="30"
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 4. Database Setup

```bash
# Run migrations
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Chat

1. **Select a Model**: Choose between available AI providers (GPT-4, Claude, Ollama)
2. **Type Message**: Enter your message in the input field
3. **Send**: Press `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows/Linux)
4. **Stream Response**: Watch the AI's response stream in real-time

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Enter` | Send message |
| `Shift + Enter` | New line in message |
| `Escape` | Stop streaming response |
| `Cmd/Ctrl + N` | New conversation |
| `Cmd/Ctrl + /` | Focus on search |

### Switching Models

Click the model button at the top of the chat to switch between:
- **GPT-4 Turbo** (OpenAI)
- **Claude 3 Opus** (Anthropic)
- **Mistral** (Ollama local)

## Project Structure

```
ai-nexus-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   │   └── route.ts          # Authentication routes
│   │   │   └── chat/
│   │   │       └── route.ts          # Chat streaming endpoint
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── page.tsx                   # Main chat page
│   │   └── styles/
│   │       └── globals.css            # Global styles
│   ├── components/
│   │   ├── ChatInterface.tsx          # Main chat UI
│   │   ├── MessageBubble.tsx          # Message rendering with markdown
│   │   ├── ModelSelector.tsx          # Model switching dropdown
│   │   ├── Sidebar.tsx                # Conversation sidebar
│   │   ├── ThemeToggle.tsx            # Dark/light mode toggle
│   │   └── ToolOutput.tsx             # Tool execution results
│   ├── hooks/
│   │   ├── useChat.ts                 # Chat logic hook
│   │   └── useKeyboardShortcuts.ts   # Keyboard handling
│   ├── lib/
│   │   ├── providers/
│   │   │   ├── openai.ts              # OpenAI provider
│   │   │   ├── anthropic.ts           # Anthropic provider
│   │   │   ├── ollama.ts              # Ollama provider
│   │   │   └── index.ts               # Provider factory
│   │   ├── tools/
│   │   │   ├── web-search.ts          # Web search tool
│   │   │   ├── calculator.ts          # Calculator tool
│   │   │   ├── code-executor.ts       # Code execution tool
│   │   │   └── index.ts               # Tool registry
│   │   ├── rate-limit.ts              # Rate limiting middleware
│   │   └── prisma.ts                  # Prisma client singleton
│   └── types/
│       └── index.ts                   # TypeScript type definitions
├── prisma/
│   └── schema.prisma                  # Database schema
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI pipeline
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Design Decisions

### Multi-Provider Architecture
Each AI provider (OpenAI, Anthropic, Ollama) implements a unified `AIProvider` interface, allowing seamless switching without changing business logic. This abstraction layer prevents vendor lock-in and enables easy addition of new providers.

### Server-Sent Events (SSE)
Real-time streaming uses Server-Sent Events instead of WebSockets for simplicity. SSE works over standard HTTP, requires no server upgrade mechanism, and integrates naturally with Next.js API routes.

### Prisma ORM
Prisma provides:
- Type-safe database access
- Automatic type generation matching schema
- Built-in migration system
- Studio for visual data management

### Rate Limiting
In-memory rate limiting (sliding window) prevents abuse without external dependencies. For production with multiple instances, consider Redis-backed rate limiting.

### Tool Registry Pattern
Tools are registered in a central registry with metadata (name, description, input schema), allowing the AI to discover and use them dynamically via function calling.

### JWT Sessions
NextAuth.js JWT sessions allow stateless authentication, making the app horizontally scalable without session storage requirements.

## Development

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Running Tests

Create `tests/` directory and add Jest configuration:

```bash
npm test
```

### Building for Production

```bash
npm run build
npm run start
```

## API Reference

### POST /api/chat

Stream chat response from selected AI provider.

**Request Body:**
```json
{
  "message": "string",
  "model": "openai | anthropic | ollama",
  "conversationId": "string (optional)",
  "systemPrompt": "string (optional)"
}
```

**Response:** Server-Sent Events stream with message chunks

**Rate Limit:** 30 requests/minute per user (configurable)

### GET /api/chat

Retrieve conversations and available providers.

**Response:**
```json
{
  "conversations": [
    {
      "id": "string",
      "title": "string",
      "model": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "availableProviders": ["openai", "anthropic"],
  "enabledTools": ["web_search", "calculator"]
}
```

## Deployment

### Vercel (Recommended for Next.js)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Self-Hosted

```bash
# Build
npm run build

# Start production server
npm run start
```

For containerized deployment:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Considerations

- API keys stored in environment variables only
- NextAuth.js protects routes with JWT validation
- Rate limiting prevents brute force attacks
- Code execution tool disabled by default
- Input validation on all API endpoints
- CORS headers configured in next.config.js
- Database queries use Prisma parameterized queries (SQL injection safe)

## Performance Optimizations

- Server-side streaming for responsive chat
- Optimistic UI updates with React
- Image optimization with Next.js Image component
- Code splitting via Next.js dynamic imports
- Tailwind CSS purging for production builds
- Database indexes on frequently queried fields

## Troubleshooting

### "No AI providers configured"
Ensure at least one API key is set in `.env.local`:
- `OPENAI_API_KEY` for OpenAI
- `ANTHROPIC_API_KEY` for Anthropic
- `OLLAMA_BASE_URL` for local Ollama

### Database connection errors
- Verify PostgreSQL is running
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`
- Run migrations: `npm run db:push`

### Streaming response not working
- Check browser console for errors
- Verify API key is valid
- Try different model provider
- Check rate limiting status (429 error)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Alfredo Wiesner** (alrod-dev)
- Senior Software Engineer with 8+ years experience
- Full-stack development, cloud architecture, DevOps
- GitHub: [@alrod-dev](https://github.com/alrod-dev)
- Email: alrod.dev@gmail.com

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [OpenAI](https://openai.com/) - GPT models
- [Anthropic](https://www.anthropic.com/) - Claude models
- [Ollama](https://ollama.ai/) - Local LLM inference
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Email: alrod.dev@gmail.com
- Check existing issues for solutions

---

Built with ❤️ by [Alfredo Wiesner](https://github.com/alrod-dev)
