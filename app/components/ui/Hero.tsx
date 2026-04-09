"use client";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
// Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';


// Dummy garment images for the slider
const heroSlides = [
  { id: 1, image: '/assets/hero_1.png', name: 'Agabada 1' },
  { id: 2, image: '/assets/hero_2.png', name: 'Kaftan 1' },
  { id: 3, image: '/assets/hero_3.png', name: 'Agbada 2' },
  { id: 4, image: '/assets/hero_4.png', name: 'Agabada 1 (Rep)' },
  { id: 5, image: '/assets/hero_5.png', name: 'Kaftan 1 (Rep)' },
];

export default function Hero() {
  return (
    <section className=" py-12 md:py-16 ">
      <div className=" mx-auto  grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text */}
        <div className="space-y-8 max-w-lg px-6 lg:px-10">
          <h1 className="text-5xl md:text-6xl font-luxury font-medium tracking-tight leading-tight">
            SHARP LOOKS.<br />BOLD MOVES.
          </h1>
          <p className="text-neutral-600 text-lg">
            Crafted for your Elegance, Absolute Comfort, & Confidence. Discover traditional wear redefined for the modern man.
          </p>
          <Link href='/shop'>
              <button className="cursor-pointer flex items-center gap-2.5 bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-neutral-800 transition">
                VIEW MORE
                <ArrowRight className="h-5 w-5" />
              </button>
          </Link>
       
        </div>

        {/* Right Column: Garment Slider */}
    <div className="relative w-full h-[60vh] md:h-[60vh] overflow-hidden rounded-lg shadow-2xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"              // Smooth luxury transition
            spaceBetween={0}           // No gaps between full-screen slides
            slidesPerView={1}          // Only one image at a time
            centeredSlides={true}
            loop={true}                // Infinite loop
            autoplay={{
              delay: 2000,             // Auto-slide every 4 seconds
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {heroSlides.map((slide) => (
            // {INITIAL_PRODUCTS.map((slide) => (
              <SwiperSlide key={slide.id} className="relative w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.name}
                    fill
                    // width={900}
                    // height={200}
                    className="object-cover transition-transform duration-[5000ms] scale-100 group-hover:scale-110"
                    style={{ objectPosition: 'center' }}
                    priority
                  />
                  {/* Subtle dark overlay to make text pop if needed */}
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
    </div>

      </div>
    </section>
  );
}