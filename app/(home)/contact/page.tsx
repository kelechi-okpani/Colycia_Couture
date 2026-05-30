"use client";

import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import toast from "react-hot-toast";
import { submitContact } from "@/app/store/slices/contactSlice";
import { trackReferralEvent, trackVisit } from "@/app/lib/referrals/referralTracker";

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { submitStatus } = useAppSelector((state) => state.contact);

  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
       trackReferralEvent({ eventType: "visit" });
       trackVisit();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim()))
      return "Please enter a valid email address";

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(form.phone.trim()))
      return "Please enter a valid phone number";

    if (form.message.trim().length < 10)
      return "Message must be at least 10 characters";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await dispatch(
        submitContact({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          status: "new",
        })
      ).unwrap();

      toast.success("Message sent successfully");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(error || "Failed to send message");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f4f7fa] flex items-center justify-center p-4 md:p-12 overflow-hidden font-sans text-neutral-800 selection:bg-blue-500 selection:text-white">
      {/* Background Graphic elements matching the circle motif in image_4ced1f.png */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/5 to-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div 
        className={`max-w-6xl w-full space-y-10 relative z-10 transition-all duration-1000 ease-out transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            Contact Us
          </h1>
          <p className="text-neutral-500 text-sm md:text-base font-light">
            Any question or remarks? Just write us a message!
          </p>
        </div>

        {/* Unified Card Container */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] flex flex-col md:flex-row overflow-hidden border border-neutral-100">
          
          {/* Left Side - Deep Blue Rich Gradient Panel */}
          <div className="bg-gradient-to-br from-[#0d3b85] to-[#1453ab] text-white p-8 md:p-12 md:w-[42%] flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Lighting Light Burst */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-wide text-white">
                Contact Information
              </h2>
              <p className="text-blue-100/70 text-xs font-light tracking-wide">
                Say something to start a live chat!
              </p>
            </div>

            <div className="my-12 space-y-8 text-sm font-light tracking-wide text-blue-50/90">
              <div className="flex items-center gap-4 group/item cursor-pointer">
                <div className="text-blue-300 group-hover/item:text-white transition-transform duration-300 group-hover/item:scale-110">
                  <FaPhoneAlt size={16} />
                </div>
                <span className="hover:text-white transition-colors duration-200">+234 906 014 2148</span>
              </div>

              <div className="flex items-center gap-4 group/item cursor-pointer">
                <div className="text-blue-300 group-hover/item:text-white transition-transform duration-300 group-hover/item:scale-110">
                  <FaEnvelope size={16} />
                </div>
                <span className="hover:text-white transition-colors duration-200">Colyciacouture@Gmail.Com</span>
              </div>

              <div className="flex items-start gap-4 group/item cursor-pointer">
                <div className="text-blue-300 mt-1 group-hover/item:text-white transition-transform duration-300 group-hover/item:scale-110">
                  <FaMapMarkerAlt size={16} />
                </div>
                <span className="leading-relaxed hover:text-white transition-colors duration-200">
                  Shop F02 Pathfield Mall, 4th Avenue<br />
                  Gwarimpa Abuja, Nigeria.
                </span>
              </div>
            </div>

            {/* Bottom Graphic placeholder block to stabilize layout space */}
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40 text-xs font-serif italic">
              CC
            </div>
          </div>

          {/* Right Side - Form Container */}
          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-12 md:w-[58%] flex flex-col justify-between space-y-8 bg-white"
          >
            <div className="space-y-8">
              {/* Row 1: Name Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-1.5 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-[#114fa3] transition-colors duration-200">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-800 outline-none focus:border-[#114fa3] transition-colors duration-300"
                  />
                </div>

                <div className="flex flex-col space-y-1.5 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-[#114fa3] transition-colors duration-200">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-800 outline-none focus:border-[#114fa3] transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Row 2: Communication Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-1.5 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-[#114fa3] transition-colors duration-200">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-800 placeholder-neutral-300 outline-none focus:border-[#114fa3] transition-colors duration-300"
                  />
                </div>

                <div className="flex flex-col space-y-1.5 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-[#114fa3] transition-colors duration-200">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+234 ..."
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-800 placeholder-neutral-300 outline-none focus:border-[#114fa3] transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div className="flex flex-col space-y-1.5 group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-[#114fa3] transition-colors duration-200">
                  Write a Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-800 placeholder-neutral-300 outline-none resize-none focus:border-[#114fa3] transition-colors duration-300"
                />
              </div>
            </div>

            {/* Row 4: Submit Actions */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="bg-[#64748b] hover:bg-[#475569] active:scale-[0.98] text-white px-8 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitStatus === "loading" ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Typography Watermark from image_4ced1f.png */}
        <div className="text-center pt-4 select-none opacity-20 hover:opacity-40 transition-opacity duration-500">
          <p className="text-3xl md:text-5xl font-extralight tracking-[0.25em] text-neutral-600 font-serif">
            Sharp looks.Bold moves
          </p>
        </div>
      </div>
    </div>
  );
}