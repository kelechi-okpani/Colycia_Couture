'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';

interface Props {
  pathname: string;
  user: any;
  onToggleSidebar?: () => void;
}

export default function AdminHeader({
  pathname,
  user,
  onToggleSidebar,
}: Props) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.includes('/referrals')) return 'Referrals';
    if (pathname.includes('/orders')) return 'Orders';
    if (pathname.includes('/products')) return 'Products';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Admin';
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Mobile Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
            {getPageTitle()}
          </h2>

          <p className="hidden sm:block text-xs sm:text-sm text-gray-500 truncate">
            Welcome back, {user?.firstName || 'Admin'}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-2 px-3 lg:px-4 h-10 lg:h-11 bg-gray-100 rounded-xl w-40 lg:w-64">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-black text-white flex items-center justify-center font-bold uppercase text-sm sm:text-base">
          {user?.firstName?.charAt(0) || 'A'}
        </div>
      </div>

      {/* MOBILE SEARCH DROPDOWN */}
      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 p-3 md:hidden z-50">
          <div className="flex items-center gap-2 px-3 h-11 bg-gray-100 rounded-xl">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>
      )}
    </header>
  );
}