"use client";

import { useEffect, useState } from "react";
import { logoutUser } from "@/app/store/slices/authSlice";
import { fetchOrders } from "@/app/store/slices/orderSlice";

import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { syncCartAction, fetchCart } from '@/app/store/slices/cartSlice';

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  IoCubeOutline, IoLocationOutline, IoPersonOutline, 
  IoChevronForward, IoSettingsOutline, IoLogOutOutline, 
  IoHeartOutline, IoBagHandleOutline, IoTrashOutline
} from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";

type TabView = 'overview' | 'orders' | 'wishlist' | 'cart';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>('overview');

  // Grab States
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { orders, status, error } = useAppSelector((state) => state.order);  // const { items: cartItems } = useAppSelector((state) => state.cart);
  // Assuming you have a wishlist slice
  const { items: wishlistItems } = useAppSelector((state: any) => state.wishlist || { items: [] });

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) router.push("/auth/login");
    if (user?._id) dispatch(fetchOrders({ userId:user._id || user.id } ));
  }, [user, authLoading, dispatch, router]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: MY PROFILE --- */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold">
             {user?.firstName ? `${user.firstName} ${user.lastName}` : "User Name"}
              </h3>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900 font-medium">{user?.phone || '081193088290'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Joined:</span>
                  <span className="text-gray-900 font-medium">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        }) 
                      : 'N/A'}
                  </span>   
           </div>
            </div>

            <div className="w-full mt-8 space-y-3">
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                Edit Profile
              </button>
              <button className="w-full text-black font-bold py-2 hover:underline">
                Logout
              </button>
            </div>
          </div>
        </section>

        {/* --- RIGHT COLUMN: MY ORDERS --- */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Scrollable Container for Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Products</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4 text-nowrap">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders?.map((order:any) => (
                    <tr key={order.id} className="text-sm hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-500">#{order.id.slice(-6)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{order.items[0]?.name}...</td>
                      <td className="px-6 py-4">{order.items.length}</td>
                      <td className="px-6 py-4 text-gray-500 text-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${
                          order.status === 'Delivered' ? 'text-green-500' :
                          order.status === 'Pending' ? 'text-orange-500' : 'text-red-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>

  );
}

