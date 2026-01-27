"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Plus, User, X, Home, List, MessageSquare, Settings, LogOut, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Hide search on auth pages
  const hideSearch = pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-[70px] md:h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all shadow-sm">
        <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 h-full gap-4 relative">

          {/* LEFT: LOGO */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-200">E</div>
              <span className="font-black text-lg md:text-2xl tracking-tighter text-slate-800 hidden xs:block">Electronic<span className="text-indigo-600">USA</span></span>
            </Link>
          </div>

          {/* MIDDLE: SEARCH BAR (Desktop) */}
          {!hideSearch && (
            <div className="flex-1 max-w-[500px] hidden lg:block">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search brands, models or products..."
                  className="w-full h-[46px] pl-12 pr-4 bg-slate-50 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
                />
                <Search size={18} className="absolute left-4 top-[14px] text-slate-400 group-focus-within:text-indigo-600" />
              </form>
            </div>
          )}

          {/* RIGHT: ACTIONS & UNIFIED USER MENU */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/post-ad" className="bg-indigo-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-full md:rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={20}/> <span className="hidden md:inline">Post Ad</span>
            </Link>

            {/* --- USER MENU CONTAINER --- */}
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 rounded-full bg-slate-100 border-2 border-transparent hover:border-indigo-200 transition-all overflow-hidden flex items-center justify-center text-slate-600 active:scale-95"
                >
                    {user?.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                    ) : (
                        <User size={20} />
                    )}
                </button>

                {/* DROPDOWN MENU */}
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={closeMenu}></div>
                    <div className="absolute right-0 top-full mt-3 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right z-50">

                        <div className="bg-slate-900 text-white p-5 shrink-0 relative">
                            <button onClick={closeMenu} className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                                <X size={16} />
                            </button>
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold border-2 border-white/20 text-sm shadow-sm shrink-0">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{user.name}</p>
                                        <p className="text-[10px] text-indigo-300 truncate">{user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="font-bold text-sm mb-1">Welcome</p>
                                    <p className="text-[10px] text-slate-400 mb-3">Login to manage ads.</p>
                                    <div className="flex gap-2">
                                        <Link href="/login" onClick={closeMenu} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold text-xs transition-colors">Login</Link>
                                        <Link href="/register" onClick={closeMenu} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-bold text-xs transition-colors">Register</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="py-2 bg-white max-h-[50vh] overflow-y-auto">
                            <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu</p>
                            <ul className="text-sm text-slate-700 font-medium space-y-1 px-2">
                                <li>
                                    <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                                        <Home size={16} className="text-indigo-600"/> Home
                                    </Link>
                                </li>
                                {user && (
                                <>
                                    <li>
                                        <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <User size={16} className="text-indigo-600"/> Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/my-ads" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <List size={16} className="text-indigo-600"/> My Listings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/messages" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <MessageSquare size={16} className="text-indigo-600"/> Messages
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/favorites" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <Star size={16} className="text-indigo-600"/> Favorites
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/settings" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <Settings size={16} className="text-indigo-600"/> Settings
                                        </Link>
                                    </li>
                                </>
                                )}
                            </ul>
                        </div>

                        {user && (
                            <div className="p-2 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => { logout(); closeMenu(); }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <LogOut size={14}/> Logout
                                </button>
                            </div>
                        )}
                    </div>
                  </>
                )}
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE SEARCH BAR (Fixed Position & Spacing) */}
      {!hideSearch && (
        <div className="lg:hidden bg-slate-50 px-4 py-4 border-b border-slate-200 sticky top-[70px] z-[40] shadow-sm">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all placeholder:text-slate-400"
            />
            <Search size={20} className="absolute left-3.5 top-[14px] text-slate-400" />
          </form>
        </div>
      )}
    </>
  );
}