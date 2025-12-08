import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { SocketProvider } from '@/lib/socket-context';
import { Playfair_Display, Roboto } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Finding Travel Buddies - Connect with Fellow Travelers',
  description: 'Connect with travelers around the world and find compatible companions for your adventures',
  icons: {
    icon: [
      { url: '/tc_badge.png', sizes: '32x32', type: 'image/png' },
      { url: '/tc_badge.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/tc_badge.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${roboto.variable}`}>
        <SessionProvider>
          <SocketProvider>{children}</SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

