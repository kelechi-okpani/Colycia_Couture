import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Mission() {
  return (
    <section className="bg-neutral-50 py-24 border-y border-neutral-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center space-y-10">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
          ELEGANCE. COMFORT. STYLE.
        </h3>
        <blockquote className="text-4xl md:text-5xl font-luxury font-medium tracking-tight leading-snug">
          “Indulge in The Art Of Dressing With Colycia Couture, Every Stitch is Designed For The Man Who Demands Excellence in Every Detail.”
        </blockquote>
        <div className="flex justify-center">
          <Link href='/shop'>
            <div className="cursor-pointer flex items-center gap-2.5 bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-neutral-800 transition">
                SHOP NOW
                <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
          
        </div>
      </div>
    </section>
  );
}