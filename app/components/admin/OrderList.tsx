"use client";

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { fetchOrders, updateOrderStatus } from '@/app/store/slices/orderSlice';
import { IoCheckmarkCircleOutline, IoTimeOutline, IoCloseCircleOutline, IoEyeOutline } from 'react-icons/io5';
import Image from 'next/image';
import OrderDetailModal from './OrderDetailModal';
import toast from 'react-hot-toast'; 


export default function OrderList() {
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState<any>(null); 

  // 1. Pulling from Redux State as requested
  const { orders, status, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);

  const [filter, setFilter] = useState('processing'); // processing, shipped, delivered, cancelled

  // 2. Fetch orders using Redux thunk on mount
  useEffect(() => {
    if (user?._id || user?.id) {
      dispatch(fetchOrders({ 
        userId: user._id || user.id, 
        isAdmin: user.role === 'admin' 
      }));
    }
  }, [dispatch, user]);

const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
    }

    try {
        // We await the unwrap so the catch block can catch API rejections
        await dispatch(updateOrderStatus({ 
            orderId, 
            status: newStatus, 
            adminId: user._id || user.id 
        })).unwrap();

        // Custom high-contrast styling to match your Abuja Craftsmanship vibe
        toast.success(`Order updated to: ${newStatus.toUpperCase()}`, {
            icon: '👜',
            style: { 
                borderRadius: '0px', 
                background: '#fff', 
                color: '#000', 
                border: '1px solid #000',
                fontSize: '11px',
                letterSpacing: '0.1em',
                fontWeight: 'bold'
            }
        });
    } catch (error: any) {
        // Error toast with the same minimalist style but red border
        toast.error(error || "Failed to update order status", {
            style: { 
                borderRadius: '0px', 
                background: '#fff', 
                color: '#ef4444', 
                border: '1px solid #ef4444',
                fontSize: '11px',
                letterSpacing: '0.1em'
            }
        });
    }
};

  // Filter logic based on orderStatus field in your Redux interface
  const filteredOrders = orders.filter(order => order.orderStatus === filter);

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 font-sans">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-black uppercase">Order Management</h1>
          <p className="text-neutral-500 text-sm">Review and approve incoming craftsmanship requests.</p>
        </div>
        
        {/* Status Tabs matching your Order interface */}
        <div className="flex bg-neutral-100 p-1 rounded-sm border border-neutral-200">
          {['processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest transition-all ${
                filter === s ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs uppercase tracking-widest border border-red-100">
          Error: {error}
        </div>
      )}

      <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-neutral-50 ${isLoading ? 'opacity-50' : ''}`}>
            {filteredOrders.map((order: any) => (
              <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-black">
                      {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                    </span>
                    <span className="text-xs text-neutral-400">{order.shippingDetails?.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex -space-x-3">
                    {order.items?.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="relative w-10 h-10 border-2 border-white rounded-full overflow-hidden bg-neutral-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] border-2 border-white text-neutral-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-sm">
                  ₦{order.totalAmount?.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-xs text-neutral-400">
                  {new Date(order.createdAt).toLocaleDateString('en-NG')}
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  {order.orderStatus === 'processing' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'shipped')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Mark as Shipped"
                      >
                        <IoCheckmarkCircleOutline size={22} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Cancel Order"
                      >
                        <IoCloseCircleOutline size={22} />
                      </button>
                    </>
                  )}
                  <button 
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-neutral-400 hover:text-black transition-colors">
                    <IoEyeOutline size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(filteredOrders.length === 0 && !isLoading) && (
          <div className="py-20 text-center space-y-3">
             <IoTimeOutline size={40} className="mx-auto text-neutral-200" />
             <p className="text-neutral-400 text-sm italic">No orders found in this category.</p>
          </div>
        )}
      </div>

          {selectedOrder && (
            <OrderDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
         )}
    </div>
  );
}