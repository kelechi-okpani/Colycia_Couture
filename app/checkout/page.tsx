"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { IoChevronDownOutline, IoShieldCheckmarkOutline, IoArrowBackOutline, IoLocationOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { RootState } from '../store/store';
import PaymentHandler from '../components/ui/PaymentHandler';
import { FaTruckFast } from "react-icons/fa6"
import {  IoGlobeOutline } from "react-icons/io5"



export default function CheckoutPage() {
  const shipping_cost = " 10000"
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | null>(null);
const [errors, setErrors] = useState<{ [key: string]: string }>({});

const { orders, status } = useAppSelector((state) => state.order);
const { items } = useAppSelector((state: RootState) => state.cart);
  const user = useAppSelector((state: RootState) => state.auth.user);

 const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: user?.email || '',
    address: '',
    country: 'Nigeria',
    state: '',
    zipCode: '',
  });

  
useEffect(() => {
  if (orders && orders.length > 0) {
    // Extract unique shipping details from the orders in Redux
    const uniqueAddresses = orders.reduce((acc: any[], order: any) => {
      const address = order?.shippingDetails;
      if (!address) return acc;

      // Check for duplicates based on address string and phone
      const isDuplicate = acc.find(
        (a) => a.address === address.address && a.phone === address.phone
      );

      if (!isDuplicate) acc.push(address);
      return acc;
    }, []);

    setSavedAddresses(uniqueAddresses.slice(0, 3)); // Show the most recent 3
  }
}, [orders]);


