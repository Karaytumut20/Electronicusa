"use client";
import React from 'react';
import Link from 'next/link';
import { X, ChevronRight, Home, Car, List, MessageSquare, Settings, LogOut, User, Store, Wallet, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex md:hidden justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-slate-900 text-white p-5 pt-8 flex flex-col gap-4 relative overflow-hidden shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20"><X size={24} /></button>
          {user ? (
            <div className="relative z-10 mt-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white/20 shadow-lg text-white">{user.name?.charAt(0)}</div>
                 <div className="min-w-0">
                    <p className="font-bold text-lg leading-tight truncate">{user.name}</p>
                    <p className="text-xs text-indigo-300 font-medium truncate">{user.email}</p>
                 </div>
              </div>
              <button onClick={() => { logout(); onClose(); }} className="mt-2 text-xs bg-red-500/20 text-red-100 hover:bg-red-500/30 px-3 py-1.5 rounded-full flex items-center gap-1 w-fit"><LogOut size={12}/> Logout</button>
            </div>
          ) : (
            <div className="relative z-10 mt-6">
              <p className="font-bold text-xl mb-1">Welcome</p>
              <p className="text-xs text-slate-400 mb-4">Log in to post ads and message sellers.</p>
              <div className="flex gap-3">
                <Link href="/login" onClick={onClose} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm text-center">Login</Link>
                <Link href="/register" onClick={onClose} className="flex-1 bg-white/10 text-white py-2.5 rounded-lg font-bold text-sm text-center">Register</Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-2 bg-slate-50">
          {user && (
            <div className="bg-white border-b border-slate-100 mb-2">
               <p className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">Account</p>
               <ul className="text-sm text-slate-700 font-medium divide-y divide-slate-50">
                  <li><Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50"><Home size={18}/> Dashboard</Link></li>
                  <li><Link href="/dashboard/my-ads" onClick={onClose} className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50"><List size={18}/> My Listings</Link></li>
                  <li><Link href="/dashboard/messages" onClick={onClose} className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50"><MessageSquare size={18}/> Messages</Link></li>
                  <li><Link href="/dashboard/favorites" onClick={onClose} className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50"><Star size={18}/> Favorites</Link></li>
                  <li><Link href="/dashboard/settings" onClick={onClose} className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50"><Settings size={18}/> Settings</Link></li>
               </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}