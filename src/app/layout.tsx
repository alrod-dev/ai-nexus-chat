import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Nexus Chat - Multi-Model AI Platform',
  description:
    'A professional chat platform supporting multiple AI providers including OpenAI, Anthropic, and Ollama',
  keywords: ['AI', 'Chat', 'OpenAI', 'Anthropic', 'Ollama', 'Multi-model'],
  authors: [{ name: 'Alfredo Wiesner' }],
  creator: 'Alfredo Wiesner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
