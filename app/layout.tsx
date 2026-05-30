import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Providers } from './store/Providers';
import { Toaster } from 'react-hot-toast';
import ReferralTracker from './components/admin/REF/ReferralTracker';

// Load luxury font


export const metadata: Metadata = {
  title: 'Colycia Couture | Elegance, Comfort, Style',
  description: 'Handcrafted luxury traditional wear for the modern man.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
       <Providers>
       <Toaster position="bottom-right" reverseOrder={false} />
        {/* <Navbar /> */}
        <main className="min-h-screen">
              <ReferralTracker />
             {children}
        </main>
        {/* <Footer /> */}
        </Providers>

      </body>
    </html>
  );
}