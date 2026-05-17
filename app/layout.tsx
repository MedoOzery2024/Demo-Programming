import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "DevVerse | The Ultimate Programming Ecosystem",
  description: "A world-class programming platform with live execution, project-based learning, tracking, and gamification.",
  applicationName: 'DevVerse',
  icons: {
    icon: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    title: 'DevVerse',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-black text-white selection:bg-gold-500/30 selection:text-gold-300 flex flex-col min-h-screen">
          <AuthProvider>
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
