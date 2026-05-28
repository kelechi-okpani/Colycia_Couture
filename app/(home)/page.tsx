"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { ArrowRight, ArrowLeft, Scissors, ShieldCheck, Globe, Sparkles, ChevronRight } from 'lucide-react';

// Swiper Engine Core Components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Application State Connections
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProducts } from '@/app/store/slices/productSlice';
import { ProductSkeleton } from '@/app/components/ui/Loading';
import ProductCard from '../components/ui/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Scissors } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Globe } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

const heroSlides = [
  { id: 1, image: '/assets/hero_1.png', name: 'Signature Agbada', collection: 'The Heritage Drop' },
  { id: 2, image: '/assets/hero_2.png', name: 'Minimalist Kaftan', collection: 'Nordic-African Fusion' },
  { id: 3, image: '/assets/hero_3.png', name: 'Premium Velvet Agbada', collection: 'Nocturnal Capsule' },
];

const visualLookbooks = [
  { title: "Bespoke Agbadas", description: "Structured silhouettes cut for traditional nobility.", slug: "agbada", image: "/assets/hero_4.png", ratio: "md:col-span-7" },
  { title: "Modern Tailoring", description: "Clean lines and lightweight everyday luxury.", slug: "kaftans", image: "/assets/hero_5.png", ratio: "md:col-span-5" },
];

