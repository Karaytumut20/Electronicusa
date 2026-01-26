"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, LogOut, LayoutDashboard, List, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 h-[80px] flex items-center justify-center sticky top-0 z-50">
      <div className="container max-w-7xl flex items-center justify-between px-6 h-full">

        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">E</div>
            <span className="font-bold text-2xl tracking-tight text-slate-800 hidden sm:block">Electronic<span className="text-indigo-600">USA</span></span>
          </Link>
        </div>

        <div className="flex-1 max-w-[500px] mx-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full h-[50px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm"
            />
            <Search size={20} className="absolute left-4 top-[15px] text-gray-400" />
          </form>
        </div>

        <div className="flex items-center gap-4">
            <Link href="/ilan-ver" className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus size={18}/> <span>Post Ad</span>
            </Link>

            {!user ? (
              <div className="flex items-center gap-4 text-sm font-bold">
                <Link href="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                <Link href="/register" className="text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full">Register</Link>
              </div>
            ) : (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 font-bold text-sm text-slate-700">
                   <User size={20} /> {user.name}
                </button>
                {menuOpen && (
                   <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                      <Link href="/bana-ozel" className="block px-4 py-2 hover:bg-gray-50 text-sm">Dashboard</Link>
                      <Link href="/bana-ozel/ilanlarim" className="block px-4 py-2 hover:bg-gray-50 text-sm">My Ads</Link>
                      <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600">Logout</button>
                   </div>
                )}
              </div>
            )}
        </div>
      </div>
    </header>
  );
}