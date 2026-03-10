import { getAvailableProviders } from '@/lib/providers';

function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: '800px', padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          AI Nexus Chat
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          marginBottom: '40px',
          lineHeight: 1.6,
        }}>
          Multi-Model AI Chat Platform supporting multiple AI providers with real-time streaming,
          conversation memory, and markdown rendering.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '40px',
          textAlign: 'left',
        }}>
          {[
            { title: 'Multi-Provider', desc: 'OpenAI, Anthropic, and Ollama support with seamless switching' },
            { title: 'Real-Time Streaming', desc: 'Token-by-token response streaming for instant feedback' },
            { title: 'Conversation Memory', desc: 'Persistent chat history with full-text search' },
            { title: 'Markdown Rendering', desc: 'Rich text with syntax highlighting and LaTeX support' },
            { title: 'Authentication', desc: 'Secure NextAuth-based user authentication system' },
            { title: 'Rate Limiting', desc: 'Built-in API rate limiting and usage analytics' },
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '0.95rem', color: '#06b6d4', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '32px',
        }}>
          {['Next.js', 'TypeScript', 'Prisma', 'NextAuth', 'OpenAI API', 'Anthropic API', 'Tailwind CSS', 'PostgreSQL'].map((tech) => (
            <span key={tech} style={{
              padding: '4px 12px',
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: '#06b6d4',
            }}>{tech}</span>
          ))}
        </div>

        <div style={{
          padding: '16px 24px',
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '8px',
          display: 'inline-block',
          fontSize: '0.9rem',
          color: '#94a3b8',
        }}>
          Demo mode — Configure environment variables for full functionality
        </div>

        <div style={{ marginTop: '32px', fontSize: '0.85rem', color: '#64748b' }}>
          Built by <a href="https://github.com/alrod-dev" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4', textDecoration: 'none' }}>Alfredo Wiesner</a>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  try {
    const { getServerSession } = await import('next-auth/next');
    const session = await getServerSession();

    if (!session) {
      return <LandingPage />;
    }

    const { ChatInterface } = await import('@/components/ChatInterface');
    const availableProviders = getAvailableProviders();
    return <ChatInterface availableProviders={availableProviders} />;
  } catch {
    return <LandingPage />;
  }
}
