
import Link from 'next/link';
import { IoSearchOutline } from 'react-icons/io5';


export const ProductSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {/* Image Placeholder */}
    <div className="bg-neutral-200 aspect-[3/4] w-full" />
    {/* Text Placeholders */}
    <div className="space-y-2">
      <div className="h-3 bg-neutral-200 w-3/4" />
      <div className="h-3 bg-neutral-200 w-1/4" />
    </div>
  </div>
);



export const ProductNotFound = ({error, resetSearch }: {error?: any, resetSearch?: () => void }) => (
  
  <div className="flex flex-col items-center justify-center py-40 px-4 text-center">
    <div className="mb-6 p-6 bg-neutral-50 rounded-full">
      <IoSearchOutline className="text-4xl text-neutral-300" />
    </div>
    <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-2">
            <p className="text-neutral-500 uppercase tracking-widest text-xs">{error || " No Products Found"}</p>

     </h3>
    <p className="text-neutral-500 text-xs font-light max-w-xs leading-relaxed mb-8">
      We couldn't find anything matching your current selection. 
      Try adjusting your filters or browsing our new arrivals.
    </p>
    <Link href='/shop'> 
     <button 
      className="h-12 px-8 border border-black text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500"
    >
      View All Products
    </button>

    </Link>
    
  </div>
);