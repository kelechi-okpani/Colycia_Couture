"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoCartOutline, IoTrashOutline } from 'react-icons/io5';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { toggleWishlistApi, fetchWishlist } from '@/app/store/slices/wishlistSlice';
import { syncCartAction } from '@/app/store/slices/cartSlice'; // Use the sync action for DB consistency
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  
  // 1. Get User and Wishlist state from Redux
  const { user } = useAppSelector((state) => state.auth);
  const { items, error, status } = useAppSelector((state) => state.wishlist);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // 2. Fetch from Database on mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist(user._id));
    }
  }, [dispatch, user?._id]);

  // 3. Remove Item from Wishlist
  const handleRemove = (productId: string) => {
      if (!user?._id) return;
      dispatch(toggleWishlistApi({ userId: user._id, productId }));
    };

  // 4. Move to Cart (Sync with Database)
  const handleMoveToCart = (product: any) => {
      if (!user?._id) return;
      // Move to cart (assumes default size 'M' or similar)
      dispatch(syncCartAction({
        userId: user.id,
        productId: product._id,
        quantity: 1,
        size: 'M', 
        action: 'add'
      }));
      // Optionally remove from wishlist after adding to cart
      handleRemove(product._id);
    };
    // --- RENDER STATES ---

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 px-6 bg-white">
        <div className="relative">
            <FiHeart className="text-8xl text-neutral-50" />
            <FiHeart className="text-4xl text-neutral-200 absolute inset-0 m-auto" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-black uppercase tracking-[0.2em]">Your Wishlist is Empty</h2>
          <p className="text-neutral-400 font-light text-sm">Save your favorite pieces to find them easily later.</p>
        </div>
        <Link href="/shop" className="mt-4 bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-lg active:scale-95">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 mb-16 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight uppercase">My Wishlist</h1>
            <p className="text-neutral-400 text-xs mt-2 uppercase tracking-widest">{items.length} Items Saved</p>
          </div>
          {error && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest bg-red-50 px-3 py-1">{error}</p>}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {items.map((item) => (
            <div key={item._id} className="group flex flex-col">
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden shadow-sm">
                <Link href={`/shop/${item._id}`}>
                    <Image
                    src={item.image || '/assets/placeholder.png'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                </Link>
                
                {/* Remove Button */}
                <button 
                  onClick={() => handleRemove(item._id)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300 z-10"
                  disabled={processingId === item._id}
                >
                  <IoTrashOutline className="text-lg" />
                </button>
              </div>

              {/* Info Container */}
              <div className="mt-8 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black leading-relaxed max-w-[70%]">
                    {item.name}
                  </h3>
                  <p className="text-sm font-light text-neutral-900">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold italic">
                  {item.category || 'Luxury Collection'}
                </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleMoveToCart(item)}
                className="mt-8 flex items-center justify-center gap-3 w-full bg-white border border-neutral-200 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white hover:border-black transition-all duration-500 disabled:opacity-50 active:scale-95"
                disabled={processingId === item._id}
              >
                {processingId === item._id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <IoCartOutline className="text-lg" />
                    Move to Bag
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}