"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  IoHeartOutline, IoHeart, IoChevronBack, IoChevronForward, 
  IoAdd, IoRemove, IoArrowBack, IoBagHandleOutline,
  IoRemoveOutline,
  IoAddOutline
} from 'react-icons/io5';
import ProductCard from '@/app/components/ui/ProductCard';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { syncCartAction } from '@/app/store/slices/cartSlice'; 

import { fetchProductById, clearCurrentProduct } from '@/app/store/slices/productSlice';
import { toggleWishlistApi } from '@/app/store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import { ProductNotFound, ProductSkeleton } from '@/app/components/ui/Loading';
import SizeGuideModal from '@/app/components/ui/SizeGuide';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);


  // 1. Grab data from Redux State
  const { currentProduct: product, status, error, loading } = useAppSelector((state) => state.products) as any;
  const { user } = useAppSelector((state) => state.auth);
  const { loading: cartLoading } = useAppSelector((state) => state.cart);

  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  console.log(product, "product..")
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


  // --- RENDER LOGIC ---


  // if (status === 'failed' || !product) return (
  //   <ProductNotFound error={error}/>
  // );
const images = product?.gallery?.length ? product.gallery : [product?.image];


  return (
<div className="bg-white min-h-screen pt-20 text-neutral-900">
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] mb-8 hover:opacity-60 transition-opacity"
        > 
          <IoArrowBack /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          
          {/* GALLERY SECTION */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            {/* Thumbnails - Left on Desktop, Bottom on Mobile */}
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-shrink-0 w-16 md:w-20 aspect-[3/4] transition-all duration-300 ${
                    activeImg === i ? 'ring-1 ring-black opacity-100' : 'opacity-60'
                  }`}
                >
                   <Image 
                  src={product?.image} 
               alt="thumb" fill className="object-cover" sizes="80px" />  
                  {/* <Image src={img} alt="thumb" fill className="object-cover" sizes="80px" /> */}
                </button>
              ))}
            </div>

            {/* Main Display */}
            <div className="relative flex-1 aspect-[3/4] bg-[#F9F9F9] order-1 md:order-2 group">
              <Image 
                // src={images[activeImg]} 
                src={product?.image} 
                alt={product?.name} 
                fill 
                className="object-cover" 
                priority 
              />
              
              {/* Arrows */}
              {images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
                  <button 
                    onClick={() => setActiveImg(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
                  >
                    <IoChevronBack size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImg(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
                  >
                    <IoChevronForward size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight uppercase mb-4">{product?.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-medium">₦{product?.price?.toLocaleString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-[12px] font-bold uppercase mb-3 tracking-wider">Description</h3>
              <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-md">
                {product?.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[12px] font-bold uppercase tracking-wider">Select Size</h3>
                <button className="text-[11px] underline font-medium hover:text-neutral-500">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 text-[13px] border transition-all ${
                      selectedSize === size ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Custom Measurement Row */}
            <div className="flex items-center gap-4 mb-10">

                    <div className="hidden md:flex col-span-3 justify-center">
                          <div className="flex items-center border border-neutral-200">
                            <button 
                              onClick={() => handleUpdateQuantity(product?._id, product?.size, product?.quantity - 1)}
                              className="p-3 hover:bg-neutral-50 disabled:opacity-30"
                              disabled={loading || product?.quantity <= 1}
                            >
                              <IoRemoveOutline size={14} />
                            </button>
                            <span className="px-6 font-medium text-sm">{product?.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(product?._id, product?.size, product?.quantity + 1)}
                              className="p-3 hover:bg-neutral-50"
                              disabled={loading}
                            >
                              <IoAddOutline size={14} />
                            </button>
                          </div>
                        </div>

                        
              <div className="flex items-center border border-neutral-200 h-12 px-4 gap-6">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="hover:opacity-50">
                  <IoChevronBack size={14} />
                </button>
                <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="hover:opacity-50">
                  <IoChevronForward size={14} />
                </button>
              </div>

              <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="cursor-pointer flex-1 h-12 border border-neutral-200 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
                Custom Measurement
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full h-14 bg-black text-white text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98]"
              >
                Add To Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full h-14 bg-[#F2F2F2] text-black text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>
            
            <p className="mt-8 text-[10px] text-neutral-400 text-center uppercase tracking-widest font-medium">
              Secure Delivery Nationwide • 7-Day Exchange Policy
            </p>
          </div>
        </div>
      </main>

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </div>
  );
}

