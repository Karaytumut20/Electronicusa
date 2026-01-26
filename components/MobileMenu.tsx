"use client";
import React from 'react';
import Link from 'next/link';
import { X, Home, List, MessageSquare, Settings, LogOut, Star, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex md:hidden justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-slate-900 text-white p-6 pt-10 flex flex-col gap-4 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={24} /></button>
          {user ? (
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold border-2 border-white/20">{user.name?.charAt(0)}</div>
                 <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{user.name}</p>
                    <p className="text-xs text-indigo-300 truncate">{user.email}</p>
                 </div>
              </div>
              <button onClick={() => { logout(); onClose(); }} className="text-xs bg-red-500/20 text-red-200 px-3 py-1.5 rounded-full flex items-center gap-1"><LogOut size={12}/> Logout</button>
            </div>
          ) : (
            <div className="mt-6">
              <p className="font-bold text-xl mb-1">Welcome</p>
              <p className="text-xs text-slate-400 mb-6">Log in to manage your ads.</p>
              <div className="flex gap-3">
                <Link href="/login" onClick={onClose} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm text-center">Login</Link>
                <Link href="/register" onClick={onClose} className="flex-1 bg-white/10 text-white py-2.5 rounded-lg font-bold text-sm text-center">Register</Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-2 bg-slate-50">
          <p className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
          <ul className="text-sm text-slate-700 font-medium divide-y divide-slate-100 bg-white">
            <li><Link href="/" onClick={onClose} className="flex items-center gap-4 px-6 py-4"><Home size={20}/> Home</Link></li>
            {user && (
              <>
                <li><Link href="/dashboard" onClick={onClose} className="flex items-center gap-4 px-6 py-4"><User size={20}/> Dashboard</Link></li>
                <li><Link href="/dashboard/my-ads" onClick={onClose} className="flex items-center gap-4 px-6 py-4"><List size={20}/> My Listings</Link></li>
                <li><Link href="/dashboard/messages" onClick={onClose} className="flex items-center gap-4 px-6 py-4"><MessageSquare size={20}/> Messages</Link></li>
                <li><Link href="/dashboard/favorites" onClick={onClose} className="flex items-center gap-4 px-6 py-4"><Star size={20}/> Favorites</Link></li>
                <li><Link href="/dashboard/settings" onClick={onClose} className="flex items-center gap-4 px-6 py-4"><Settings size={20}/> Settings</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}