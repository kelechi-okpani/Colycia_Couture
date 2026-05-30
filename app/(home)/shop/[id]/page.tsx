"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { 
  IoHeart, IoHeartOutline, IoChevronBack, IoChevronForward, 
  IoArrowBack, IoRemoveOutline, IoAddOutline, IoBagHandleOutline
} from 'react-icons/io5';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { syncCartAction } from '@/app/store/slices/cartSlice'; 
import { fetchProductById, clearCurrentProduct } from '@/app/store/slices/productSlice';
import { toggleWishlistApi } from '@/app/store/slices/wishlistSlice'; // Ensure this exists
import toast from 'react-hot-toast';

import SizeGuideModal from '@/app/components/ui/SizeGuide';
import MIght_Like from '@/app/components/ui/Might_Like';
import { trackReferralEvent } from '@/app/lib/referrals/referralTracker';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Redux State
  const { currentProduct: product, loading } = useAppSelector((state) => state.products) as any;
  const { user } = useAppSelector((state) => state.auth);
  
  const isWishlisted = useAppSelector((state) =>
    state.wishlist?.items?.some((item: any) => item._id === product?._id)
  );

  // Fetch product on mount
  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params?.id as string));
    }
    trackReferralEvent({
      eventType: "product_view",
      metadata: { params },
    });
    return () => { dispatch(clearCurrentProduct()); };
  }, [params.id, dispatch]);

  // Set default size once product loads
  useEffect(() => {
    if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
  }, [product]);


  // --- ACTIONS ---

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user?._id) {
      toast.error("Please login to add items to your bag", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return false; // Return false for handleBuyNow logic
    }

    if (!product?._id) return false;

    if (!selectedSize) {
      toast.error("Please select a size", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return false;
    }

    try {
      await dispatch(syncCartAction({
        userId: user._id,
        productId: product._id,
        quantity: quantity, // Fixed: Now uses the selected quantity state instead of hardcoded 1
        size: selectedSize,
        action: 'add'
      })).unwrap();
      
      toast.success(`${product.name} (${selectedSize}) added to bag`, {
        icon: '👜',
        style: { borderRadius: '0px', background: '#fff', color: '#000', border: '1px solid #000' }
      });
      return true;
      
    } catch (error: any) {
      toast.error(error || "Failed to update bag", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return false;
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    const success = await handleAddToCart(e);
    if (success) {
      router.push('/cart');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?._id) {
      toast.error("Login to save to wishlist", {
        style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
      });
      return;
    }
    // Added actual dispatch logic for wishlist
    if (product?._id) {
      dispatch(toggleWishlistApi({ userId: user._id, productId: product._id }));
    }
  };

  const images = product?.gallery?.length ? product.gallery : (product?.image ? [product.image] : []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-sm uppercase tracking-widest">Loading Details...</div>;
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900 selection:bg-black selection:text-white">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] mb-8 md:mb-12 text-neutral-500 hover:text-black transition-colors"
        > 
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* LEFT: GALLERY SECTION */}
      {/* LEFT: GALLERY SECTION */}
<div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:gap-6 w-full">
  
  {/* Thumbnails (Horizontal scroll on mobile, vertical stack on desktop) */}
  {images.length > 1 && (
    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide pb-2 md:pb-0 md:w-24 w-full">
      {images.map((img: string, i: number) => (
        <button 
          key={i} 
          onClick={() => setActiveImg(i)}
          className={`relative flex-shrink-0 w-20 md:w-full aspect-[3/4] bg-neutral-100 transition-all duration-300 overflow-hidden ${
            activeImg === i ? 'ring-1 ring-black ring-offset-2 opacity-100' : 'opacity-50 hover:opacity-100'
          }`}
        >
          <Image 
            src={img || '/assets/placeholder.png'} 
            alt={`Thumbnail ${i + 1}`} 
            fill 
            className="object-cover object-top" 
            sizes="96px"
            quality={80}
          />  
        </button>
      ))}
    </div>
  )}

  {/* Main Display (w-full ensures it never collapses to 0px on mobile) */}
  <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-neutral-100 overflow-hidden group">
    <Image 
      src={images[activeImg] || '/assets/placeholder.png'} 
      alt={product?.name || "Product Image"} 
      fill 
      className="object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
      priority 
      quality={95}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 45vw"
    />
    
    {/* Floating Wishlist Button */}
    <button 
      onClick={handleWishlist}
      className="absolute top-4 right-4 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white"
    >
      {isWishlisted ? <IoHeart className="text-red-600 h-5 w-5" /> : <IoHeartOutline className="h-5 w-5 text-neutral-600" />}
    </button>

    {/* Gallery Arrows (Always visible on mobile touch, hover on desktop) */}
    {images.length > 1 && (
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => setActiveImg(prev => (prev === 0 ? images.length - 1 : prev - 1))}
          className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-md hover:bg-black hover:text-white"
        >
          <IoChevronBack size={18} />
        </button>
        <button 
          onClick={() => setActiveImg(prev => (prev === images.length - 1 ? 0 : prev + 1))}
          className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-md hover:bg-black hover:text-white"
        >
          <IoChevronForward size={18} />
        </button>
      </div>
    )}
  </div>
</div>

          {/* RIGHT: DETAILS SECTION (Sticky on Desktop) */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0">
            <div className="lg:sticky lg:top-24">
              
              {/* Header */}
              <div className="mb-8">
                <p className="text-[10px] text-neutral-400 uppercase tracking-[0.25em] font-medium mb-3">
                  {product?.category || 'Couture Collection'}
                </p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase mb-4 leading-none">
                  {product?.name}
                </h1>
                <p className="text-xl md:text-2xl font-medium text-neutral-900">
                  ₦{product?.price?.toLocaleString()}
                </p>
              </div>

              <hr className="border-neutral-100 mb-8" />

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-[10px] font-bold uppercase mb-4 tracking-widest text-neutral-900">The Details</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {product?.description || "Experience uncompromising quality and meticulous craftsmanship. This piece is designed to make a statement while ensuring effortless comfort and style."}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Select Size</h3>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] text-neutral-500 underline underline-offset-4 hover:text-black transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-16 text-xs font-semibold border transition-all duration-300 ${
                        selectedSize === size 
                          ? 'bg-black text-white border-black shadow-md' 
                          : 'border-neutral-200 text-neutral-600 hover:border-black hover:text-black bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-10">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-4">Quantity</h3>
                 <div className="inline-flex items-center border border-neutral-200 h-12">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="px-4 h-full text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                  >
                    <IoRemoveOutline size={16} />
                  </button>
                  <span className="text-sm font-semibold w-10 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="px-4 h-full text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                  >
                    <IoAddOutline size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/20 transition-all active:scale-[0.98]"
                >
                  <IoBagHandleOutline size={16} />
                  Add To Bag
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="w-full h-14 bg-neutral-100 text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all active:scale-[0.98]"
                >
                  Buy It Now
                </button>
              </div>
              
              {/* Trust Badges / Footer text */}
              <div className="mt-8 pt-8 border-t border-neutral-100">
                <p className="text-[9px] text-neutral-400 text-center uppercase tracking-widest font-semibold">
                  Secure Delivery Nationwide &nbsp;&bull;&nbsp; Premium Packaging
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Recommended Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-100">
        <h2 className="text-lg font-black uppercase tracking-widest text-center mb-10">You Might Also Like</h2>
        <MIght_Like />
      </div>
    
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </div>
  );
}


// "use client";
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { 
//    IoHeart, IoChevronBack, IoChevronForward, 
//   IoArrowBack,
//   IoRemoveOutline,
//   IoAddOutline
// } from 'react-icons/io5';
// import { useRouter, useParams } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
// import { syncCartAction } from '@/app/store/slices/cartSlice'; 

// import { fetchProductById, clearCurrentProduct } from '@/app/store/slices/productSlice';
// import toast from 'react-hot-toast';
// import SizeGuideModal from '@/app/components/ui/SizeGuide';
// import MIght_Like from '@/app/components/ui/Might_Like';
// import { trackReferralEvent } from '@/app/lib/referrals/referralTracker';


// export default function ProductDetail() {
//   const params = useParams();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);


//   // 1. Grab data from Redux State
//   const { currentProduct: product, status, error, loading } = useAppSelector((state) => state.products) as any;
//   const { user } = useAppSelector((state) => state.auth);
//   const { loading: cartLoading } = useAppSelector((state) => state.cart);
//   const [selectedSize, setSelectedSize] = useState('L');
//   const [quantity, setQuantity] = useState(1);
//   const [activeImg, setActiveImg] = useState(0);

//   // 2. Fetch from DB via Redux on mount
//   useEffect(() => {
//     if (params.id) {
//       dispatch(fetchProductById(params?.id as string));
//     }
//       trackReferralEvent({
//         eventType: "product_view",
//         metadata: { params },
//       });
//     return () => { dispatch(clearCurrentProduct()); };
//   }, [params.id, dispatch]);

//   // Update selected size once product loads
//     useEffect(() => {
//       if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
//     }, [product]);

  
//   const isWishlisted = useAppSelector((state) =>
//     state.wishlist.items.some((item) => item._id === product?._id)
//   );

//   // --- ACTIONS ---

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//   // 1. Validation: Ensure user is logged in
//   if (!user?._id) {
//     toast.error("Please login to add items to your bag", {
//       style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
//     });
//     return;
//   }

//   // 2. Validation: Ensure product exists and a size is picked
//   if (!product?._id) return;

//     if (!selectedSize) {
//       toast.error("Please select a size", {
//         style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
//       });
//       return;
//     }

//       try {
//         // 3. Sync with MongoDB API via Redux
//         await dispatch(syncCartAction({
//           userId: user._id,
//           productId: product._id,
//           quantity: 1,
//           size: selectedSize,
//           action: 'add'
//         })).unwrap();
        
//         // FIX: Changed 'name' to 'product.name'
//         toast.success(`${product.name} (${selectedSize}) added to bag`, {
//           icon: '👜',
//           style: { borderRadius: '0px', background: '#fff', color: '#000', border: '1px solid #000' }
//         });
        
//       } catch (error: any) {
//         toast.error(error || "Failed to update bag");
//       }
//    };



//     const handleBuyNow = async () => {
//         router.push('/cart');
//       };

//       const handleWishlist = (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (!user?._id) {
//           toast.error("Login to save to wishlist");
//           return;
//         }
//       };

//      const handleUpdateQuantity = (productId: string, size: string, newQuantity: number) => {
//             if (newQuantity < 1) return; // Prevent 0 or negative quantities
            
//             dispatch(syncCartAction({
//               userId: user?._id as any,
//               productId,
//               size,
//               quantity: newQuantity,
//               action: 'update'
//             })) ;
//       };


//     const images = product?.gallery?.length ? product.gallery : [product?.image];


//   return (
//     <div className="bg-white min-h-screen  text-neutral-900 ">
//         <main className="max-w-7xl mx-auto px-2 py-6 md:py-12">
//           {/* Breadcrumb / Back */}
//           <button 
//             onClick={() => router.back()} 
//             className="flex items-center cursor-pointer gap-2 text-[11px] font-medium uppercase tracking-[0.1em] mb-8 hover:opacity-60 transition-opacity"
//           > 
//             <IoArrowBack /> Back to Shop
//           </button>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16  p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            
//             {/* GALLERY SECTION */}
//             <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
//               {/* Thumbnails - Left on Desktop, Bottom on Mobile */}
//               <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
//                 {images.map((img: string, i: number) => (
//                   <button 
//                     key={i} 
//                     onClick={() => setActiveImg(i)}
//                     className={`relative flex-shrink-0 w-16 md:w-20 aspect-[3/4] transition-all duration-300 ${
//                       activeImg === i ? 'ring-1 ring-black opacity-100' : 'opacity-60'
//                     }`}
//                   >
//                     <Image 
//                     src={product?.image} 
//                    alt="thumb" fill className="object-cover" sizes="80px" />  
//                     {/* <Image src={img} alt="thumb" fill className="object-cover" sizes="80px" /> */}
//                   </button>
//                 ))}
//               </div>

//               {/* Main Display */}
//               <div className="relative flex-1 aspect-[3/4] bg-[#F9F9F9] order-1 md:order-2 group">
//                 <Image 
//                   // src={images[activeImg]} 
//                   src={product?.image} 
//                   alt={product?.name} 
//                   fill 
//                   className="object-cover" 
//                   priority 
//                 />
                
//                 {/* Arrows */}
//                 {images.length > 1 && (
//                   <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
//                     <button 
//                       onClick={() => setActiveImg(prev => (prev === 0 ? images.length - 1 : prev - 1))}
//                       className="cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
//                     >
//                       <IoChevronBack size={20} />
//                     </button>
//                     <button 
//                       onClick={() => setActiveImg(prev => (prev === images.length - 1 ? 0 : prev + 1))}
//                       className="cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
//                     >
//                       <IoChevronForward size={20} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* DETAILS SECTION */}
//             <div className="lg:col-span-5 flex flex-col justify-center">
//               <div className="mb-8">
//                 <h1 className="text-2xl md:text-3xl font-semibold tracking-tight uppercase mb-4">{product?.name}</h1>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xl md:text-2xl font-medium">₦{product?.price?.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="mb-10">
//                 <h3 className="text-[12px] font-bold uppercase mb-3 tracking-wider">Description</h3>
//                 <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-md">
//                   {product?.description}
//                 </p>
//               </div>

//               {/* Size Selection */}
//               <div className="mb-10">
//                 <div className="flex justify-between items-end mb-4">
//                   <h3 className="text-[12px] font-bold uppercase tracking-wider">Select Size</h3>
//                   {/* <button onClick={() => setIsSizeGuideOpen(true)}
//                   className="text-[11px] underline font-medium hover:text-neutral-500">
//                     Size Guide
                  
//                   </button> */}
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
//                     <button 
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`cursor-pointer w-12 h-10 text-[13px] border transition-all ${
//                         selectedSize === size ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Quantity & Custom Measurement Row */}
//               <div className="flex items-center gap-4 mb-10">

//                       <div className="hidden md:flex col-span-3 justify-center">
//                             <div className="flex items-center border border-neutral-200">
//                               <button 
//                                 onClick={() => handleUpdateQuantity(product?._id, product?.size, product?.quantity - 1)}
//                                 className="cursor-pointer p-3 hover:bg-neutral-50 disabled:opacity-30"
//                                 disabled={loading || product?.quantity <= 1}
//                               >
//                                 <IoRemoveOutline size={14} />
//                               </button>
//                               <span className="px-6 font-medium text-sm">{product?.quantity}</span>
//                               <button 
//                                 onClick={() => handleUpdateQuantity(product?._id, product?.size, product?.quantity + 1)}
//                                 className="cursor-pointer p-3 hover:bg-neutral-50"
//                                 disabled={loading}
//                               >
//                                 <IoAddOutline size={14} />
//                               </button>
//                             </div>
//                           </div>

                          
//                 <div className="flex items-center border border-neutral-200 h-12 px-4 gap-6">
//                   <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="cursor-pointer hover:opacity-50">
//                     <IoChevronBack size={14} />
//                   </button>
//                   <span className="text-sm font-medium w-4 text-center">{quantity}</span>
//                   <button onClick={() => setQuantity(q => q + 1)} className="cursor-pointer hover:opacity-50">
//                     <IoChevronForward size={14} />
//                   </button>
//                 </div>

//                 <button
//                 onClick={() => setIsSizeGuideOpen(true)}
//                 className="cursor-pointer flex-1 h-12 border border-neutral-200 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
//                   Size Guide
//                 </button>
//               </div>

//               {/* Action Buttons */}
//               <div className="space-y-3">
//                 <button 
//                   onClick={handleAddToCart}
//                   className="cursor-pointer w-full h-14 bg-black text-white text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98]"
//                 >
//                   Add To Cart
//                 </button>
//                 <button 
//                   onClick={handleBuyNow}
//                   className="cursor-pointer w-full h-14 bg-[#F2F2F2] text-black text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all active:scale-[0.98]"
//                 >
//                   Buy Now
//                 </button>
//               </div>
              
//               <p className="mt-8 text-[10px] text-neutral-400 text-center uppercase tracking-widest font-medium">
//                 Secure Delivery Nationwide • 7-Day Exchange Policy
//               </p>
//             </div>
//           </div>
        
//         </main>
//   <div className="max-w-7xl mx-auto p-4 mb-6 border border-gray-200 rounded-lg bg-white shadow-sm">
//     <MIght_Like/>
//   </div>
    
    
//       <SizeGuideModal 
//         isOpen={isSizeGuideOpen} 
//         onClose={() => setIsSizeGuideOpen(false)} 
//       />
//     </div>
//   );
// }

