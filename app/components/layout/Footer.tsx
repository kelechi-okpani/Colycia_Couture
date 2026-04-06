"use client";

import Link from 'next/link';
// import { Facebook, Instagram, Twitter, MessageSquare } from 'lucide-react'; // Swapped for correct brand icons

const footerSections = [
  {
    title: "Customer Service",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "Information",
    links: [
      { name: "Shipping, Delivery & Pickup", href: "/shipping" },
      { name: "Return & Privacy Policy", href: "/policy" },
      { name: "FAQs", href: "/faqs" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#f9f9f9] text-neutral-800 font-sans border-t border-neutral-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 md:px-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-8">
            <h3 className="text-[12px] tracking-[0.25em] font-bold uppercase text-neutral-900">
              Colycia Couture
            </h3>
            {/* <div className="flex gap-4">
              {[Twitter, MessageSquare, Instagram, Facebook].map((Icon, idx) => (
                <Link key={idx} href="#" className="p-2 border border-neutral-300 rounded-full group hover:bg-black transition-colors duration-300">
                  <Icon className="h-4 w-4 text-neutral-800 group-hover:text-white" />
                </Link>
              ))}
            </div> */}

            {/* Newsletter form added here to match exact layout */}
          <div className="pt-8">
              <p className="text-[10px] tracking-[0.25em] font-bold text-neutral-500 uppercase mb-3">
                Newsletter Signup
              </p>
              <form className="flex w-full max-w-sm">
                {/* The wrapper acts as the visual input box */}
                <div className="flex items-center w-full bg-[#E5E5E5] rounded-full p-1 border border-transparent focus-within:border-neutral-400 transition-all">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-grow bg-transparent px-5 py-2 text-[11px] tracking-wide focus:outline-none placeholder:text-neutral-500 text-neutral-800" 
                  />
                  {/* The button is now nested with its own padding/margin to stay inside the gray pill */}
                  <button 
                    type="submit" 
                    className="bg-black text-white text-[10px] tracking-[0.15em] font-bold px-3 py-2.5 rounded-full hover:bg-neutral-800 transition-colors duration-300 uppercase whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Column 2 & 3: Dynamic Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-[12px] tracking-[0.25em] font-bold uppercase text-neutral-900">
                {section.title}
              </h3>
              <ul className="space-y-3.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] tracking-wide text-neutral-600 hover:text-black hover:tracking-wider transition-all">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact Info (Abuja Address) */}
          <div className="space-y-6">
            <h3 className="text-[12px] tracking-[0.25em] font-bold uppercase text-neutral-900">
              Contact Info
            </h3>
            <div className="space-y-4 text-[13px] tracking-wide text-neutral-600 leading-relaxed">
              <p className='gap-6'>
                <span className="font-bold text-neutral-800"> Address: </span> 
                <br />
                Shop FO2 Pathfield Mall,<br />
                4th Avenue Gwarimpa Abuja,<br />
                Nigeria.
              </p>
              <p>
                <span className="font-semibold text-neutral-800">Phone:</span>
                 <br />
                <Link href="tel:+2349060142148" className="hover:text-black">
                  +2349060142148
                </Link> (Calls & WhatsApp)
              </p>
              <p>
                <span className="font-semibold text-neutral-800">Email:</span>
                 <br />
                <Link href="mailto:Colyciacouture@Gmail.Com" className="hover:text-black">
                  Colyciacouture@Gmail.Com
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-neutral-100 bg-[#f9f9f9] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-[12px] tracking-wider text-neutral-500">
          © {new Date().getFullYear()} Colycia Couture, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}