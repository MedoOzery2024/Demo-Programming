import type {Metadata, Viewport} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../components/AuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Demo Programming | Next-Gen Learning',
  description: 'A revolutionary PWA programming education platform.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-dark-900 text-gray-100 antialiased selection:bg-gold-500/30 selection:text-gold-300 flex flex-col min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