// 2. Prefill Form Logic
  const selectAddress = (address: any, index: number) => {
    setSelectedAddressIdx(index);
    setFormData({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      phone: address.phone || '',
      email: user?.email || '',
      address: address.address || '',
      country: address.country || 'Nigeria',
      state: address.state || '',
      zipCode: address.zipCode || '',
    });
    // Clear validation errors when an address is selected
    setErrors({});
  };
 


  // Sync email if user logs in after page load
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const subtotal = items.reduce((acc:any, item:any) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.lastName) newErrors.lastName = "Required";
    if (!formData.phone) newErrors.phone = "Phone number required";
    if (!formData.address) newErrors.address = "Delivery address required";
    if (!formData.state) newErrors.state = "Please select a state";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans relative isolate">
      {/* Brand Watermark */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.02] overflow-hidden"
        style={{ 
          backgroundImage: "url('/assets/bg_1.png')", 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <Link href="/cart" className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black mb-10 transition-colors">
          <IoArrowBackOutline /> Back to Cart
        </Link>

              {savedAddresses.length > 0 && (
                <div className="mb-10 space-y-4">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <IoLocationOutline />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Fast Fill Saved Addresses</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectAddress(addr, idx)}
                        className={`text-left p-4 border transition-all duration-300 relative ${
                          selectedAddressIdx === idx 
                            ? 'bg-white border-black shadow-md ring-1 ring-black' 
                            : 'bg-white/50 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <p className="font-bold text-[11px] uppercase text-black">{addr.firstName} {addr.lastName}</p>
                        <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{addr.address}</p>
                        <p className="text-[9px] text-neutral-400 uppercase">{addr.state}, Nigeria</p>
                        {selectedAddressIdx === idx && (
                          <div className="absolute top-2 right-2 text-green-600">
                            <IoShieldCheckmarkOutline size={14} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Shipping Details */}
          <div className="flex-1 space-y-10">
            <header>
              <h2 className="text-3xl font-bold text-black tracking-tighter">Shipping Details</h2>
              <p className="text-neutral-500 text-sm mt-2">Please ensure your delivery information is accurate for Abuja Craftsmanship delivery.</p>
            </header>
            
           <div className=" mx-auto p-4 md:p-8 bg-[#F9F9F9] min-h-screen">
              <div className="space-y-4">
                {/* First Name */}
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="First Name"
                  className={`w-full bg-white border ${errors.firstName ? 'border-red-500' : 'border-neutral-200'} px-4 py-3.5 text-sm text-neutral-600 outline-none focus:border-black transition-colors shadow-sm`}
                />

                {/* Last Name */}
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Last Name"
                  className={`w-full bg-white border ${errors.lastName ? 'border-red-500' : 'border-neutral-200'} px-4 py-3.5 text-sm text-neutral-600 outline-none focus:border-black transition-colors shadow-sm`}
                />

                {/* Phone */}
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="Phone Number"
                  className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-neutral-200'} px-4 py-3.5 text-sm text-neutral-600 outline-none focus:border-black transition-colors shadow-sm`}
                />

                {/* Email */}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white border border-neutral-200 px-4 py-3.5 text-sm text-neutral-600 outline-none focus:border-black transition-colors shadow-sm"
                />

                {/* Address */}
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Street Address / Suite / Apartment"
                  className={`w-full bg-white border ${errors.address ? 'border-red-500' : 'border-neutral-200'} px-4 py-3.5 text-sm text-neutral-600 outline-none focus:border-black transition-colors shadow-sm`}
                />

                {/* Country Select */}
                <div className="relative">
                  <select
                    name="country"
                    className="w-full bg-white border border-neutral-200 px-4 py-3.5 text-sm text-neutral-600 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Nigeria">Nigeria</option>
                  </select>
                  <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={18} />
                </div>

                {/* State/City Select */}
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full bg-white border ${errors.state ? 'border-red-500' : 'border-neutral-200'} px-4 py-3.5 text-sm text-neutral-400 outline-none appearance-none cursor-pointer focus:border-black transition-colors`}
                  >
                    <option value="">State/city</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                  </select>
                  <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={18} />
                </div>

                {/* Zip Code */}
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Zip Code (Optional)"
                  className="w-full bg-white border border-neutral-200 px-4 py-3.5 text-sm text-neutral-600 outline-none focus:border-black transition-colors shadow-sm"
                />

                {/* Delivery Method */}
                <div className="pt-4 space-y-4">
                  <h3 className="text-sm font-medium text-black">Delivery Method</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <input 
                            type="radio" 
                            checked 
                            readOnly 
                            className="w-5 h-5 border-2 border-blue-900 rounded-full appearance-none checked:bg-white cursor-pointer" 
                        />
                        <div className="absolute w-2.5 h-2.5 bg-blue-900 rounded-full"></div>
                    </div>
                    <span className="text-sm text-neutral-800">Standard Delivery</span>
                  </div>
                </div>

                {/* Shipping Fee */}
                <div className="pt-2 flex items-center gap-4">
                  <span className="text-sm text-neutral-600">Shipping Fee:</span>
                  <span className="text-base font-bold text-black uppercase">NGN 10,000</span>
                </div>

                {/* Terms */}
                <p className="text-[11px] text-neutral-500">
                  I have Read and agreed to the <a href="/shipping" className="text-blue-800 hover:underline">Terms and Conditions</a>
                </p> 
                
<div className="mt-6 space-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
      <div className="flex items-start gap-3">
        <FaTruckFast className="mt-0.5 h-4 w-4 text-neutral-600" />
        <div>
          <p className="text-sm font-medium text-neutral-800">Domestic Delivery (Nigeria)</p>
          <p className="text-xs text-neutral-500">Expected delivery within 2 weeks.</p>
        </div>
      </div>

      <hr className="border-neutral-200" />

      <div className="flex items-start gap-3">
        <IoGlobeOutline className="mt-0.5 h-4 w-4 text-neutral-600" />
        <div>
          <p className="text-sm font-medium text-neutral-800">International Shipping</p>
          <p className="text-xs text-neutral-500">Expected delivery within 3 weeks (includes global transit).</p>
        </div>
      </div>
    </div>
             {/* Final Action - Passing validation check to PaymentHandler */}
            <div className=" border-t border-neutral-100">
               <PaymentHandler 
                  items={items} 
                  formData={formData} 
                  userId={user?.id || user?._id}
                  onValidate={validateForm} 
               />
               <div className="flex items-center  gap-2 text-neutral-400 text-[10px] uppercase tracking-[0.3em] mt-6">
                <IoShieldCheckmarkOutline className="text-lg text-green-500" />
                Secure Encryption via Stripe
              </div>
            </div>
              </div>
            </div>

           
          </div>

          {/* Right Column: Order Summary */}
          <aside className="w-full lg:w-[450px]">
            <div className="bg-white border border-neutral-100 p-8 shadow-sm rounded-sm space-y-8 sticky top-8">
              <h2 className="text-xl font-bold text-black border-b border-neutral-50 pb-4">Order Summary</h2>
              
              <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                {items.length > 0 ? items.map((item:any) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4 animate-fadeIn">
                    <div className="w-20 h-24 bg-neutral-100 relative overflow-hidden flex-shrink-0 rounded-sm">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="text-xs space-y-1 flex-1">
                      <p className="font-bold text-black uppercase leading-tight">{item.name}</p>
                      <p className="text-neutral-400">Size: <span className="text-black font-medium">{item.size}</span></p>
                      <p className="text-neutral-400">Qty: <span className="text-black font-medium">{item.quantity}</span></p>
                      <p className="font-bold pt-1 text-sm">NGN {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-neutral-400 text-sm italic">Your selection is empty.</p>
                )}
              </div>

              {/* Pricing Totals */}
              <div className="space-y-4 pt-6 text-sm font-medium border-t border-neutral-100">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-light italic">Subtotal</span>
                  <span>NGN {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-light italic">Shipping</span>
                  <span className="text-green-600 uppercase text-[10px] font-bold">Calculated at Payment</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-neutral-50 pt-6">
                  <span className="tracking-tighter">Total</span>
                  <span className="text-[#113F85]">NGN {subtotal.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <footer className="py-12 border-t border-neutral-100 text-center">
        <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300">Colycia Couture — Abuja Craftsmanship & Quality</p>
      </footer>
    </div>
  );
}