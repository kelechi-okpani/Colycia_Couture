"use client";
import React, { useState } from 'react';
import { IoCubeOutline, IoReceiptOutline } from 'react-icons/io5';
import AddProduct from '../components/admin/AddProduct';
import OrderList from '../components/admin/OrderList';


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-black">
              Colycia <span className="text-neutral-400">Admin</span>
            </h1>

            {/* Tab Switcher */}
            <div className="flex gap-1 bg-neutral-50 p-1 rounded-md border border-neutral-200">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-5 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-black shadow-sm border border-neutral-200'
                    : 'text-neutral-400 hover:text-black'
                }`}
              >
                <IoReceiptOutline size={14} />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-5 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === 'products'
                    ? 'bg-white text-black shadow-sm border border-neutral-200'
                    : 'text-neutral-400 hover:text-black'
                }`}
              >
                <IoCubeOutline size={14} />
                Add Product
              </button>
            </div>
          </div>

          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">
            Logged in as <span className="text-black font-bold">Administrator</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto animate-fadeIn">
        {activeTab === 'orders' ? (
          <div className="p-8">
            <OrderList />
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-10 text-center">
               <h2 className="text-3xl font-bold tracking-tighter text-black uppercase">New Inventory</h2>
               <p className="text-neutral-500 text-sm mt-2">Create new craftsmanship listings for the digital media vault.</p>
            </header>
            <div className="bg-white border border-neutral-100 p-8 shadow-sm">
               {/* Replace this with your actual AddProductForm component */}
               <AddProduct />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}