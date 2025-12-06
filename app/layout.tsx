import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { SocketProvider } from '@/lib/socket-context';

export const metadata: Metadata = {
  title: 'Trip Companion - Find Your Travel Partners',
  description: 'Connect with travelers and find compatible companions for your trips',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SocketProvider>{children}</SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

