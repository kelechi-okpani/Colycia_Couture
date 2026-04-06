"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// High-quality icons from React Icons
import { FaTrashAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoBagHandleOutline } from 'react-icons/io5';

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 98500;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans relative isolate">
      {/* Brand Watermark Utility */}
  <div 
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.02] overflow-hidden"
        style={{ 
          backgroundImage: "url('/assets/bg_1.png')", 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <IoBagHandleOutline className="text-3xl text-[#113F85]" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
              Your Cart (1)
            </h1>
          </div>
          <Link 
            href="/shop" 
            className="text-sm font-medium uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors inline-block w-fit"
          >
            Continue Shopping
          </Link>
        </header>

        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-100 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          <div className="col-span-6">Item</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-3 text-right">Price</div>
        </div>

        {/* Cart Item */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-neutral-100 items-center">
          {/* Item Details */}
          <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
            <div className="w-24 h-32 relative bg-neutral-100 flex-shrink-0 shadow-sm">
              <Image 
                src="/assets/suit-sample.png" 
                alt="3 Piece Suit"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-black">3 Piece Suit</h3>
              <p className="text-sm text-neutral-500 font-light">Color: Charcoal Grey</p>
              <p className="text-sm text-neutral-500 font-light">Size: Large</p>
              {/* Mobile Only Trash Icon */}
              <button className="md:hidden pt-2 text-neutral-400 hover:text-red-500 transition-colors">
                <FaTrashAlt size={16} />
              </button>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
            <div className="flex items-center border border-neutral-200 rounded-sm bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-3 hover:bg-neutral-50 transition-colors text-neutral-600"
              >
                <FaChevronLeft size={12} />
              </button>
              <span className="px-6 py-2 font-bold min-w-[3.5rem] text-center text-black">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-3 hover:bg-neutral-50 transition-colors text-neutral-600"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Price & Desktop Remove */}
          <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-8">
            <span className="text-lg font-bold text-black">
              ₦{(unitPrice * quantity).toLocaleString()}.00 NGN
            </span>
            <button className="hidden md:block text-neutral-300 hover:text-red-600 transition-colors">
              <FaTrashAlt size={18} />
            </button>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="mt-12 flex flex-col items-end space-y-6">
          <div className="text-right space-y-2">
            <div className="flex items-baseline justify-end gap-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Subtotal</span>
              <span className="text-3xl font-bold text-black">
                ₦{(unitPrice * quantity).toLocaleString()}.00 NGN
              </span>
            </div>
            <p className="text-xs text-neutral-400 italic font-light max-w-xs ml-auto">
              *Promotions, Discounts And Shipping Fees Are Calculated At Checkout
            </p>
          </div>

 <Link href="/checkout" >
      <button className="w-full  bg-black text-white py-3 px-4 rounded-sm font-bold tracking-[0.2em] uppercase hover:bg-neutral-900 transition-all active:scale-[0.98] shadow-xl">
                Checkout
              </button>
            </Link>
       
        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-neutral-50 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-300">
          Colycia Couture — Proudly Crafted in Abuja
        </p>
      </footer>
    </div>
  );
}