'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchUserProfile } from '@/app/store/slices/userSlice';
import { fetchOrders } from '@/app/store/slices/orderSlice';

import AdminLoader from '@/app/components/admin/Layout/AdminLoader';
import AdminSidebar from '@/app/components/admin/Layout/AdminSidebar';
import AdminHeader from '@/app/components/admin/Layout/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { profile: user, status } = useAppSelector(
    (state: any) => state.user
  );

  /**
   * Fetch user
   */
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  /**
   * Auth guard + orders
   */
  useEffect(() => {
    if (status === 'loading') return;

    if (!user?._id) {
      router.replace('/auth/login');
      return;
    }

    dispatch(fetchOrders({ userId: user._id || user.id }));
  }, [user, status, dispatch, router]);

  /**
   * Close sidebar on route change (mobile UX fix)
   */
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  /**
   * Prevent background scroll when sidebar open (mobile)
   */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  /**
   * Loader
   */
  if (status === 'loading') {
    return <AdminLoader />;
  }

  /**
   * Prevent flash
   */
  if (!user?._id) return null;

  return (
    <div className="h-screen flex bg-[#f6f6f7] overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-50 h-full w-64 bg-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* <AdminSidebar
          pathname={pathname}
        /> */}
            <AdminSidebar
            pathname={pathname}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
      />
      </aside>

      {/* MAIN AREA */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* HEADER */}
        <AdminHeader
          pathname={pathname}
          user={user}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-8xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}