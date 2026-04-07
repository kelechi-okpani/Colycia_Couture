"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import Logo_Hero from '../../../public/assets/Logo.png';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { FiHeart } from 'react-icons/fi';
import { fetchCart } from '@/app/store/slices/cartSlice';


const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT US', href: '/about' },
  { name: 'SHOP', href: '/shop' },
  { name: 'CONTACT US', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  // const user = useSelector((state: RootState) => state.auth.user);
  // 1. Grab data from Redux
  const { user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state:any) => state.cart.items);
  const wishlistItems = useAppSelector((state:any) => state.wishlist.items);


  // 2. Fetch User Data from DB on mount
  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [user?.id, dispatch]);

  // Prevent Hydration mismatch (Server vs Client count differences)
  const cartCount = mounted ? cartItems.length : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center">
              <Image 
                src={Logo_Hero} 
                alt="Colycia Couture" 
                width={50} 
                height={50} 
                className="object-contain"
                priority 
              />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex flex-[2] justify-center items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[10px] tracking-[0.3em] font-bold text-neutral-800 hover:text-orange-900 transition-all uppercase whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex-1 flex justify-end items-center gap-5 md:gap-7">
            
            {/* User Profile / Login */}
        {mounted && (
            user?.id ? (
              <Link href="/profile">
                <User className="h-5 w-5 cursor-pointer text-neutral-600 hover:text-black transition-colors" />
              </Link>
            ) : (
              <Link href="/auth/login">
                <User className="h-5 w-5 cursor-pointer text-neutral-600 hover:text-black transition-colors" />
              </Link>
            )
          )}
                  
          

            {/* Wishlist */}
            <Link href="/wishlist" className="relative group">
              <FiHeart className="h-5 w-5 text-neutral-600 group-hover:text-red-500 transition-colors" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-in fade-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <ShoppingBag className="h-5 w-5 text-neutral-900 group-hover:text-orange-900 transition-colors" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-in fade-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-1"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral-100 shadow-xl animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col p-10 space-y-8 bg-white">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)} 
                className="text-xs tracking-[0.4em] font-bold uppercase text-neutral-900 border-b border-neutral-50 pb-4"
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile Profile Link */}
            {!user && (
               <Link 
               href="/auth/login"
               className="text-[10px] tracking-[0.4em] font-black uppercase text-orange-900 pt-4"
             >
               Sign In / Register
             </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}