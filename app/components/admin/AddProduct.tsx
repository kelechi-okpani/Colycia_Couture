"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { createProduct } from '@/app/store/slices/productSlice';
import { CldUploadWidget } from 'next-cloudinary';
import { IoCloudUploadOutline, IoTrashOutline, IoArrowBackOutline, IoAddOutline } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';

export default function AddProduct() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'KAFTANS',
    description: '',
    image: '',
    gallery: [] as string[],
    sizes: ["S", "M", "L", "XL", "XXL"]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Please upload a primary image.");

    setLoading(true);
    
    // Prepare data for the API
    const submissionData = {
      ...formData,
      price: Number(formData.price),
    };

    const resultAction = await dispatch(createProduct(submissionData));

    if (createProduct.fulfilled.match(resultAction)) {
      alert("Piece added to collection successfully.");
      router.push('/shop');
    } else {
      alert(resultAction.payload as string);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-28 pb-20 px-6 font-sans py-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-black mb-8 transition-colors">
          <IoArrowBackOutline /> Admin Dashboard
        </Link>

        <h1 className="text-4xl font-bold tracking-tighter mb-12">NEW COLLECTION PIECE</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Media Column */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Master Image</label>
              {formData.image ? (
                <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden group">
                  <Image src={formData.image} alt="Main" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, image: ''})}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                  >
                    <IoTrashOutline className="text-red-600" size={18} />
                  </button>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result: any) => setFormData({...formData, image: result.info.secure_url})}
                >
                  {({ open }) => (
                    <button 
                      type="button" 
                      onClick={() => open()}
                      className="w-full aspect-[3/4] border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4 hover:border-black transition-all bg-neutral-50 text-neutral-400 hover:text-black"
                    >
                      <IoCloudUploadOutline size={40} strokeWidth={1} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Gallery View</label>
              <div className="grid grid-cols-3 gap-4">
                {formData.gallery.map((url, idx) => (
                  <div key={idx} className="relative aspect-square bg-neutral-100 overflow-hidden group">
                    <Image src={url} alt="Gallery" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, i) => i !== idx)})}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoTrashOutline className="text-white" size={20} />
                    </button>
                  </div>
                ))}
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result: any) => setFormData({...formData, gallery: [...formData.gallery, result.info.secure_url]})}
                >
                  {({ open }) => (
                    <button 
                      type="button"
                      onClick={() => open()}
                      className="aspect-square border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black transition-all bg-neutral-50"
                    >
                      <IoAddOutline size={24} />
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Product Name</label>
              <input 
                required
                type="text" 
                placeholder="Title of piece..."
                className="w-full text-2xl font-light border-b border-neutral-100 py-4 outline-none focus:border-black transition-colors bg-transparent"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Retail Price (NGN)</label>
                <input 
                  required
                  type="number" 
                  className="w-full text-xl border-b border-neutral-100 py-4 outline-none focus:border-black transition-colors bg-transparent"
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Category
              </label>
          <div className="relative">
            <select 
              value={formData.category}
              className="w-full text-xl border-b border-neutral-100 py-4 outline-none focus:border-black bg-transparent appearance-none cursor-pointer transition-colors"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {[
                'AGBADA', 
                'KAFTANS', 
                'SENATOR', 
                'SHIRTS', 
                'SUITS', 
                'SAFARI', 
                'KIMONOS', 
                'CO-ORDS', 
                'BLAZERS', 
                'TROUSERS'
              ].map((cat) => (
                <option key={cat} value={cat} className="text-base py-2">
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            
            {/* Minimalist Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Craftsmanship Details</label>
              <textarea 
                rows={6}
                placeholder="Description of the fabric and cut..."
                className="w-full border border-neutral-100 p-6 outline-none focus:border-black transition-colors bg-neutral-50/50 resize-none font-light leading-relaxed"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full lg:w-fit min-w-[300px] bg-black text-white py-6 px-12 font-bold uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all disabled:opacity-30"
            >
              {loading ? "SAVING..." : "PUBLISH PIECE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}