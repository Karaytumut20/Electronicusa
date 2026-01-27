"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Plus, User, LogOut } from 'lucide-react'; // Menu ikonu kaldırıldı
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Arama çubuğunun gizleneceği sayfalar
  const hideSearch = pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-[70px] md:h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all">
        <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 h-full gap-4">

          {/* SOL TARA: LOGO (Hamburger Menü Kaldırıldı) */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-200">E</div>
              <span className="font-black text-lg md:text-2xl tracking-tighter text-slate-800 hidden xs:block">Electronic<span className="text-indigo-600">USA</span></span>
            </Link>
          </div>

          {/* ORTA: ARAMA ÇUBUĞU (Masaüstünde görünür) */}
          {!hideSearch && (
            <div className="flex-1 max-w-[500px] hidden lg:block">
              <form onSubmit={handleSearch} className="relative group">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Marka, model veya ürün ara..." className="w-full h-[46px] pl-12 pr-4 bg-slate-100 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none" />
                <Search size={18} className="absolute left-4 top-[14px] text-slate-400 group-focus-within:text-indigo-600" />
              </form>
            </div>
          )}

          {/* SAĞ TARA: İŞLEMLER VE KULLANICI MENÜSÜ */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/post-ad" className="bg-indigo-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-full md:rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={20}/> <span className="hidden md:inline">İlan Ver</span>
            </Link>

            {/* --- MOBİL İÇİN KULLANICI İKONU (Sidebar Tetikleyici) --- */}
            {/* Sadece mobilde görünür (lg:hidden) */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 rounded-full bg-slate-100 border-2 border-transparent hover:border-indigo-200 transition-all overflow-hidden flex items-center justify-center text-slate-600"
            >
                {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                ) : (
                    <User size={20} />
                )}
            </button>

            {/* --- MASAÜSTÜ İÇİN KULLANICI ALANI --- */}
            {/* Sadece masaüstünde görünür (hidden lg:block) */}
            <div className="hidden lg:block">
                {!user ? (
                  <Link href="/login" className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100">Giriş Yap</Link>
                ) : (
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-transparent hover:border-indigo-200 transition-all overflow-hidden flex items-center justify-center">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-600" />}
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-gray-50 mb-2">
                            <p className="font-bold text-sm text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700">Bana Özel</Link>
                        <Link href="/dashboard/my-ads" className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700">İlanlarım</Link>
                        <div className="border-t border-slate-50 mt-2 pt-2">
                          <button onClick={logout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 font-bold"><LogOut size={16}/> Çıkış Yap</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>

          </div>
        </div>
      </header>

      {/* MOBİL ARAMA (Header altında sabit) */}
      {!hideSearch && (
        <div className="lg:hidden bg-white px-4 pb-3 border-b border-slate-100 sticky top-[70px] z-[45]">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="İlan ara..." className="w-full h-[40px] pl-10 pr-4 bg-slate-100 rounded-xl text-sm outline-none border-none focus:ring-2 focus:ring-indigo-200" />
            <Search size={16} className="absolute left-3 top-[12px] text-slate-400" />
          </form>
        </div>
      )}

      {/* MOBİL MENÜ BİLEŞENİ (Yapısı korunarak tetikleniyor) */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}