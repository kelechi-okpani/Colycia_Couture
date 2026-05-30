import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import '../globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '../store/Providers';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
    <div lang="en" suppressHydrationWarning>
      <div className="font-sans" suppressHydrationWarning>
         {/* <Providers> */}
         {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
          <Navbar />
            <main className=" min-h-screen">
                {children}
            </main>
        <Footer />
        {/* </Providers> */}

      </div>
    </div>
  );
}