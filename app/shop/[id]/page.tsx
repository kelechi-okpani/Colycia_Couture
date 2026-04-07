"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  IoHeartOutline, IoHeart, IoChevronBack, IoChevronForward, 
  IoAdd, IoRemove, IoArrowBack, IoBagHandleOutline
} from 'react-icons/io5';
import ProductCard from '@/app/components/ui/ProductCard';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { syncCartAction } from '@/app/store/slices/cartSlice'; 
import { fetchProductById, clearCurrentProduct } from '@/app/store/slices/productSlice';
import { toggleWishlistApi } from '@/app/store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import { ProductNotFound, ProductSkeleton } from '@/app/components/ui/Loading';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // 1. Grab data from Redux State
  const { currentProduct: product, status, error } = useAppSelector((state) => state.products) as any;
  const { user } = useAppSelector((state) => state.auth);
  const { loading: cartLoading } = useAppSelector((state) => state.cart);

  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // 2. Fetch from DB via Redux on mount
  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params?.id as string));
    }
    // Cleanup: clear product when leaving page to avoid "flash" of old data next time
    return () => { dispatch(clearCurrentProduct()); };
  }, [params.id, dispatch]);

  // Update selected size once product loads
  useEffect(() => {
    if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
  }, [product]);


  console.log(product, "product...")
  
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item._id === product?._id)
  );

  // --- ACTIONS ---

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

  // 2. Validation: Ensure product exists and a size is picked
  if (!product?._id) return;

  if (!selectedSize) {
    toast.error("Please select a size", {
      style: { borderRadius: '0px', background: '#000', color: '#fff', fontSize: '12px' }
    });
    return;
  }

  try {
    // 3. Sync with MongoDB API via Redux
    await dispatch(syncCartAction({
      userId: user._id,
      productId: product._id,
      quantity: 1,
      size: selectedSize,
      action: 'add'
    })).unwrap();
    
    // FIX: Changed 'name' to 'product.name'
    toast.success(`${product.name} (${selectedSize}) added to bag`, {
      icon: '👜',
      style: { borderRadius: '0px', background: '#fff', color: '#000', border: '1px solid #000' }
    });
    
  } catch (error: any) {
    toast.error(error || "Failed to update bag");
  }
    };



    const handleBuyNow = async () => {
    // const success = await handleAddToCart(false);
        router.push('/cart');
      };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?._id) {
      toast.error("Login to save to wishlist");
      return;
    }
    // dispatch(toggleWishlistApi({ userId: user._id, productId: _id }));
  };



  // --- RENDER LOGIC ---

 if (status === 'loading') {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

  if (status === 'failed' || !product) return (
    <ProductNotFound error={error}/>
  );


  console.log(product, "product data...")
  return (
  <div className="bg-white min-h-screen pt-20">
  <main className="max-w-7xl mx-auto px-4 py-12">
    <button 
      onClick={() => router.back()} 
      className="cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 hover:text-neutral-500 transition-colors"
    > 
      <IoArrowBack /> Back to Shop
    </button>
  
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* GALLERY SECTION */}
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 order-2 md:order-1">
          {(product?.gallery?.length ? product.gallery : [product?.image]).map((img: string, i: number) => (
            <button 
              key={i} 
              onClick={() => setActiveImg(i)}
              className={`relative w-20 aspect-[3/4] border-2 transition-all duration-300 ${
                activeImg === i ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image 
                src={img} 
                alt={`Thumbnail ${i}`} 
                fill 
                className="object-cover" 
              />
            </button>
          ))}
        </div>

        {/* Main Image Display */}
        <div className="relative flex-1 aspect-[3/4] bg-neutral-50 order-1 md:order-2 group overflow-hidden shadow-sm">
          <Image 
            // FIX: Changed from product.images to product.gallery
            src={product?.gallery?.[activeImg] || product?.image} 
            alt={product?.name || "Product Image"} 
            fill 
            className="object-cover" 
            priority 
          />
          
          {/* Navigation Arrows: Only show if there's more than 1 image */}
          {product?.gallery?.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setActiveImg(prev => (prev === 0 ? product.gallery.length - 1 : prev - 1))} 
                className="bg-white/90 p-3 rounded-full hover:bg-white active:scale-90 shadow-md"
              >
                <IoChevronBack />
              </button>
              <button 
                onClick={() => setActiveImg(prev => (prev === product.gallery.length - 1 ? 0 : prev + 1))} 
                className="bg-white/90 p-3 rounded-full hover:bg-white active:scale-90 shadow-md"
              >
                <IoChevronForward />
              </button>
            </div>
          )}

          {/* Wishlist Button */}
          <button 
            onClick={() => dispatch(toggleWishlistApi({ userId: user?._id || '', productId: product?._id }))}
            className="absolute top-6 right-6 p-4 bg-white rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
          >
            {isWishlisted ? <IoHeart className="text-red-500 text-xl" /> : <IoHeartOutline className="text-xl" />}
          </button>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-4 border-b border-neutral-100 pb-8">
          <h2 className="text-3xl font-bold tracking-tight uppercase text-black">{product?.name}</h2>
          <p className="text-2xl font-light text-neutral-900">
            ₦{product?.price?.toLocaleString()}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">The Details</h3>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">{product?.description}</p>
        </div>

        {/* SIZE SELECT */}
        <div className="space-y-5">
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase">Select Size</h3>
          <div className="flex flex-wrap gap-3">
            {product?.sizes?.map((size: string) => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-14 h-14 border text-xs font-bold transition-all ${
                  selectedSize === size 
                    ? 'bg-black text-white border-black scale-105' 
                    : 'bg-white text-black border-neutral-200 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* BUY ACTIONS */}
        <div className="space-y-4 pt-6">
     <button 
          disabled={cartLoading || !product}
          onClick={handleAddToCart}
          className="w-full h-16 bg-black text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-neutral-800 disabled:bg-neutral-500 flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95"
        >
          {cartLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <IoBagHandleOutline className="text-xl" /> 
              Add To Bag
            </>
          )}
        </button>
          
          <button 
            onClick={handleBuyNow} 
            className="w-full h-16 border border-black text-black text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all duration-500 active:scale-95"
          >
            Instant Checkout
          </button>
        </div>
        
        <p className="text-center text-[10px] text-neutral-400 tracking-widest uppercase">
          Secure payments via Stripe • Nationwide Delivery
        </p>
      </div>
    </div>
  </main>
</div>
  );
}