/* ==========================================
   1. HERO SECTION (Cinematic Asymmetric Showcase)
   ========================================== */
 function Hero() {
  return (
    <section className="bg-neutral-950 text-white min-h-[85vh] lg:min-h-screen relative flex items-center overflow-hidden">
      {/* Decorative Brand Accent Background Watermark */}
      <div className="absolute right-0 top-1/4 text-[22vw] font-black text-neutral-900/40 select-none pointer-events-none font-sans leading-none tracking-tighter">
        COLYCIA
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-4 sm:px-6 lg:px-10 py-16 lg:py-0 relative z-10">
        
        {/* Left Side Floating Text Board */}
        <div className="lg:col-span-6 space-y-8 max-w-xl order-2 lg:order-1 lg:pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 bg-neutral-100 rounded-full animate-pulse" />
            Atelier Collection 2026
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight leading-[0.95] uppercase">
              Sharp Looks.<br />
              <span className="font-serif italic font-normal text-neutral-400">Bold</span> Moves.
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-md font-light">
              Crafted for absolute elegance and effortless status. Traditional premium menswear engineered with structural architectural lines for the modern global tastemaker.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href='/shop'>
              <button className="group cursor-pointer w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-neutral-950 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300">
                Shop The Drop
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href='/custom-order'>
              <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-widest border border-neutral-800 hover:border-neutral-500 text-neutral-300 transition-all">
                Request Bespoke Cut
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side Inset Structural Media Window */}
        <div className="lg:col-span-6 w-full order-1 lg:order-2">
          <div className="relative w-full h-[45vh] sm:h-[55vh] lg:h-[75vh] bg-neutral-900 border border-neutral-800/60 shadow-2xl overflow-hidden p-3">
            {/* Frame Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neutral-700 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neutral-700 z-20 pointer-events-none" />

            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ 
                clickable: true,
                renderBullet: (index, className) => `<span class="${className} custom-luxury-bullet"></span>`
              }}
              className="h-full w-full bg-neutral-950"
            >
              {heroSlides.map((slide) => (
                <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden group">
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.image}
                      alt={slide.name}
                      fill
                      className="object-cover transition-transform duration-[5000ms] scale-105 ease-out group-hover:scale-100"
                      style={{ objectPosition: 'top center' }}
                      priority
                    />
                    {/* Shadow overlay block */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                    
                    {/* Floating Context Details Tag */}
                    <div className="absolute bottom-6 left-6 z-20 text-white space-y-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">{slide.collection}</p>
                      <h3 className="text-sm uppercase tracking-wider font-medium">{slide.name}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-luxury-bullet {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          background: #404040 !important;
          opacity: 1 !important;
          transition: all 0.4s ease !important;
          display: inline-block;
          margin: 0 5px !important;
        }
        .swiper-pagination-bullet-active.custom-luxury-bullet {
          background: #ffffff !important;
          transform: scale(1.4);
        }
        .swiper-pagination {
          bottom: 24px !important;
          text-align: right !important;
          padding-right: 24px;
        }
      `}</style>
    </section>
  );
}

/* ==========================================
   2. REFINED ATELIER VALUE METRICS
   ========================================== */
 function ValueProps() {
  const points = [
    { icon: <Scissors className="w-4 h-4 text-neutral-800" />, title: "Precision Cut", desc: "Individually drafted patterns engineered to sit flawlessly." },
    { icon: <Sparkles className="w-4 h-4 text-neutral-800" />, title: "Luxe Fabrics", desc: "Rigid traditional threads mixed with soft, highly breathing cotton base fibers." },
    { icon: <Globe className="w-4 h-4 text-neutral-800" />, title: "Insured Courier", desc: "Full tracking luxury packaging dispatched securely worldwide." },
    { icon: <ShieldCheck className="w-4 h-4 text-neutral-800" />, title: "Atelier Guarantee", desc: "Lifetime warranty on stitch construction and alignment metrics." }
  ];

  return (
    <section className="bg-neutral-50 py-16 text-neutral-900 border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt, idx) => (
            <div key={idx} className="flex gap-4 items-start p-4 bg-white border border-neutral-100 hover:shadow-sm transition-shadow">
              <div className="p-3 bg-neutral-50 border border-neutral-200/70 flex-shrink-0">
                {pt.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">{pt.title}</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   3. VISUAL EDITORIAL LOOKBOOKS (Asymmetrical Grid)
   ========================================== */
 function LookbookGrid() {
  return (
    <section className="py-24 bg-white text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        
        {/* Dynamic Minimal Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-100 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Seasonal Concepts</span>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-neutral-950">The Lookbooks</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black flex items-center gap-1 transition-colors">
            Browse All Curations <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Proportion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {visualLookbooks.map((item, index) => (
            <div key={index} className={`${item.ratio} group relative h-[55vh] bg-neutral-900 overflow-hidden flex flex-col justify-end p-8 sm:p-12`}>
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover transition-transform duration-1000 scale-100 group-hover:scale-103 opacity-85"
                style={{ objectPosition: 'top center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-90" />
              
              <div className="relative z-10 space-y-3 max-w-sm text-white">
                <h3 className="text-lg sm:text-xl font-medium tracking-wide uppercase">{item.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.description}</p>
                <div className="pt-2">
                  <Link href={`/shop?category=${item.slug}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border-b border-white/60 pb-1 hover:border-white transition-colors">
                    Explore Curation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   4. BEST SELLERS SECTION (Interactive Sliding Shelf)
   ========================================== */
 function BestSellers() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const bestSellers = items && items.length > 0 
    ? items.filter((p: any) => p.name).slice(0, 8) 
    : items?.slice(0, 8);

  if (status === 'loading') {
    return (
      <section className="py-24 bg-white text-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-12 flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-neutral-100 animate-pulse" />
              <div className="h-6 w-48 bg-neutral-200 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-neutral-50 text-neutral-900 border-t border-b border-neutral-200/40">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Navigation Floating Header Wrapper */}
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 block">The Wardrobe Standard</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-950">Best Selling Pieces</h2>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button id="shelf-prev-trigger" className="cursor-pointer p-3 bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-950 hover:text-white transition-all duration-200 shadow-sm">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button id="shelf-next-trigger" className="cursor-pointer p-3 bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-950 hover:text-white transition-all duration-200 shadow-sm">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Swiper Layout Component Slider Container */}
        <div className="w-full">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '#shelf-prev-trigger',
              nextEl: '#shelf-next-trigger',
            }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="w-full"
          >
            {bestSellers?.map((product: any) => (
              <SwiperSlide key={product._id}>
                <div className="p-1.5 bg-white border border-neutral-200/50 hover:shadow-md transition-shadow duration-300">
                  <ProductCard
                    {...product}
                    _id={product._id.toString()}
                    imageUrl={product.image} 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {status === 'succeeded' && bestSellers?.length === 0 && (
          <div className="text-center py-20 bg-white border border-neutral-200 mt-6">
            <p className="text-neutral-400 font-light uppercase tracking-widest text-xs">
              The archive is resting. New additions drops are upcoming.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================
   5. MISSION COMPONENT (Minimal Elegance Callout)
   ========================================== */
 function Mission() {
  return (
    <section className="bg-white py-32 text-neutral-900 relative">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 block">The Atelier Ideology</span>
        
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide leading-relaxed text-neutral-800 max-w-2xl mx-auto font-serif italic">
          “Every single stitch carved into our garments is engineered purposefully for the global citizen who demands uncompromising excellence in every detail.”
        </blockquote>
        
        <div className="w-16 h-[1px] bg-neutral-950 mx-auto opacity-20"></div>

        <div className="flex justify-center pt-2">
          <Link href='/shop'>
            <button className="group cursor-pointer flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300">
              Discover Masterpieces
              <ArrowRight className="h-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   6. COMBINED ALTERNATIVE LANDING PAGE ROOT
   ========================================== */
export default function IndexPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <Hero />
      <ValueProps />
      <LookbookGrid />
      <BestSellers />
      <Mission />
    </main>
  );
}

// import BestSellers from "../components/ui/BestSellers";
// import Hero from "../components/ui/Hero";
// import Mission from "../components/ui/Mission";


// export default function Home() {
//   return (
//     <div className="space-y-12 relative isolate">
//       <Hero />
//       <BestSellers />
//       <Mission />
//     </div>
//   );
// }