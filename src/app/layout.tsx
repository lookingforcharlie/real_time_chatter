import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chatter',
  description: 'Generated by create next app',
  // icons: {
  //   icon: {
  //     url: '/favicon.png',
  //     type: 'image/png',
  //   },
  //   shortcut: { url: '/favicon.png', type: 'image/png' },
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      {/* the whole application is the {children} right here */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
