'use client';

import Link from 'next/link';
import {
  Home,
  Users,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { fetchOrders } from '@/app/store/slices/orderSlice';
import { logoutUser } from '@/app/store/slices/authSlice';
import toast from "react-hot-toast";


const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Referrals', href: '/admin/referrals', icon: Users },
  { name: 'Enquires', href: '/admin/contacts', icon: Package },
  // { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  // { name: 'Products', href: '/admin/products', icon: Package },
  // { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface Props {
  pathname: string;
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  pathname,
  open = false,
  onClose,
}: Props) {
  const isActive = (href: string) => pathname === href;

    const dispatch = useAppDispatch();
    const router = useRouter();
  
      
    const { profile: user, loading } = useAppSelector(
    (state: any) => state.user
   );

  useEffect(() => {
    if (status === "loading") return;
  
    if (!user?._id) {
      router.replace("/auth/login");
      return;
    }
  
    dispatch(fetchOrders({ userId: user._id || user.id }));
  }, [user, status, dispatch, router]);

    const handleLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap(); // ✅ wait for success
        toast.success("Logged out successfully");
        router.push("/auth/login");
        // router.push("/auth/login");
      } catch (error: any) {
        toast.error(error || "Logout failed");
      }
    };


  return (
    <>
      {/* overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          w-[280px] h-full bg-white border-r border-gray-200
          flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* header */}
        <div className="h-16 sm:h-20 border-b flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-black">COLYCIA</h1>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest">
              Admin Panel
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                transition
                ${isActive(item.href)
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-black'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* footer */}
        <div className="p-4 border-t">
          <button 
           onClick={handleLogout}
          className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl border hover:bg-gray-100 text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}