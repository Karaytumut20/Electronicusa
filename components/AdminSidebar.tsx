"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, List, Settings, FileText, LogOut, Tag, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Listings', href: '/admin/listings', icon: List },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'System Logs', href: '/admin/logs', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* MOBİL İÇİN ARKA PLAN (Backdrop) */}
      {/* Sadece mobilde ve menü açıkken görünür, tıklayınca kapatır */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#1e293b] text-white z-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:fixed lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* LOGO & HEADER */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center h-20 lg:h-auto">
          <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <span className="bg-indigo-600 px-2 py-1 rounded text-sm shadow-lg">ADMIN</span>
            <span>Panel</span>
          </h1>
          {/* Mobilde Kapatma Butonu */}
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md">
            <X size={24} />
          </button>
        </div>

        {/* MENÜ LİNKLERİ */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Mobilde linke tıklayınca menüyü kapat
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ÇIKIŞ BUTONU */}
        <div className="p-4 border-t border-slate-700 bg-[#1e293b] absolute bottom-0 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}