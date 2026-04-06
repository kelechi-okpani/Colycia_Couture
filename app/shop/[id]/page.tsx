"use client";

import { useState } from 'react';
import Image from 'next/image';
import { 
  IoHeartOutline, 
  IoChevronBack, 
  IoChevronForward, 
  IoAdd, 
  IoRemove,
  IoSearchOutline,
  IoCartOutline,
  IoArrowBack
} from 'react-icons/io5';
import ProductCard from '@/app/components/ui/ProductCard';
import { useRouter } from 'next/navigation';

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const router = useRouter();


// Fix: Navigation Logic
const handlePrev = () => {
  setActiveImg((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
};

const handleNext = () => {
  setActiveImg((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
};

  // Data from your latest uploaded images
  const product = {
    name: "3 PIECE SUIT | CHARCOAL GREY",
    price: 98500,
    description: "A three piece suit designed in charcoal grey and an inner white shirt.",
    images: ["/shop/8.png", "/shop/29.png", "/shop/6.png", "/shop/10.png"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  };

  const relatedProducts = [
    { id: 5, name: "AGBADA 004 | ARMY GREEN", price: 98500, image: "/shop/5.png" },
    { id: 10, name: "KAFTAN 001", price: 98500, image: "/shop/10.png" },
    { id: 3, name: "AGBADA 003 | CREAM", price: 98500, image: "/shop/3.png" },
    { id: 7, name: "DANSIKI 001 | DARK BLUE", price: 98500, image: "/shop/7.png" }
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">


      <main className="max-w-7xl mx-auto px-4 py-12">

        <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 hover:text-neutral-500 transition-colors group"
      >
        <IoArrowBack className="text-sm group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </button>
      
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 order-2 md:order-1">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 aspect-[3/4] border-2 transition-all ${activeImg === i ? 'border-black' : 'border-transparent'}`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 aspect-[3/4] bg-white order-1 md:order-2 group">
              <Image src={product.images[activeImg]} alt="main" fill className="object-cover" />
             <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
              aria-label="Previous image"
            >
              <IoChevronBack />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
              aria-label="Next image"
            >
              <IoChevronForward />
            </button>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-widest uppercase">{product.name}</h2>
              <p className="text-xl font-medium">₦{product.price.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Description</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {/* SIZE SELECT */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold tracking-widest uppercase">Select Size</h3>
                <button className="text-[10px] underline tracking-widest uppercase font-bold">Size Guide</button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-200 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY & CUSTOM MEASURE */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center border border-neutral-200 h-14 px-4 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><IoRemove /></button>
                <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}><IoAdd /></button>
              </div>
              <button className="flex-1 min-w-[200px] h-14 border border-neutral-200 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors">
                Custom Measurement
              </button>
            </div>

            {/* BUY ACTIONS */}
            <div className="space-y-3 pt-4">
              <button className="w-full h-14 bg-black text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all">
                Add To Cart
              </button>
              <button className="w-full h-14 border border-black text-black text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <section className="mt-32">
          <h2 className="text-center text-xl font-bold tracking-[0.3em] uppercase mb-16 underline underline-offset-[12px]">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {relatedProducts.map(item => (
              <ProductCard key={item.id}   
              id={item.id} 
               {...product} 
                imageUrl={item.image}/>
            ))}
          
          </div>
        </section>
      </main>

  
    </div>
  );
}