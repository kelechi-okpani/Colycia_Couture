"use client";

import React from 'react';
import Image from 'next/image';
import { IoChevronDownOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans relative isolate">
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

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Shipping Details */}
          <div className="flex-1 space-y-10">
            <h2 className="text-2xl font-bold text-black tracking-tight">Shipping Details</h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none focus:border-black transition-colors" />
                <input type="text" placeholder="Last Name" className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none focus:border-black transition-colors" />
              </div>
              
              <input type="tel" placeholder="Phone Number" className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none focus:border-black transition-colors" />
              <input type="email" placeholder="Email" className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none focus:border-black transition-colors" />
              <input type="text" placeholder="Address" className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none focus:border-black transition-colors" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <select className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none appearance-none focus:border-black transition-colors">
                    <option>Country</option>
                    <option>Nigeria</option>
                  </select>
                  <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
                <div className="relative">
                  <select className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none appearance-none focus:border-black transition-colors">
                    <option>State/city</option>
                    <option>Abuja</option>
                    <option>Lagos</option>
                  </select>
                  <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <input type="text" placeholder="Zip Code (Optional)" className="w-full bg-white border border-neutral-200 px-4 py-4 rounded-sm outline-none focus:border-black transition-colors" />

              {/* Delivery Method Selection */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Delivery Method</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="delivery" className="w-5 h-5 accent-black" defaultChecked />
                    <span className="text-sm font-medium group-hover:text-black">Standard Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="delivery" className="w-5 h-5 accent-black" />
                    <span className="text-sm font-medium group-hover:text-black">Express Method</span>
                  </label>
                </div>
              </div>

              <button className="w-full md:w-fit bg-black text-white px-12 py-5 font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-lg">
                Get Shipping Fee
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white border border-neutral-100 p-8 shadow-sm rounded-sm space-y-8 sticky top-8">
              <h2 className="text-xl font-bold text-black border-b border-neutral-50 pb-4">Order Summary</h2>
              
              {/* Product Card */}
              <div className="flex gap-4">
                <div className="w-20 h-24 bg-neutral-100 relative overflow-hidden flex-shrink-0">
                  <Image src="/assets/suit-sample.png" alt="Product" fill className="object-cover" />
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-black">3 PIECE SUIT | CHARCOAL GREY</p>
                  <p className="text-neutral-500 font-light">Color: Charcoal Grey</p>
                  <p className="text-neutral-500 font-light">Size: Large</p>
                  <p className="text-neutral-500 font-light">Quantity: 1</p>
                  <p className="font-bold pt-1">NGN 98,500.00</p>
                </div>
              </div>

              {/* Discount Code */}
              <div className="flex gap-2">
                <input type="text" placeholder="Discount Code or Gift Card" className="flex-1 border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
                <button className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">Apply</button>
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-light">Subtotal (1)</span>
                  <span>NGN 98,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-light">Delivery Type</span>
                  <span>Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-light">Shipping Fee</span>
                  <span>0.0</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-neutral-50 pt-4">
                  <span>Total</span>
                  <span className="text-[#113F85]">NGN 98,500.00</span>
                </div>
              </div>

              {/* Secure Checkout Badge */}
              <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs uppercase tracking-widest pt-4">
                <IoShieldCheckmarkOutline className="text-lg text-green-500" />
                Secure Checkout Powered by Stripe
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-12 border-t border-neutral-100 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-300">Colycia Couture — Abuja Craftsmanship</p>
      </footer>
    </div>
  );
}