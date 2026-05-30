"use client";

import AddProduct from "@/app/components/admin/AddProduct";
import OrderList from "@/app/components/admin/OrderList";
import React, { useState } from "react";
import { IoCubeOutline, IoReceiptOutline } from "react-icons/io5";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "orders" | "products"
  >("orders");

  return (
    <div className="w-full min-h-full">
      {/* TOP BAR */}
      <nav className=" top-0 z-30 bg-white border-b border-neutral-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between gap-6">
            
            {/* Logo */}
            <div>
              <h1 className="text-sm lg:text-base font-black uppercase tracking-[0.25em] text-black">
                COLYCIA{" "}
                <span className="text-neutral-400">
                  ADMIN
                </span>
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              
              <button
                onClick={() => setActiveTab("orders")}
                className={` cursor-pointer
                  flex items-center gap-2 px-4 lg:px-5 py-2.5
                  rounded-lg text-[11px] uppercase tracking-widest font-bold
                  transition-all duration-200
                  ${
                    activeTab === "orders"
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:text-black hover:bg-white"
                  }
                `}
              >
                <IoReceiptOutline size={16} />
                Orders
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={` cursor-pointer
                  flex items-center gap-2 px-4 lg:px-5 py-2.5
                  rounded-lg text-[11px] uppercase tracking-widest font-bold
                  transition-all duration-200
                  ${
                    activeTab === "products"
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:text-black hover:bg-white"
                  }
                `}
              >
                <IoCubeOutline size={16} />
                Products
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            
            {/* Logo */}
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.25em] text-black">
                COLYCIA{" "}
                <span className="text-neutral-400">
                  ADMIN
                </span>
              </h1>
            </div>

            {/* Mobile Tabs */}
            <div className="grid grid-cols-2 gap-2">
              
              <button
                onClick={() => setActiveTab("orders")}
                className={` cursor-pointer
                  flex items-center justify-center gap-2 py-3 rounded-xl
                  text-[11px] uppercase tracking-widest font-bold
                  transition-all duration-200 border
                  ${
                    activeTab === "orders"
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-500 border-neutral-200"
                  }
                `}
              >
                <IoReceiptOutline size={16} />
                Orders
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`cursor-pointer
                  flex items-center justify-center gap-2 py-3 rounded-xl
                  text-[11px] uppercase tracking-widest font-bold
                  transition-all duration-200 border
                  ${
                    activeTab === "products"
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-500 border-neutral-200"
                  }
                `}
              >
                <IoCubeOutline size={16} />
                Products
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {activeTab === "orders" ? (
          <div className="w-full overflow-hidden">
            <OrderList />
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Header */}
            <header className="mb-8 lg:mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black">
                New Inventory
              </h2>

              <p className="text-sm sm:text-base text-neutral-500 mt-2 max-w-2xl mx-auto">
                Create new craftsmanship listings for the digital media vault.
              </p>
            </header>

            {/* Form Container */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm overflow-hidden">
              <AddProduct />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}