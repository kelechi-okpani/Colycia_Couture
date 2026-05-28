"use client";

import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 md:p-12 font-sans relative isolate">
      {/* Brand Watermark Utility */}
        <div className="about-bg-watermark" aria-hidden="true" />


      <div className="max-w-6xl w-full space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
            Contact Us
          </h1>
          <p className="text-neutral-500 font-medium tracking-wide">
            Any question or remarks? Just write us a message!
          </p>
        </div>

        {/* Contact Card Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Column: Contact Information (Brand Blue) */}
          <div className="bg-[#113F85] text-white p-10 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-10 relative z-10">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-blue-100/70 font-light">Say something to start a live chat!</p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <FaPhoneAlt className="w-6 h-6 text-white" />
                  <span className="text-lg font-light">+234 906 014 2148</span>
                </div>
                <div className="flex items-center space-x-6">
                  <FaEnvelope className="w-6 h-6 text-white" />
                  <span className="text-lg font-light">Colyciacouture@Gmail.Com</span>
                </div>
                <div className="flex items-start space-x-6">
                  <FaMapMarkerAlt className="w-6 h-6 text-white mt-1" />
                  <span className="text-lg font-light leading-relaxed">
                    Shop F02 Pathfield Mall, 4th Avenue<br />
                    Gwarimpa Abuja, Nigeria.
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Background Circles */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl z-10" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl z-10" />
       

          </div>

          {/* Right Column: Message Form */}
          <div className="p-10 md:w-3/5 bg-white">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-600 uppercase tracking-tighter">First Name</label>
                  <input type="text" className="w-full border-b border-neutral-200 py-3 focus:border-[#113F85] outline-none transition-colors" placeholder="" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-600 uppercase tracking-tighter">Last Name</label>
                  <input type="text" className="w-full border-b border-neutral-200 py-3 focus:border-[#113F85] outline-none transition-colors" placeholder="" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-600 uppercase tracking-tighter">Email</label>
                  <input type="email" className="w-full border-b border-neutral-200 py-3 focus:border-[#113F85] outline-none transition-colors" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-600 uppercase tracking-tighter">Phone Number</label>
                  <input type="tel" className="w-full border-b border-neutral-200 py-3 focus:border-[#113F85] outline-none transition-colors" placeholder="+234 ..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-600 uppercase tracking-tighter">Write a Message</label>
                <textarea 
                  rows={4} 
                  className="w-full border-b border-neutral-200 py-3 focus:border-[#113F85] outline-none transition-colors resize-none" 
                  placeholder="How can we help you?"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button className="bg-[#6B7280] hover:bg-[#4B5563] text-white px-10 py-3 rounded-sm font-bold tracking-widest uppercase transition-all active:scale-95 shadow-lg">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}