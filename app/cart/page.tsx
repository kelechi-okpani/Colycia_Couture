"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrashAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoBagHandleOutline } from 'react-icons/io5';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { syncCartAction, fetchCart } from '@/app/store/slices/cartSlice';
import toast from 'react-hot-toast';
import { IoAddOutline, IoRemoveOutline, IoTrashOutline } from 'react-icons/io5';



export default function CartPage() {
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);
  
  // 1. Grab State from Redux
  const { items, loading } = useAppSelector((state) => state.cart);
   const { user } = useAppSelector((state) => state.auth);

  // 2. Fetch fresh data from MongoDB on mount
  useEffect(() => {
    setIsMounted(true);
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user?._id]);

  // 3. Local calculation for subtotal
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // --- Handlers ---
  const handleUpdateQuantity = (productId: string, size: string, newQuantity: number) => {
      if (newQuantity < 1) return; // Prevent 0 or negative quantities
      
      dispatch(syncCartAction({
        userId: user?.id as any,
        productId,
        size,
        quantity: newQuantity,
        action: 'update'
      })) ;
    };


const handleRemoveItem = (productId: string, size: string) => {
    dispatch(syncCartAction({
      userId: user?.id as any,
      productId,
      size,
      action: 'remove'
    }));
  };

  const handleClearCart = async () => {
    if (!user?._id || !window.confirm("Are you sure you want to clear your bag?")) return;
    try {
      await dispatch(syncCartAction({ userId: user._id, action: 'clear' })).unwrap();
      toast.success("Bag cleared");
    } catch (err) {
      toast.error("Failed to clear bag");
    }
  };

  // Prevent hydration error (ensures client-side matches server-side initial render)
  if (!isMounted) return null;

  // --- RENDER STATES ---

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-6 bg-white">
        <div className="relative">
          <IoBagHandleOutline className="text-9xl text-neutral-50" />
          <IoBagHandleOutline className="text-4xl text-neutral-200 absolute inset-0 m-auto" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-black uppercase tracking-[0.3em]">Your Bag is Empty</h2>
          <p className="text-neutral-400 font-light text-sm">Pieces added to your bag will appear here.</p>
        </div>
        <Link href="/shop" className="bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-xl">
          Explore Couture
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-32 pb-24 relative isolate">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-start justify-center pt-60">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-100 pb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tighter text-black uppercase">Your Bag</h1>
            <span className="text-xs font-bold text-neutral-300 tracking-widest">({items.length} ITEMS)</span>
          </div>
          <Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-all">
            Back to Shopping
          </Link>
        </header>

        {/* Desktop Table Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
          <div className="col-span-6">Product Details</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-3 text-right">Total</div>
        </div>

        {/* Cart Items Loop */}
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.map((item) => (
        <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div>
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-sm text-gray-500">Size: {item.size}</p>
              <p className="font-semibold">${item.price}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Quantity Controls */}
            <div className="flex items-center border rounded-lg">
              <button 
                onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                className="p-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading || item.quantity <= 1}
              >
                <IoRemoveOutline size={16} />
              </button>
              <span className="px-4 font-medium">{item.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                className="p-2 hover:bg-gray-100"
                disabled={loading}
              >
                <IoAddOutline size={16} />
              </button>
            </div>

            {/* Remove Button */}
            <button 
              onClick={() => handleRemoveItem(item.productId, item.size)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              disabled={loading}
            >
              <IoTrashOutline size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>

        {/* Checkout Footer */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
                <div className="p-8 bg-neutral-50 space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Complimentary Services</h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                        Enjoy free standard shipping on all Abuja orders. Each piece is handcrafted to your size specifications.
                    </p>
                </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                        <span>Total Items</span>
                        <span>{items.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Estimated Total</span>
                        <p className="text-4xl font-bold text-black tracking-tighter">₦{totalAmount.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-4">
                    <Link href="/checkout" className="bg-black text-white py-5 px-12 text-[11px] font-black tracking-[0.4em] uppercase hover:bg-neutral-800 transition-all text-center shadow-2xl active:scale-95">
                        Proceed to Checkout
                    </Link>
                    <button 
                        onClick={handleClearCart}
                        className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-300 hover:text-red-500 transition-colors text-center py-2"
                    >
                        Clear Bag
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}