"use client";

import Link from 'next/link';
import React from 'react';
import { 
  AiOutlineSearch, 
  AiOutlineMail, 
  AiOutlineCreditCard, 
  AiOutlineStop, 
  AiOutlineCar, 
  AiOutlineDollar, 
  AiOutlineTag 
} from 'react-icons/ai';

export default function FAQPage() {
  const faqs = [
    {
      icon: <AiOutlineMail />,
      question: "How do I change my account email?",
      answer: "You can log in to your account and change it from your Profile > Edit Profile. Then go to the general tab to change your email."
    },
    {
      icon: <AiOutlineCreditCard />,
      question: "What should I do if my payment fails?",
      answer: "If your payment fails, you can use the (COD) payment option, if available on that order. If your payment is debited from your account after a payment failure, it will be credited back within 7-10 days."
    },
    {
      icon: <AiOutlineStop />,
      question: "What is your cancellation policy?",
      answer: "You can now cancel an order when it is in packed/shipped status. Any amount paid will be credited into the same payment mode using which the payment was made."
    },
    {
      icon: <AiOutlineCar />,
      question: "How do I check order delivery status?",
      answer: "Please tap on 'My Orders' section under main menu of App/Website/M-site to check your order status."
    },
    {
      icon: <AiOutlineDollar />,
      question: "What is Instant Refunds?",
      answer: "Upon successful pickup of the return product at your doorstep, Myntra will instantly initiate the refund to your source account or chosen method of refund. Instant Refunds is not available in a few select pin codes and for all self ship returns."
    },
    {
      icon: <AiOutlineTag />,
      question: "How do I apply a coupon on my order?",
      answer: "You can apply a coupon on cart page before order placement. The complete list of your unused and valid coupons will be available under 'My Coupons' tab of App/Website/M-site."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans relative isolate">
      {/* Brand Watermark Utility */}
           <div className="about-bg-watermark" aria-hidden="true" />


      {/* Header Section */}
      <header className="bg-neutral-50 py-16 px-6 md:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">FAQs</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#113F85]">Ask us anything</h1>
          <p className="text-neutral-500 font-medium">Have any questions? We're here to assist you.</p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl" />
            <input 
              type="text" 
              placeholder="Search here" 
              className="w-full pl-12 pr-4 py-4 rounded-md border border-neutral-200 shadow-sm outline-none focus:ring-2 focus:ring-[#113F85]/20 focus:border-[#113F85] transition-all"
            />
          </div>
        </div>
      </header>

      {/* FAQ Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-2xl">
                {faq.icon}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 leading-tight">
                {faq.question}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-24 bg-neutral-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-100">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl font-bold text-neutral-900">Still have questions?</h2>
            <p className="text-neutral-500 font-light">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          </div>
          <Link href="/contact">
            <div className="bg-black text-white px-10 py-4 rounded-lg font-bold tracking-wide hover:bg-neutral-800 transition-colors active:scale-95 whitespace-nowrap">
            Get in touch
          </div>
          </Link>
        
        </section>
      </main>

      {/* Branded Footer Watermark */}
      <footer className="py-12 border-t border-neutral-100 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-300">Colycia Couture — Abuja, Nigeria</p>
      </footer>
    </div>
  );
}