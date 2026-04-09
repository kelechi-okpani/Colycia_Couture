import React from 'react';
import { IoClose } from 'react-icons/io5';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  if (!isOpen) return null;

  const measurements = [
    { label: "Chest (Inches)", values: ["32-34", "35-37", "38-40", "41-43", "44-46", "47-49"] },
    { label: "Waist (Inches)", values: ["26-28", "29-31", "32-34", "35-37", "38-40", "41-43"] },
    { label: "Hip (Inches)", values: ["32-34", "35-37", "38-40", "41-43", "44-46", "47-49"] },
    { label: "Neck (Inches)", values: ["13-13.5", "14-14.5", "15-15.5", "16-16.5", "17-17.5", "18-18.5"] },
    { label: "Inseam (Inches)", values: ["29", "30", "31", "32", "33", "34"] },
  ];

  const categories = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white shadow-2xl p-6 md:p-12 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-center text-[12px] font-bold uppercase tracking-[0.3em] mb-10 text-black">
          Size Guide
        </h2>

        {/* Scrollable Table Area */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Category
                </th>
                {categories.map((cat) => (
                  <th key={cat} className="py-5 text-[10px] font-bold uppercase tracking-widest text-black text-center">
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {measurements.map((row, index) => (
                <tr key={index}>
                  <td className="py-5 text-[12px] font-semibold text-black">
                    {row.label}
                  </td>
                  {row.values.map((val, i) => (
                    <td key={i} className="py-5 text-[12px] text-neutral-600 text-center font-light">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100">
          <p className="text-[9px] text-neutral-400 uppercase tracking-widest leading-relaxed text-center">
            * All measurements are in inches. For custom tailoring, please use the "Custom Measurement" option.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;