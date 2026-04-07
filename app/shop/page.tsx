"use client";

import { useState, useMemo, useEffect } from 'react';
import { IoSearchOutline, IoChevronDownOutline } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ProductCard from '../components/ui/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts } from '../store/slices/productSlice';
import { ProductNotFound, ProductSkeleton } from '../components/ui/Loading';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("New Arrivals");

  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.products);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);



  const filteredProducts = useMemo(() => {
    // 1. Create a copy to avoid mutating Redux state
    let result = [...items];

    // 2. Filter by Category
    if (categoryFilter !== "All") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // 3. Filter by Search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 4. Sort (Always return a new array)
    if (sortOrder === "Price (Low > High)") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "Price (High > Low)") result.sort((a, b) => b.price - a.price);
    if (sortOrder === "Name A > Z") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === "Name Z > A") result.sort((a, b) => b.name.localeCompare(a.name));
    // Assuming you have a createdAt or date field for New Arrivals
    if (sortOrder === "New Arrivals") {
        result.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [items, categoryFilter, searchQuery, sortOrder]);



        
  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP BAR: Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b pb-6">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-full py-2.5 px-5 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>
        </div>

        {/* FILTERS */}
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

        {/* STATUS HANDLING */}
        {status === 'loading' && (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-20 text-red-500 text-sm uppercase tracking-widest">
            Error loading products: {error}
          </div>
        )}

       

        {/* PRODUCT GRID */}
        {status === 'succeeded' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
                {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      {...product}
                      _id={product._id.toString()}
                      imageUrl={product.image} 
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
               <ProductNotFound error={' No products found matching your search'}/>
           
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Sub-component stays mostly same but added better typing
interface FilterProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}

function FilterDropdown({ label, options, value, onChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 border border-neutral-200 px-6 py-2.5 rounded-sm text-[11px] font-bold tracking-widest uppercase hover:border-black transition-colors bg-white"
      >
        <span>{label}: <span className="text-neutral-400">{value}</span></span>
        <IoChevronDownOutline className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-100 shadow-2xl z-20 py-2">
            {options.map((opt) => (
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