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
   <div className="min-h-screen bg-white text-neutral-900 pt-20 pb-24 relative isolate font-sans">
  {/* Loading Overlay */}
  {loading && (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  <main className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-xl md:text-2xl font-bold text-black">
        Your Cart ({items.length})
      </h1>
      <Link href="/shop" className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-black pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-all">
        Continue Shopping
      </Link>
    </div>

    {/* Table Headers */}
    <div className="bg-neutral-50 grid grid-cols-12 gap-4 py-4 px-6 text-[12px] font-bold text-neutral-800">
      <div className="col-span-6 md:col-span-5">Item</div>
      <div className="hidden md:block col-span-3 text-center">Quantity</div>
      <div className="hidden md:block col-span-3 text-center">Price</div>
      <div className="md:col-span-1"></div>
    </div>

    {/* Cart Items Loop */}
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <div key={`${item.productId}-${item.size}`} className="grid grid-cols-12 gap-4 py-8 px-6 items-center">
          {/* Product Details */}
          <div className="col-span-12 md:col-span-5 flex items-center gap-6">
            <img src={item.image} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 object-cover" />
            <div className="space-y-1">
              <h2 className="text-sm md:text-base font-bold text-black">{item.name}</h2>
              
              {/* <p className="text-[11px] text-neutral-500">Color: {item?.color || 'Charcoal Grey'}</p> */}
             
              <p className="text-[11px] text-neutral-500">Size: {item.size}</p>
              {/* Mobile Only: Price & Qty shown here */}
              <div className="md:hidden flex flex-col gap-2 pt-2">
                 <p className="font-bold">₦{item.price.toLocaleString()} NGN</p>
                 <div className="flex items-center border w-fit">
                    <button onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity - 1)} className="p-2"> <IoRemoveOutline /> </button>
                    <span className="px-3 text-xs">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity + 1)} className="p-2"> <IoAddOutline /> </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Desktop Quantity */}
          <div className="hidden md:flex col-span-3 justify-center">
            <div className="flex items-center border border-neutral-200">
              <button 
                onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                className="p-3 hover:bg-neutral-50 disabled:opacity-30"
                disabled={loading || item.quantity <= 1}
              >
                <IoRemoveOutline size={14} />
              </button>
              <span className="px-6 font-medium text-sm">{item.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                className="p-3 hover:bg-neutral-50"
                disabled={loading}
              >
                <IoAddOutline size={14} />
              </button>
            </div>
          </div>

          {/* Desktop Price */}
          <div className="hidden md:block col-span-3 text-center">
            <p className="font-bold text-sm tracking-tight text-neutral-800">
              {item.price.toLocaleString()}.00 NGN
            </p>
          </div>

          {/* Remove Button */}
          <div className="col-span-1 text-right">
            <button 
              onClick={() => handleRemoveItem(item.productId, item.size)}
              className="text-neutral-400 hover:text-black transition-colors p-2"
              disabled={loading}
            >
              <IoTrashOutline size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Checkout Footer Section */}
    <div className="mt-10 bg-neutral-50 py-10 px-6 md:px-10">
      <div className="max-w-md ml-auto space-y-6 text-right">
        <div className="space-y-2">
           <div className="flex justify-end items-baseline gap-4">
             <span className="text-[12px] font-bold uppercase tracking-widest text-neutral-800">Subtotal</span>
             <p className="text-lg font-bold text-black">
                ₦{totalAmount.toLocaleString()}.00 NGN
             </p>
           </div>
           <p className="text-[10px] text-neutral-400 italic">
             *Promotions, Discounts And Shipping Fees Are Calculated At Checkout
           </p>
        </div>
        
        <Link href="/checkout" className="block w-full bg-black text-white py-4 text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all text-center">
            Checkout
        </Link>
      </div>
    </div>
  </main>
</div>
  );
}