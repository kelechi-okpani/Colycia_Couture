"use client";

import React from 'react';
import { IoCloseOutline, IoCallOutline, IoLocationOutline, IoPersonOutline } from 'react-icons/io5';
import Image from 'next/image';

interface ModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: ModalProps) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-100 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Order Details</h2>
            <p className="text-[10px] text-neutral-400 uppercase mt-1">ID: {order._id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Side: Product Images & Items */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Purchased Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 p-3 border border-neutral-100 rounded-sm group hover:border-black transition-colors">
                  <div className="relative w-20 h-24 bg-neutral-100 overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-sm uppercase">{item.name}</h4>
                    <p className="text-xs text-neutral-500 mt-1">Size: <span className="text-black font-medium">{item.size}</span></p>
                    <p className="text-xs text-neutral-500">Qty: <span className="text-black font-medium">{item.quantity}</span></p>
                    <p className="text-sm font-bold mt-2">₦{item.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-neutral-100 flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Amount</span>
                <span className="text-2xl font-black text-black">₦{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Side: Shipping & Customer Info */}
          <div className="space-y-8 bg-neutral-50 p-6 rounded-sm">
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Customer Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <IoPersonOutline className="text-neutral-400" />
                  <span>{order.shippingDetails.firstName} {order.shippingDetails.lastName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IoCallOutline className="text-neutral-400" />
                  <span>{order.shippingDetails.phone}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Shipping Address</h3>
              <div className="flex gap-3 text-sm leading-relaxed">
                <IoLocationOutline className="text-neutral-400 mt-1 flex-shrink-0" />
                <span>
                  {order.shippingDetails.address},<br />
                  {order.shippingDetails.city}, {order.shippingDetails.state},<br />
                  {order.shippingDetails.country}
                </span>
              </div>
            </section>

            <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Logistics</h3>
                <div className="bg-white p-3 border border-neutral-200 inline-block text-[10px] font-bold uppercase tracking-widest">
                    Method: {order.shippingDetails.deliveryMethod}
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;