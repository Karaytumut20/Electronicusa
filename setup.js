const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🛠️  FIXING USER MENU POSITIONING VIA SETUP.JS...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// UPDATE components/MobileMenu.tsx
// ---------------------------------------------------------
const mobileMenuContent = `"use client";
import React from 'react';
import Link from 'next/link';
import { X, Home, List, MessageSquare, Settings, LogOut, Star, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Bu bileşen artık Navbar'daki avatarın hemen altında hizalanacak şekilde güncellendi.
export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* 1. BACKDROP - Menü dışına tıklandığında kapanmasını sağlar */}
      <div
        className="fixed inset-0 z-[90] bg-transparent cursor-default"
        onClick={onClose}
      ></div>

      {/* 2. DROPDOWN MENU CONTENT */}
      {/* absolute top-full right-0: Parent element olan 'relative' div'in tam altına ve sağına hizalar */}
      <div className="absolute top-[calc(100%+10px)] right-0 z-[100] w-[280px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">

        {/* Üst Bilgi Alanı */}
        <div className="bg-slate-900 text-white p-5 shrink-0 relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
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
              <p className="text-[10px] text-slate-400 mb-3">Log in to manage your ads.</p>
              <div className="flex gap-2">
                <Link href="/login" onClick={onClose} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg font-bold text-[10px] transition-colors">Login</Link>
                <Link href="/register" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg font-bold text-[10px] transition-colors">Register</Link>
              </div>
            </div>
          )}
        </div>

        {/* Menü Linkleri */}
        <div className="flex-1 overflow-y-auto py-2 bg-white max-h-[60vh]">
          <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
          <ul className="text-xs text-slate-700 font-medium space-y-1 px-2">
            <li>
              <Link href="/" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                <Home size={16} className="text-indigo-600"/> Home
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                    <User size={16} className="text-indigo-600"/> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/my-ads" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                    <List size={16} className="text-indigo-600"/> My Listings
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/messages" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                    <MessageSquare size={16} className="text-indigo-600"/> Messages
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Star size={16} className="text-indigo-600"/> Favorites
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Settings size={16} className="text-indigo-600"/> Settings
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Çıkış Butonu */}
        {user && (
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={14}/> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "components/MobileMenu.tsx"),
    mobileMenuContent.trim(),
  );
  console.log(
    colors.green +
      "✔ components/MobileMenu.tsx updated with relative positioning." +
      colors.reset,
  );
} catch (e) {
  console.error("Error updating MobileMenu:", e.message);
}
