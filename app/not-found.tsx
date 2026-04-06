import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 | Page Not Found | Colycia Couture',
};

export default function NotFound() {
  return (
    <div className="bg-neutral-50 min-h-screen flex items-center justify-center p-6 md:p-10 font-sans">
      <div className="max-w-4xl w-full text-center space-y-12">
        
        {/* GRAPHICAL ILLUSTRATION ZONE */}
        <div className="relative w-full flex justify-center items-center h-48 md:h-64 lg:h-72">
          
          {/* THE UNIQUE "X" BUBBLE */}
          <div className="absolute left-[3%] sm:left-[10%] lg:left-[15%] top-[10%] z-20 hover:scale-110 transition-transform">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#113F85"/>
              <path d="M40 20L20 40M20 20L40 40" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* THE INNER "404" TABLET */}
          <div className="absolute inset-x-0 bottom-0 top-[20%] max-w-[500px] mx-auto z-10">
            <svg viewBox="0 0 500 240" fill="none" className="w-full h-full">
              {/* Card Base */}
              <rect x="0" y="0" width="500" height="240" rx="20" fill="white" stroke="#E6EAF0" strokeWidth="2"/>
              
              {/* Header Elements */}
              <g transform="translate(200, 20)">
                <circle cx="10" cy="10" r="8" fill="#E6EAF0"/>
                <circle cx="35" cy="10" r="8" stroke="#E6EAF0" strokeWidth="2" fill="white"/>
                <rect x="60" y="2" width="40" height="16" rx="8" stroke="#E6EAF0" strokeWidth="2" fill="white"/>
              </g>
              
              {/* Decorative Dots Grid */}
              <g transform="translate(10, 210)" fill="#E6EAF0">
                <circle cx="2.5" cy="2.5" r="2.5"/><circle cx="12.5" cy="2.5" r="2.5"/><circle cx="22.5" cy="2.5" r="2.5"/>
                <circle cx="2.5" cy="12.5" r="2.5"/><circle cx="12.5" cy="12.5" r="2.5"/><circle cx="22.5" cy="12.5" r="2.5"/>
              </g>

              {/* Animated Accents */}
              <circle cx="70" cy="30" r="10" fill="#113F85" className="animate-pulse" />
              <circle cx="390" cy="160" r="12" fill="#113F85" className="animate-pulse" />
              <circle cx="440" cy="80" r="10" fill="#113F85"/>
              <circle cx="40" cy="190" r="5" fill="#113F85" opacity="0.5"/>
              
              {/* Background 404 Text */}
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-neutral-300 text-[120px] md:text-[150px] font-extrabold tracking-tight">404</text>
            </svg>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-6 pt-10">
          <h1 className="text-3xl md:text-3xl font-bold tracking-tight text-neutral-900">
            Page not found
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-neutral-600 leading-relaxed font-light tracking-wide">
            Oops! Looks like you followed a bad link. If you think this is a problem with us, <span className="underline cursor-pointer">please tell us</span>.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-4">
          <Link href="/" className="inline-block bg-black text-white text-[12px] md:text-[13px] font-bold tracking-[0.2em] px-16 py-3 rounded-sm hover:bg-neutral-800 transition-all duration-300 uppercase shadow-lg active:scale-95 whitespace-nowrap">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}