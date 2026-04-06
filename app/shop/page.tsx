"use client";

import { useState, useMemo } from 'react';
import { 
  IoSearchOutline, 
  IoHeartOutline, 
  IoHeart, 
  IoCartOutline, 
  IoChevronDownOutline, 
  IoCloseOutline 
} from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Image from 'next/image';
import ProductCard from '../components/ui/ProductCard';
import { INITIAL_PRODUCTS } from '../data/data';
// import {INITIAL_PRODUCTS} from "../data/data"


export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("New Arrivals");
  const [currency, setCurrency] = useState("NGN");

  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS];

    if (categoryFilter !== "All") {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (sortOrder === "Price (Low > High)") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "Price (High > Low)") result.sort((a, b) => b.price - a.price);
    if (sortOrder === "Name A > Z") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [categoryFilter, searchQuery, sortOrder]);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP BAR: Search & Currency */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b pb-6">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-full py-2.5 px-5 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            {/* Fixed: Used IoSearchOutline */}
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>

          {/* <div className="flex items-center gap-6">
             <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-bold tracking-widest bg-transparent focus:outline-none cursor-pointer uppercase"
             >
                <option>NGN</option>
                <option>USD</option>
                <option>EURO</option>
             </select>
          
          </div> */}
        </div>

        {/* FILTERS: Category & Sort */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div className="flex gap-4">
             <FilterDropdown 
              label="Category" 
              options={["All", "AGBADA", "KAFTANS", "SUITS", "UNISEX"]} 
              value={categoryFilter} 
              onChange={setCategoryFilter} 
             />
          </div>
          <FilterDropdown 
            label="Sort By" 
            options={["New Arrivals", "Name A > Z", "Name Z > A", "Price (High > Low)", "Price (Low > High)"]} 
            value={sortOrder} 
            onChange={setSortOrder} 
          />
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id}
                {...product} 
                imageUrl={product.image} />
            ))}
            </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-neutral-500 tracking-widest uppercase text-sm">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, options, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 border border-neutral-200 px-6 py-2.5 rounded-sm text-[11px] font-bold tracking-widest uppercase hover:border-black transition-colors bg-white"
      >
        <span>{label}: <span className="text-neutral-400">{value}</span></span>
        {/* Fixed: Used IoChevronDownOutline */}
        <IoChevronDownOutline className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-100 shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-1">
            {options.map((opt: string) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left px-6 py-2.5 text-[10px] tracking-widest uppercase hover:bg-neutral-50 transition-colors ${value === opt ? 'text-black font-black' : 'text-neutral-500'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}