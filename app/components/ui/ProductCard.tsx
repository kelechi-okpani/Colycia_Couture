
"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoBagHandleOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { syncCartAction } from '@/app/store/slices/cartSlice';
import { toggleWishlistApi } from '@/app/store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import { trackReferralEvent } from '@/app/lib/referrals/referralTracker';

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
  
  const partnerCode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("ref") || "" : "";
  
  const isWishlisted = useAppSelector((state) => 
    state.wishlist.items.some((item) => item._id === _id)
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("Please login to add items to your bag", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return;
    }

    try {
      await dispatch(syncCartAction({
        userId: user?._id,
        productId: _id,
        quantity: 1,
        size: selectedSize,
        action: 'add'
      })).unwrap();
      
      await trackReferralEvent({
        partnerCode,
        eventType: "add_to_cart",
        metadata: {
          productId: _id,
          name: name,
          price: price,
        },
      });

      toast.success(`${name} (${selectedSize}) added to bag`, {
        icon: '👜',
        style: { borderRadius: '0px', background: '#fff', color: '#000', border: '1px solid #000' }
      });
      
      setSelectedSize('');
    } catch (error: any) {
      toast.error(error || "Failed to update bag", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Login to save to wishlist", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return;
    }
    dispatch(toggleWishlistApi({ userId: user?._id, productId: _id }));
  };

  return (
    <div className="group relative flex flex-col bg-white h-full">
      
      {/* 1. Floating Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:scale-105 transition-all duration-300"
        aria-label="Toggle Wishlist"
      >
        {isWishlisted ? (
          <IoHeart className="text-red-600 h-4 w-4" />
        ) : (
          <IoHeartOutline className="h-4 w-4 text-neutral-500" />
        )}
      </button>

      {/* 2. Image Block (Wrapped in Link) */}
      <Link href={`/shop/${_id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Image 
          src={imageUrl || '/assets/placeholder.png'} 
          alt={name} 
          fill
          quality={95} /* Overrides Next.js compression blur */
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-[1200ms] ease-out" 
        />
        {/* Subtle inner shadow for premium framing */}
        <div className="absolute inset-0 border border-black/5 pointer-events-none" />
      </Link>
      
      {/* 3. Details & Interaction Block */}
      <div className="pt-4 flex flex-col flex-grow">
        
        {/* Title & Price (Wrapped in Link) */}
        <Link href={`/shop/${_id}`} className="flex justify-between items-start gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-[9px] text-neutral-400 uppercase tracking-[0.25em] font-medium">
              {category || 'Couture'}
            </p>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-tight line-clamp-1">
              {name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-neutral-900">
              {currency}{price?.toLocaleString()}
            </p>
          </div>
        </Link>
        
        {/* Interactive Tools (Outside of Link to prevent routing bugs) */}
        <div className="mt-auto space-y-4">
          
          {/* Minimal Sizing Grid */}
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size === selectedSize ? '' : size); // Toggle off if clicked again
                }}
                className={`h-8 w-8 flex items-center justify-center text-[10px] font-semibold border transition-colors duration-200 ${
                  selectedSize === size 
                  ? 'border-neutral-900 bg-neutral-900 text-white' 
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 w-full py-3.5 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
              selectedSize 
                ? 'bg-neutral-900 text-white hover:bg-black hover:shadow-lg hover:shadow-neutral-900/20 active:scale-[0.98]' 
                : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <IoBagHandleOutline className="h-4 w-4" />
            {selectedSize ? 'Add to Bag' : 'Select a Size'}
          </button>
          
        </div>
      </div>
    </div>
  );
}
// "use client";
// import { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { IoBagHandleOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';
// import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
// import { syncCartAction } from '@/app/store/slices/cartSlice'; // Updated to match syncCartAction
// import { toggleWishlistApi } from '@/app/store/slices/wishlistSlice';
// import toast from 'react-hot-toast';
// import { trackReferralEvent } from '@/app/lib/referrals/referralTracker';

// interface ProductCardProps {
//   _id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   category?: string;
//   currency?: string;
// }

// const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// export default function ProductCard({ _id, name, price, imageUrl, category, currency = "₦" }: ProductCardProps) {
//   const dispatch = useAppDispatch();
//    const { user } = useAppSelector((state) => state.auth);
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const partnerCode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("ref") || "" : "";
//   const visitorId = typeof window !== 'undefined' ? localStorage.getItem("visitorId") || "" : "";

//   const isWishlisted = useAppSelector((state) => 
//     state.wishlist.items.some((item) => item._id === _id)
//   );


//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // 1. Validation: Ensure user is logged in
//     if (!user?._id) {
//       toast.error("Please login to add items to your bag", {
//         style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
//       });
//       return;
//     }

//     // 2. Validation: Ensure a size is picked
//     if (!selectedSize) {
//       toast.error("Please select a size", {
//         style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
//       });
//       return;
//     }

//     try {
//       // 3. Sync directly with MongoDB API
//       await dispatch(syncCartAction({
//         userId: user?._id,
//         productId: _id,
//         quantity: 1,
//         size: selectedSize,
//         action: 'add'
//       })).unwrap();
      

//          // 2. THEN track referral event
//     await trackReferralEvent({
//       partnerCode,
//       eventType: "add_to_cart",
//       metadata: {
//         productId: _id,
//         name: name,
//         price: price,
//       },
//     });

    
//       toast.success(`${name} (${selectedSize}) added to bag`, {
//         icon: '👜',
//         style: { borderRadius: '0px', background: '#fff', color: '#000', border: '1px solid #000' }
//       });
      
//       // Optional: Reset size after successful add
//       setSelectedSize('');
//     } catch (error: any) {
//       toast.error(error || "Failed to update bag");
//     }
//   };


//   const handleWishlist = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!user?._id) {
//       toast.error("Login to save to wishlist");
//       return;
//     }
//     dispatch(toggleWishlistApi({ userId: user?._id, productId: _id }));
//   };

//   return (
//     <Link href={`/shop/${_id}`} className="group cursor-pointer block">
//       <div className="relative border border-neutral-100 bg-white hover:border-neutral-300 transition-all duration-500 overflow-hidden">
        
//         {/* Wishlist Button */}
//         <button 
//           onClick={handleWishlist}
//           className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
//         >
//           {isWishlisted ? <IoHeart className="text-red-500 h-4 w-4" /> : <IoHeartOutline className="h-4 w-4 text-neutral-400" />}
//         </button>

//         {/* Product Image */}
//         <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
//           <Image 
//             src={imageUrl || '/assets/placeholder.png'} 
//             alt={name} 
//             fill 
//             className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
//           />
//         </div>
        
//         <div className="p-5 space-y-4">
//           <div className="space-y-1">
//             <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">{category || 'Couture'}</p>
//             <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight line-clamp-1">{name}</h3>
//           </div>
          
//           {/* SIZE SELECTOR */}
//           <div className="space-y-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Select Size</p>
//             <div className="flex flex-wrap gap-2">
//               {SIZES.map((size) => (
//                 <button
//                   key={size}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setSelectedSize(size);
//                   }}
//                   className={`w-9 h-9 flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
//                     selectedSize === size 
//                     ? 'border-black bg-black text-white scale-105' 
//                     : 'border-neutral-100 text-neutral-400 hover:border-neutral-400 hover:text-neutral-900'
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center justify-between pt-2">
//             <p className="text-lg font-bold text-black">{currency}{price?.toLocaleString()}</p>
//           </div>
          
//           <button 
//             onClick={handleAddToCart}
//             className="flex items-center justify-center gap-3 w-full bg-black text-white text-[11px] font-bold tracking-[0.2em] py-4 uppercase hover:bg-neutral-800 transition-all active:scale-[0.98]"
//           >
//             <IoBagHandleOutline className="h-4 w-4" />
//             Add to Bag
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// }