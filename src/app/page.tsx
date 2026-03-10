import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { ChatInterface } from '@/components/ChatInterface';
import { getAvailableProviders } from '@/lib/providers';

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const availableProviders = getAvailableProviders();

  return <ChatInterface availableProviders={availableProviders} />;
}
