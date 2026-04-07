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
  // const { items: orders } = useAppSelector((state: any) => state.orders);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  // Assuming you have a wishlist slice
  const { items: wishlistItems } = useAppSelector((state: any) => state.wishlist || { items: [] });

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) router.push("/auth/login");
    if (user?._id) dispatch(fetchOrders(user._id));
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


  // console.log(user, "...user")
  // console.log(cartItems, "...cartItems")
  return (
    <div className="min-h-screen bg-neutral-50/50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-[0.4em] text-black">Client Portal</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-3">
              Private Dashboard — {activeTab.replace('_', ' ')}
            </p>
          </div>
          <div className="h-[1px] flex-1 bg-neutral-200 mb-2 hidden md:block mx-12"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-neutral-100 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-xl font-light mb-4 shadow-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  {user?.firstName} {user?.lastName} <MdVerified className="text-blue-500" size={14} />
                </h2>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1.5 font-bold">{user?.email}</p>
              </div>

              <nav className="space-y-1">
                <SidebarButton icon={<IoPersonOutline />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <SidebarButton icon={<IoCubeOutline />} label="My Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                <SidebarButton icon={<IoHeartOutline />} label="Wishlist" count={wishlistItems.length} active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} />
                <SidebarButton icon={<IoBagHandleOutline />} label="Shopping Bag" count={cartItems.length} active={activeTab === 'cart'} onClick={() => setActiveTab('cart')} />
                
                <div className="pt-6 mt-6 border-t border-neutral-50">
                  <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors text-[10px] font-black uppercase tracking-widest p-2 w-full">
                    <IoLogOutOutline size={16} /> Secure Logout
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <main className="lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-white p-10 border border-neutral-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-8">Account Identity</h3>
                    <div className="space-y-5">
                      <InfoBlock label="Legal Name" value={`${user?.firstName} ${user?.lastName}`} />
                    </div>
                  </section>

                  <section className="bg-white p-10 border border-neutral-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-8">Primary Residence</h3>
                    <address className="not-italic text-[11px] leading-relaxed text-neutral-600 uppercase tracking-[0.1em] font-medium">
                      {user?.address ? `${user.address}, ${user.city}` : "No address registered"}
                    </address>
                  </section>
                </div>
                {/* Brief Order Preview */}
                {/* <RecentOrdersPreview orders={orders} onViewAll={() => setActiveTab('orders')} /> */}
              </div>
            )}

            {/* {activeTab === 'orders' && <OrderHistoryView orders={orders} />} */}

            {activeTab === 'wishlist' && <WishlistView items={wishlistItems} />}

            {activeTab === 'cart' && <CartView items={cartItems} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// --- VIEW COMPONENTS ---

function OrderHistoryView({ orders }: { orders: any[] }) {
  return (
    <section className="bg-white border border-neutral-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Purchase Archive</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-neutral-50/30">
              <th className="px-10 py-5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Serial</th>
              <th className="px-10 py-5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {orders?.map((order) => (
              <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-10 py-6 text-[10px] font-mono font-black uppercase tracking-widest text-black">#{order._id.slice(-6)}</td>
                <td className="px-10 py-6 text-[11px] font-black text-right text-black">₦{order.totalAmount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WishlistView({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {items.length > 0 ? items.map((item) => (
        <div key={item.id} className="bg-white p-6 border border-neutral-100 flex gap-6 items-center group">
          <div className="w-20 h-24 relative bg-neutral-50">
            <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest">{item.name}</h4>
            <p className="text-[11px] font-bold mt-1">₦{item.price.toLocaleString()}</p>
            <button className="mt-4 text-[9px] font-black uppercase tracking-widest border-b border-black">Move to Bag</button>
          </div>
        </div>
      )) : (
        <div className="col-span-full py-20 text-center text-neutral-300 text-[10px] uppercase font-black tracking-[0.3em]">Your wishlist is currently empty</div>
      )}
    </div>
  );
}

function CartView({ items }: { items: any[] }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {items.length > 0 ? (
        <>
          <div className="bg-white border border-neutral-100 divide-y divide-neutral-50">
            {items.map((item) => (
              <div key={item.productId} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-20 relative bg-neutral-50"><Image src={item.image} alt={item.name} fill className="object-cover" /></div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">{item.name}</h4>
                    <p className="text-[9px] text-neutral-400 mt-1 uppercase font-bold">Size: {item.size} × {item.quantity}</p>
                  </div>
                </div>
                <p className="text-[11px] font-black">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
             <Link href="/checkout" className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Finalize Purchase</Link>
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-neutral-300 text-[10px] uppercase font-black tracking-[0.3em]">Your bag is empty</div>
      )}
    </div>
  );
}

// --- SMALL ATOMS ---

function SidebarButton({ icon, label, active, count, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 transition-all duration-300 group ${active ? 'bg-black text-white' : 'text-neutral-400 hover:bg-neutral-50 hover:text-black'}`}>
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em]">
        <span className={active ? 'text-white' : 'text-neutral-300 group-hover:text-black'}>{icon}</span>
        {label}
      </div>
      {count !== undefined ? <span className="text-[9px] font-black">{count}</span> : <IoChevronForward size={10} className={active ? 'opacity-100' : 'opacity-0'} />}
    </button>
  );
}

function InfoBlock({ label, value }: any) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-300 mb-1.5 font-bold">{label}</p>
      <p className="text-xs font-black text-black tracking-wide uppercase">{value || "Not Set"}</p>
    </div>
  );
}

function RecentOrdersPreview({ orders, onViewAll }: any) {
  return (
    <section className="bg-white border border-neutral-100 p-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Recent Activity</h3>
        <button onClick={onViewAll} className="text-[9px] font-black uppercase tracking-widest border-b border-black">View All</button>
      </div>
      <div className="text-[11px] text-neutral-500 italic">
        {orders?.length > 0 ? `Your last order was placed on ${new Date(orders[0].createdAt).toLocaleDateString()}.` : "No recent purchases."}
      </div>
    </section>
  );
}

function getStatusStyles(status: string) {
  const s = status?.toLowerCase();
  const styles: Record<string, string> = {
    delivered: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    processing: 'text-amber-700 bg-amber-50 border border-amber-100',
    shipped: 'text-sky-700 bg-sky-50 border border-sky-100',
    cancelled: 'text-rose-700 bg-rose-50 border border-rose-100',
  };
  return styles[s] || 'text-neutral-500 bg-neutral-50 border border-neutral-100';
}