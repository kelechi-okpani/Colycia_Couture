import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Providers } from './store/Providers';


// Load luxury font
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-luxury' });
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter', 
});

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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Navbar />
        {/* We use pt-20 to account for the sticky navbar */}
        <main className="pt-20 min-h-screen">
          <Providers>
             {children}
           </Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}