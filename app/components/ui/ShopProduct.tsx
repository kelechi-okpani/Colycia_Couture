"use client";

import Image from 'next/image';
import { IoHeartOutline } from 'react-icons/io5';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    
  // Function to handle cart logic later
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the button from triggering the card's link
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden rounded-sm">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={product.id <= 4} // Loads first 4 images faster
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1 px-1">
        <h3 className="text-[11px] md:text-[12px] font-bold tracking-wider text-neutral-800 uppercase line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center">
          <p className="text-[12px] font-medium text-neutral-500">
            ₦{product.price.toLocaleString()}
          </p>
          <button 
            className="hover:scale-110 transition-transform p-1"
            aria-label="Add to Wishlist"
          >
            <IoHeartOutline className="h-4 w-4 text-neutral-400 hover:text-black transition-colors" />
          </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full mt-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] py-3.5 uppercase hover:bg-neutral-800 transition-all duration-300 rounded-sm active:scale-[0.98]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}