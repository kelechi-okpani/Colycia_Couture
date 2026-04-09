"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoBagHandleOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { syncCartAction } from '@/app/store/slices/cartSlice'; // Updated to match syncCartAction
import { toggleWishlistApi } from '@/app/store/slices/wishlistSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  currency?: string;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductCard({ _id, name, price, imageUrl, category, currency = "₦" }: ProductCardProps) {
  const dispatch = useAppDispatch();
   const { user } = useAppSelector((state) => state.auth);
  const [selectedSize, setSelectedSize] = useState<string>('');


  const isWishlisted = useAppSelector((state) => 
    state.wishlist.items.some((item) => item._id === _id)
  );


  console.log(user, "user...")
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Validation: Ensure user is logged in
    if (!user?._id) {
      toast.error("Please login to add items to your bag", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return;
    }

    // 2. Validation: Ensure a size is picked
    if (!selectedSize) {
      toast.error("Please select a size", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return;
    }

    try {
      // 3. Sync directly with MongoDB API
      await dispatch(syncCartAction({
        userId: user?._id,
        productId: _id,
        quantity: 1,
        size: selectedSize,
        action: 'add'
      })).unwrap();
      
      toast.success(`${name} (${selectedSize}) added to bag`, {
        icon: '👜',
        style: { borderRadius: '0px', background: '#fff', color: '#000', border: '1px solid #000' }
      });
      
      // Optional: Reset size after successful add
      setSelectedSize('');
    } catch (error: any) {
      toast.error(error || "Failed to update bag");
    }
  };


  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?._id) {
      toast.error("Login to save to wishlist");
      return;
    }
    dispatch(toggleWishlistApi({ userId: user?._id, productId: _id }));
  };

  return (
    <Link href={`/shop/${_id}`} className="group cursor-pointer block">
      <div className="relative border border-neutral-100 bg-white hover:border-neutral-300 transition-all duration-500 overflow-hidden">
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
        >
          {isWishlisted ? <IoHeart className="text-red-500 h-4 w-4" /> : <IoHeartOutline className="h-4 w-4 text-neutral-400" />}
        </button>

        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
          <Image 
            src={imageUrl || '/assets/placeholder.png'} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
          />
        </div>
        
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">{category || 'Couture'}</p>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight line-clamp-1">{name}</h3>
          </div>
          
          {/* SIZE SELECTOR */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-9 h-9 flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    selectedSize === size 
                    ? 'border-black bg-black text-white scale-105' 
                    : 'border-neutral-100 text-neutral-400 hover:border-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-lg font-bold text-black">{currency}{price?.toLocaleString()}</p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-3 w-full bg-black text-white text-[11px] font-bold tracking-[0.2em] py-4 uppercase hover:bg-neutral-800 transition-all active:scale-[0.98]"
          >
            <IoBagHandleOutline className="h-4 w-4" />
            Add to Bag
          </button>
        </div>
      </div>
    </Link>
  );
}