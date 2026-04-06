import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  currency?: string;
}

export default function ProductCard({ id, name, price, imageUrl, currency = "₦" }: ProductCardProps) {
  return (
    <Link href={`/shop/${id}`} className="group cursor-pointer block">
      <div className="group border border-neutral-100 rounded-xl overflow-hidden bg-white hover:border-neutral-200 transition">
        <div className="relative aspect-[1/1] overflow-hidden bg-neutral-100">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            style={{ objectPosition: 'center top' }}
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="p-5 space-y-4">
          <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 min-h-[40px]">{name}</h3>
          <p className="text-lg font-bold text-black">{currency}{price?.toLocaleString()}</p>
          
          <button className="flex items-center justify-center gap-2 w-full bg-black text-white text-sm font-medium py-3 rounded-lg hover:bg-neutral-800 transition opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all">
            <ShoppingCart className="h-4 w-4" />
            ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  );
}