"use client";

import { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProducts } from '@/app/store/slices/productSlice';
import { ProductSkeleton } from '@/app/components/ui/Loading';

export default function MIght_Like() {
  const dispatch = useAppDispatch();
  
  // 1. Grab products and status from Redux Store
  const { items, status, error } = useAppSelector((state) => state.products);

  // 2. Fetch data from MongoDB via API on component mount
    useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // 3. Logic: Filter for 'featured' items or simply show the top 8 products
  const bestSellers = items && items.length > 0 
    ? items.filter((p: any) => p.name).slice(10, 18) 
    : items?.slice(10, 18);

  // --- RENDER STATES ---


  // Loading State: Show skeletons while fetching
  if (status === 'loading') {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-3xl font-luxury font-medium tracking-widest text-center mb-16 uppercase">
          YOU MIGHT ALSO LIKE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  // if (status === 'failed') {
  //   return (
  //     <div className="py-24 text-center">
  //       <p className="text-red-500 text-sm tracking-widest uppercase">Error loading products: {error}</p>
  //     </div>
  //   );
  // }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-luxury font-medium tracking-[0.2em] text-center text-black uppercase">
           YOU MIGHT ALSO LIKE
          </h2>
          <div className="w-16 h-[1px] bg-black mt-4"></div>
        </div>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestSellers?.map((product: any) => (
            // <ProductCard 
            //   key={product._id} 
            //   _id={product._id} 
            //   name={product.name} 
            //   price={product.price} 
            //   imageUrl={product.image} // Mapping DB 'image' to 'imageUrl'
            // />

               <ProductCard
                 key={product._id}
                 {...product}
                 _id={product._id.toString()}
                 imageUrl={product.image} 
               />
          ))}
        </div>

        {/* Empty State */}
        {status === 'succeeded' && bestSellers?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-neutral-400 font-light uppercase tracking-widest text-xs">
              New collection arriving soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}