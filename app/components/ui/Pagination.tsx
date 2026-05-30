'use client';

import React from 'react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goPrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex items-center justify-end px-8 gap-8 py-4 border-t bg-white">
      {/* Prev */}
      <button
        onClick={goPrev}
        disabled={page === 1}
        className="text-xs uppercase tracking-widest text-neutral-500 disabled:opacity-30 cursor-pointer"
      >
        Prev
      </button>

      {/* Pages */}
      <div className="flex gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`cursor-pointer w-8 h-8 text-xs border transition ${
              p === page
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-neutral-200 hover:border-black'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={goNext}
        disabled={page === totalPages}
        className="text-xs uppercase tracking-widest text-neutral-500 disabled:opacity-30 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}