"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Swiper Engine Core Components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Application State Connections
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProducts } from '@/app/store/slices/productSlice';
import { ProductSkeleton } from '@/app/components/ui/Loading';
import ProductCard from '../components/ui/ProductCard';

// Icons
import { 
  ArrowRight, 
  ArrowLeft, 
  Scissors, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  ShoppingBag, 
  SlidersHorizontal,
  Percent
} from 'lucide-react';
import { trackReferralEvent } from '../lib/referrals/referralTracker';

const heroSlides = [
  { 
    id: 1, 
    image: '/assets/hero_1.png', 
    tag: 'NEW IN // SS26', 
    title: 'The Signature Agbada Collection', 
    CTA: 'Shop New Arrivals' 
  },
  { 
    id: 2, 
    image: '/assets/hero_2.png', 
    tag: 'MINIMALIST LINE', 
    title: 'Architectural Kaftans & Tunics', 
    CTA: 'Explore Tailoring' 
  },
  { 
    id: 3, 
    image: '/assets/hero_3.png', 
    tag: 'PREMIUM VELVET', 
    title: 'Nocturnal Royal Velvet Drops', 
    CTA: 'View Collection' 
  },
  { 
    id: 4, 
    image: '/assets/hero_4.png', 
    tag: 'RESORT CAPSULE', 
    title: 'Luxe Silk & Linen Coordinates', 
    CTA: 'Discover Resort Wear' 
  },
  { 
    id: 5, 
    image: '/assets/hero_5.png', 
    tag: 'CEREMONIAL EDIT', 
    title: 'Intricate Hand-Embroidered Capes', 
    CTA: 'Explore the Edit' 
  },
];

const retailCategories = [
  { name: "Agbadas", count: "24 Items", slug: "agbada", image: "/assets/hero_4.png" },
  { name: "Kaftans", count: "18 Items", slug: "kaftans", image: "/assets/hero_5.png" },
  { name: "Capsule Sets", count: "12 Items", slug: "capsules", image: "/assets/hero_1.png" },
  { name: "Bespoke Cuts", count: "Made-to-Measure", slug: "custom", image: "/assets/hero_2.png", isCustom: true },
];

/* ==========================================
   1. HERO RETAIL BANNER (High-Conversion Hero)
   ========================================== */
