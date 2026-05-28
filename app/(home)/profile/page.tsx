"use client";

import { useEffect, useState } from "react";
import { logoutUser } from "@/app/store/slices/authSlice";
import { fetchOrders } from "@/app/store/slices/orderSlice";
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchUserProfile } from "@/app/store/slices/userSlice";

type TabView = 'overview' | 'orders' | 'wishlist' | 'cart';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabView>('overview');

  // Grab States
  // const {  user, loading } = useAppSelector((state) => state.auth);

  const { profile: user, loading } = useAppSelector(
  (state: any) => state.user
 );
  const { orders, status, error } = useAppSelector((state) => state.order);
  const { items: wishlistItems } = useAppSelector((state: any) => state.wishlist || { items: [] });

  useEffect(() => {
  dispatch(fetchUserProfile());
}, [dispatch]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-12 mt-4 tracking-tight text-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- LEFT COLUMN: MY PROFILE --- */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-900">My Account</h2>
          <div className="bg-white rounded-none border border-neutral-200/70 p-8 flex flex-col items-center text-center backdrop-blur-sm">
            {/* Minimalist Premium Avatar */}
            <div className="w-20 h-20 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center mb-5 group transition-colors">
              <svg className="w-8 h-8 text-neutral-400 group-hover:text-neutral-900 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            <h3 className="text-base font-bold uppercase tracking-md">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : "Guest Client"}
            </h3>
            
            <div className="w-full mt-8 space-y-3.5 text-xs border-t border-b border-neutral-100 py-6">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase tracking-wider">Email Address</span>
                <span className="text-neutral-900 font-medium break-all pl-4">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase tracking-wider">Phone</span>
                <span className="text-neutral-900 font-medium">{user?.phone || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase tracking-wider">Member Since</span>
                <span className="text-neutral-900 font-medium">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      }) 
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="w-full mt-6 space-y-2">
              <button
              onClick={handleLogout}
              className="w-full bg-black cursor-pointer text-white py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition duration-300">
                 Sign Out
              </button>
              {/* <button
                onClick={handleLogout}
                className="w-full text-neutral-400 text-xs uppercase tracking-widest font-bold py-3 hover:text-black transition duration-200"
              >
                Sign Out
              </button> */}
            </div>
          </div>
        </section>

        {/* --- RIGHT COLUMN: MY ORDERS --- */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-900">Order History</h2>
          <div className="bg-white rounded-none border border-neutral-200/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-400 uppercase text-[10px] font-bold tracking-widest border-b border-neutral-200/60">
                    <th className="px-6 py-4 w-[40%]">Item</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-nowrap">Date</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders?.map((order: any) => 
                    order.items.map((item: any, index: number) => (
                      <tr key={`${order._id}-${index}`} className="text-xs hover:bg-neutral-50/50 transition duration-150">
                        
                        {/* 1. Product Image & Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 relative bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover mix-blend-multiply"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 uppercase tracking-wide truncate max-w-[180px]">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                                Size: <span className="text-neutral-600 font-medium">{item.size}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 2. Order ID (Shortened) */}
                        <td className="px-6 py-4 font-mono text-neutral-500 tracking-tight">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>

                        {/* 3. Item Quantity */}
                        <td className="px-6 py-4 text-center font-medium text-neutral-600">
                          {item.quantity}
                        </td> 
                        
                        {/* 4. Price */}
                        <td className="px-6 py-4 font-bold text-neutral-900">
                          ₦{item.price.toLocaleString()}
                        </td>

                        {/* 5. Order Date */}
                        <td className="px-6 py-4 text-neutral-500 text-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-NG", {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>

                        {/* 6. Status Pill */}
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border ${
                            order.orderStatus === 'delivered' ? 'bg-neutral-50 border-neutral-900 text-neutral-900' :
                            order.orderStatus === 'processing' ? 'bg-neutral-50 border-neutral-400 text-neutral-600' : 
                            'bg-neutral-50 border-neutral-200 text-neutral-400'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {(!orders || orders.length === 0) && (
                <div className="p-20 text-center flex flex-col items-center justify-center">
                  <svg className="w-6 h-6 text-neutral-300 mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 010 .75zm7.5 0a.375.375 0 11-.75 0 .375.375 0 010 .75z" />
                  </svg>
                  <p className="text-neutral-400 uppercase tracking-wider text-xs">No entries found in your order archive.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}


// "use client";
// import { useEffect, useState } from "react";
// import { logoutUser } from "@/app/store/slices/authSlice";
// import { fetchOrders } from "@/app/store/slices/orderSlice";
// import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";


// type TabView = 'overview' | 'orders' | 'wishlist' | 'cart';


// export default function ProfilePage() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);
//   const [activeTab, setActiveTab] = useState<TabView>('overview');

//   // Grab States
//   const { user, loading } = useAppSelector((state) => state.auth);
//   const { orders, status, error } = useAppSelector((state) => state.order);
  
//   // const { items: cartItems } = useAppSelector((state) => state.cart);
//   // Assuming you have a wishlist slice
//   const { items: wishlistItems } = useAppSelector((state: any) => state.wishlist || { items: [] });

//   // useEffect(() => {
//   //   setMounted(true);

//   //  if (!loading && !user?._id) {
//   //     router.replace('/auth/login');
//   //    }
//   //   if (user?._id) dispatch(fetchOrders({ userId:user?._id || user.id } ));
//   // }, [user, loading, dispatch, router]);

//       useEffect(() => {
//       // wait until auth state is loaded
//       if (loading) return;

//       // no user → redirect
//       if (!user?._id) {
//         router.replace("/auth/login");
//         return;
//       }

//       // user exists → fetch orders
//       dispatch(fetchOrders({ userId: user._id || user.id }));
//     }, [user, loading, dispatch, router]);




//   const handleLogout = async () => {
//   try {
//     await dispatch(logoutUser()).unwrap(); // ✅ wait for success

//     toast.success("Logged out successfully");
//     router.push("/auth/login");
//   } catch (error:any) {
//     toast.error(error || "Logout failed");
//   }
// };

//   if (loading) {
//   // if (!mounted || authLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-8">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* --- LEFT COLUMN: MY PROFILE --- */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
//             {/* Avatar */}
//             <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//               <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//               </svg>
//             </div>

//             <h3 className="text-lg font-semibold">
//              {user?.firstName ? `${user.firstName} ${user.lastName}` : "User Name"}
//               </h3>
            
//             <div className="w-full mt-6 space-y-3 text-left">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Email:</span>
//                 <span className="text-gray-900 font-medium">{user?.email}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Phone:</span>
//                 <span className="text-gray-900 font-medium">{user?.phone}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Joined:</span>
//                   <span className="text-gray-900 font-medium">
//                     {user?.createdAt 
//                       ? new Date(user.createdAt).toLocaleDateString('en-US', {
//                           month: 'long',
//                           year: 'numeric'
//                         }) 
//                       : 'N/A'}
//                   </span>   
//            </div>
//             </div>

//             <div className="w-full mt-8 space-y-3">
//               <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
//                 Edit Profile
//               </button>
//               <button
//               onClick={handleLogout}
//               className="cursor-pointer w-full text-black font-bold py-2 hover:underline">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* --- RIGHT COLUMN: MY ORDERS --- */}
//    <section className="lg:col-span-2 space-y-4">
//   <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
//   <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//     <div className="overflow-x-auto">
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
//             <th className="px-6 py-4">Item</th>
//             <th className="px-6 py-4">Order ID</th>
//             <th className="px-6 py-4">Qty</th>
//             <th className="px-6 py-4">Price</th>
//             <th className="px-6 py-4 text-nowrap">Date</th>
//             <th className="px-6 py-4">Status</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {orders?.map((order: any) => 
//             order.items.map((item: any, index: number) => (
//               <tr key={`${order._id}-${index}`} className="text-sm hover:bg-gray-50 transition">
//                 {/* 1. Product Image & Name */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-14 relative rounded bg-gray-100 overflow-hidden flex-shrink-0">
//                       <img 
//                         src={item.image} 
//                         alt={item.name} 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900 uppercase text-xs leading-tight">
//                         {item.name}
//                       </p>
//                       <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
//                         Size: {item.size}
//                       </p>
//                     </div>
//                   </div>
//                 </td>

//                 {/* 2. Order ID (Shortened) */}
//                 <td className="px-6 py-4 text-gray-500 font-mono text-xs">
//                   #{order._id.slice(-6).toUpperCase()}
//                 </td>

//                 {/* 3. Item Quantity */}
//                 <td className="px-6 py-4 font-medium text-gray-700">
//                   {item.quantity}
//                 </td> 
                
//                 <td className="px-6 py-4 font-bold text-gray-900">
//                   ₦{item.price.toLocaleString()}
//                 </td>

//                 {/* 4. Order Date */}
//                 <td className="px-6 py-4 text-gray-500 text-nowrap">
//                   {new Date(order.createdAt).toLocaleDateString("en-NG", {
//                     month: 'short',
//                     day: 'numeric',
//                     year: 'numeric'
//                   })}
//                 </td>

//                 {/* 5. Status Pill */}
//                 <td className="px-6 py-4">
//                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                     order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600' :
//                     order.orderStatus === 'processing' ? 'bg-blue-50 text-blue-600' : 
//                     'bg-orange-50 text-orange-600'
//                   }`}>
//                     {order.orderStatus}
//                   </span>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
      
//       {(!orders || orders.length === 0) && (
//         <div className="p-16 text-center">
//           <p className="text-gray-400 italic text-sm">You haven't placed any orders yet.</p>
//         </div>
//       )}
//     </div>
//   </div>
// </section>

//       </div>
//     </div>

//   );
// }

