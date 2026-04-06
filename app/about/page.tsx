"use client";

import Image from 'next/image';
import Link from 'next/link';
// import BG from "../../public/assets/BG.png"

export default function AboutPage() {
  return (
  <div className="min-h-screen bg-white text-neutral-900 font-sans relative isolate">
     <div className="about-bg-watermark" aria-hidden="true" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:px-10 md:py-32 lg:py-40">
        
        <section className="space-y-12 md:space-y-16">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-950">
            About Colycia Couture
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-12 lg:gap-x-16 gap-y-10">
          
            <p className="md:col-span-12 lg:col-span-10 text-base md:text-lg text-neutral-700 leading-relaxed font-light tracking-wide">
              At Colycia couture, we’re more than just a shopping platform; it’s where premium style meets effortless convenience. We’ve curated a world-class fashion destination for the modern shopper who values quality and speed. With our simplified sizing systems and a curated variety of high-end pieces, we’ve removed the guesswork from online shopping, we’re here to revolutionize how you shop, making it a pleasure and a way to express your true self.
            </p>

            
            <p className="md:col-span-12 lg:col-span-11 text-base md:text-lg text-neutral-700 leading-relaxed font-light tracking-wide">
              Since 2023, we’ve been on a mission to prove that high fashion and everyday comfort belong together. Proudly designed and handcrafted in Abuja, Nigeria, our pieces are never mass-produced every item is custom-made to order to ensure a flawless, individual fit. With over 150,000 items sold across 5+ countries, we’ve helped 1,000+ global customers find their unique style. No matter where you are in the world, we ship our signature Abuja craftsmanship straight to your door.
            </p>
          </div>
        </section>

        {/* Call to Action Bar (Matches design exactly) */}
        <section className="mt-24 md:mt-32 pt-16 border-t border-neutral-100">
          <p className="text-base md:text-xl font-medium tracking-wide text-neutral-900 leading-relaxed max-w-5xl">
            Ready to revolutionize your closet?{" "}
            <Link 
              href="/signup" 
              className="text-[#113F85] font-bold underline underline-offset-4 hover:text-[#0a295c] transition-colors"
            >
              Sign up
            </Link>{" "}
            now and discover shopping made easier.
          </p>
        </section>
        

        <div className="absolute bottom-10 inset-x-0 z-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <Image 
            src="/brand/footer-watermark.png" 
            alt="Colycia Watermark"
            width={800}
            height={200}
            className="w-[80%] md:w-[60%] lg:w-[40%] h-auto object-contain"
          />
        </div>
      </main>
    </div>
  );
}