function Hero() {
  useEffect(() => {
    trackReferralEvent({ eventType: "visit" });
  }, []);

  return (
    <section className="bg-white text-neutral-900 border-b border-neutral-200">
      {/* Retail Global Utility Shipping Ribbon */}
      <div className="w-full bg-neutral-950 text-white py-2.5 px-4 text-center text-[11px] font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2">
        <Percent className="w-3 h-3 text-amber-400" />
        <span>Complimentary Worldwide Express Delivery on Orders Over $350</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[80vh] bg-neutral-100 rounded-lg overflow-hidden group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              renderBullet: (index, className) => `<span class="${className} storefront-bullet"></span>`
            }}
            className="h-full w-full"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id} className="relative w-full h-full bg-neutral-100">
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                   sizes="(max-w-1440px) 100vw, 1440px"
                    className="object-cover object-top"
                    quality={95}
                    // className="object-cover object-top"
                    priority
                  />
                  {/* High-contrast commercial vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/20 to-transparent" />
                  
                  {/* Left-Aligned Retail Content Card */}
                  <div className="absolute inset-y-0 left-0 flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24 max-w-xl text-white z-10 space-y-4">
                    <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full uppercase">
                      {slide.tag}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight uppercase font-sans">
                      {slide.title}
                    </h2>
                    <p className="text-neutral-200 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
                      Experience structural precision patterns built exclusively from authentic high-density fiber blends.
                    </p>
                    <div className="pt-2">
                      <Link href='/shop'>
                        <button className="flex items-center gap-2 bg-white text-neutral-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-md">
                          <ShoppingBag className="w-4 h-4" />
                          {slide.CTA}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .storefront-bullet {
          width: 8px !important;
          height: 8px !important;
          background: rgba(255, 255, 255, 0.4) !important;
          opacity: 1 !important;
          transition: all 0.3s ease;
          display: inline-block;
          margin: 0 5px !important;
          border-radius: 9999px !important;
        }
        .swiper-pagination-bullet-active.storefront-bullet {
          background: #ffffff !important;
          transform: scale(1.3);
        }
        .swiper-pagination {
          bottom: 24px !important;
        }
      `}</style>
    </section>
  );
}

/* ==========================================
   2. STOREFRONT DEPARTMENTS (Category Grid)
   ========================================== */
function CategoryShowcase() {
  return (
    <section className="py-16 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h3 className="text-lg font-bold tracking-tight uppercase text-neutral-900">Collection</h3>
            <p className="text-xs text-neutral-500 font-light">Explore targeted collections cut to perfect specifications.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {retailCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.isCustom ? `/shop?category=${cat.slug}` : `/shop?category=${cat.slug}`}
              // href={cat.isCustom ? '/custom-order' : `/shop?category=${cat.slug}`}
              className="group relative h-[320px] bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200/60 flex flex-col justify-end p-5 transition-all duration-300 hover:shadow-md hover:border-neutral-300"
            >
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill
                sizes="(max-w-[1440px]) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
              
              <div className="relative z-10 w-full flex justify-between items-end text-white">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold tracking-wide uppercase">{cat.name}</h4>
                  <p className="text-[11px] text-neutral-300 font-mono">{cat.count}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-md group-hover:bg-white group-hover:text-neutral-950 transition-colors duration-300 text-white">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   3. CURATED RETAIL SHELF (Product Grid)
   ========================================== */
function BestSellers() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const showcaseProducts = items && items.length > 0 
    ? items.filter((p: any) => p.name).slice(0, 8) 
    : items?.slice(0, 8);

  return (
    <section className="py-20 bg-neutral-50 border-b border-neutral-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Marketplace Control Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight uppercase text-neutral-900">Trending Now</h3>
            <p className="text-xs text-neutral-500 font-light">High-demand items moving fast through fulfillment processing.</p>
          </div>
          
          {/* Quick-Filter Utility Interactions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/shop" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 rounded-md hover:bg-neutral-50 transition-all shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter Catalog
              </button>
            </Link>
          </div>
        </div>
        
        {/* Loading Matrix State */}
        {status === 'loading' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {/* Dynamic Standard Retail Multi-Column Shelf Grid */}
        {status === 'succeeded' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {showcaseProducts?.map((product: any) => (
              <div key={product._id} className="bg-white border border-neutral-200 rounded-lg p-2.5 hover:shadow-lg transition-all duration-300 flex flex-col group">
                <div className="flex-1">
                  <ProductCard
                    {...product}
                    _id={product._id.toString()}
                    imageUrl={product.image} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Inventory State Fallback */}
        {status === 'succeeded' && showcaseProducts?.length === 0 && (
          <div className="text-center py-16 bg-white border border-neutral-200 rounded-lg">
            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium text-xs uppercase tracking-wider">
              Catalog replenishment in progress. Check back shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================
   4. RETAIL TRUST INFRASTRUCTURE (Value Row)
   ========================================== */
function ValueProps() {
  const infrastructurePoints = [
    { icon: <Scissors className="w-4 h-4 text-neutral-900" />, title: "Precision Fit Patterning", desc: "Garments calculated precisely to match your physical posture profile metrics." },
    { icon: <Sparkles className="w-4 h-4 text-neutral-900" />, title: "Authentic Materials", desc: "Sourced directly from heritage weaving mills utilizing heavy raw cotton base fibers." },
    { icon: <Globe className="w-4 h-4 text-neutral-900" />, title: "Global Express Handling", desc: "Insured door-to-door delivery operations with tracking telemetry integrations." },
    { icon: <ShieldCheck className="w-4 h-4 text-neutral-900" />, title: "Premium Protection", desc: "Dedicated alteration support guarantee covering construction metrics." }
  ];

  return (
    <section className="bg-white py-16 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {infrastructurePoints.map((pt, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="p-3 bg-neutral-100 rounded-lg flex-shrink-0 text-neutral-900">
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
   5. BESPOKE SERVICE MARKETING CONTEXT (Footer Callout)
   ========================================== */
function CustomOrderBanner() {
  return (
    <section className="bg-neutral-950 text-white py-20 relative overflow-hidden">
      {/* Decorative Branding Ring Overlay */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 border-8 border-white/5 rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 block">Made to Measure Atelier</span>
        <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight max-w-2xl mx-auto leading-tight">
          Can’t find your standard size configuration? Try Bespoke.
        </h2>
        <p className="text-neutral-400 font-light text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Submit your accurate physiological dimensional variables directly to our sizing engineers for customized individual pattern grading.
        </p>
        
        <div className="flex justify-center pt-4">
          <Link href='/custom-order'>
            <button className="flex items-center gap-2 bg-amber-500 text-neutral-950 px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-950/20">
              Initiate Bespoke Request
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   6. COMBINED LANDING PAGE ROOT
   ========================================== */
export default function IndexPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <Hero />
      <CategoryShowcase />
      <BestSellers />
      <ValueProps />
      <CustomOrderBanner />
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