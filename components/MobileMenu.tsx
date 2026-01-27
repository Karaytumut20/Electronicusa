"use client";
import React from 'react';
import Link from 'next/link';
import { X, Home, List, MessageSquare, Settings, LogOut, Star, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* 1. BACKDROP (Background - Click to close) */}
      <div
        className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. DROPDOWN MENU */}
      <div className="fixed top-[75px] right-4 z-[100] w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">

        {/* Top Section: User Info or Login */}
        <div className="bg-slate-900 text-white p-5 shrink-0 relative">
          {/* Close button (Optional for dropdowns but good for UX) */}
          <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold border-2 border-white/20 text-lg shadow-sm">
                 {user.name?.charAt(0) || 'U'}
               </div>
               <div className="min-w-0">
                  <p className="font-bold text-base truncate">{user.name}</p>
                  <p className="text-xs text-indigo-300 truncate">{user.email}</p>
               </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-bold text-lg mb-1">Welcome</p>
              <p className="text-xs text-slate-400 mb-4">Log in to manage your ads.</p>
              <div className="flex gap-2">
                <Link href="/login" onClick={onClose} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold text-xs transition-colors">Login</Link>
                <Link href="/register" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-bold text-xs transition-colors">Register</Link>
              </div>
            </div>
          )}
        </div>

        {/* Middle Section: Menu Links */}
        <div className="flex-1 overflow-y-auto py-2 bg-white max-h-[60vh]">
          <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu</p>
          <ul className="text-sm text-slate-700 font-medium space-y-1 px-2">
            <li>
              <Link href="/" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <Home size={18} className="text-indigo-600"/> Home
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                    <User size={18} className="text-indigo-600"/> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/my-ads" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                    <List size={18} className="text-indigo-600"/> My Listings
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/messages" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                    <MessageSquare size={18} className="text-indigo-600"/> Messages
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Star size={18} className="text-indigo-600"/> Favorites
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Settings size={18} className="text-indigo-600"/> Settings
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Bottom Section: Logout (Only if logged in) */}
        {user && (
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={16}/> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}