"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import Logo_Hero from '../../../public/assets/Logo.png';

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT US', href: '/about' },
  { name: 'SHOP', href: '/shop' },
  { name: 'CONTACT US', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
  <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100 font-sans">
  <div className="max-w-7xl mx-auto px-4 md:px-10">
    {/* Flex container for end-to-end mobile positioning */}
    <div className="flex justify-between items-center h-15">
      
      {/* 1. START: Logo (Far Left) */}
      <div className="flex-1 flex justify-start">
        <Link href="/" className="flex items-center">
          <Image 
            src={Logo_Hero} 
            alt="Colycia Couture" 
            width={45} 
            height={45} 
            className="object-contain"
            priority 
          />
        </Link>
      </div>

      {/* 2. MIDDLE: Menu Links (Hidden on Mobile, Centered on Desktop) */}
      <div className="hidden md:flex flex-1 justify-center items-center gap-8">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="text-[11px] tracking-[0.25em] font-bold text-neutral-800 hover:text-orange-900 transition-colors uppercase whitespace-nowrap"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* 3. END: Actions & Toggle (Far Right) */}
      <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
        {/* Search and User hidden on very small screens to prevent crowding */}
        {/* <Search className="hidden sm:block h-5 w-5 cursor-pointer text-neutral-600 hover:text-black" /> */}
        <User className="hidden sm:block h-5 w-5 cursor-pointer text-neutral-600 hover:text-black" />
        
        <div className="relative cursor-pointer">
          <Link href="/cart">
               <ShoppingBag className="h-5 w-5 text-neutral-900" />
                 <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            2
          </span>
           </Link>
          
        
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-1 -mr-1"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

    </div>
  </div>

  {/* Mobile Menu Overlay */}
  {isOpen && (
    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col p-8 space-y-6">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsOpen(false)} 
            className="text-xs tracking-[0.3em] font-bold uppercase text-neutral-500 hover:text-black border-b border-neutral-50 pb-4 transition-all"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )}
</nav>
  );
}