"use client";
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">

      {/* MOBILE HEADER (Sadece mobilde görünür - Sidebar'ı açar) */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#1e293b] text-white flex items-center justify-between px-4 z-40 shadow-md">
         <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wide">ADMIN PANEL</span>
         </div>
         <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
         >
            <Menu size={24} />
         </button>
      </div>

      {/* SIDEBAR (Responsive - Mobilde açılır/kapanır, Masaüstünde sabit) */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT (Masaüstünde sidebar kadar sağa itilir, Mobilde üstten boşluk bırakır) */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-64 pt-16 lg:pt-0">
         <main className="p-4 md:p-8 overflow-x-hidden w-full">
            {children}
         </main>
      </div>
    </div>
  );
}