import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF5E14',
};

export const metadata: Metadata = {
  title: 'BOLO INDIA — India Has a Lot to Say. Let\'s Make Speaking Easier.',
  description: 'An independent voice-first platform tailored for Indian communication habits, multilingual code-switching, and hands-free productivity.',
  keywords: ['voice computing', 'Bolo India', 'speech to text India', 'Hinglish voice notes', 'Wispr Flow concept'],
  authors: [{ name: 'Bolo India' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cream text-charcoal bg-rangoli-pattern antialiased selection:bg-saffron selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

