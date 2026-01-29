"use client";
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Path kontrolü için eklendi

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname(); // Mevcut sayfa yolu

  // --- KRİTİK KONTROL: Login sayfasındaysak Sidebar'ı GİZLE ---
  // Sadece içeriği (Login Formunu) döndür, wrapper stillerini uygulama.
  if (pathname === '/admin/login') {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">

      {/* --- CUSTOM ADMIN MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 shadow-lg border-b border-slate-800">
         <div className="flex items-center gap-3">
            {/* Menü Butonu (Sol) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-slate-200 hover:text-white"
            >
                <Menu size={24} />
            </button>

            {/* Logo ve Başlık (Tıklanabilir Link) */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-indigo-500/30">
                  E
                </div>
                <span className="font-bold text-base tracking-wide text-slate-100">Admin Panel</span>
            </Link>
         </div>

         {/* Sağ Kısım: Bildirim / Profil */}
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
         </div>
      </div>

      {/* --- SIDEBAR (z-index 50, Header'ın üzerine çıkar) --- */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-72 pt-16 lg:pt-0">
         <main className="p-4 md:p-8 overflow-x-hidden w-full max-w-[1600px] mx-auto">
            {children}
         </main>
      </div>
    </div>
  );
}