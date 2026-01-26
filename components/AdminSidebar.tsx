"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, List, CreditCard, Settings, FileText, LogOut, ShieldAlert, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
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
    { label: 'Categories', href: '/admin/categories', icon: Tag }, // EKLENDİ
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Moderation', href: '/admin/moderation', icon: ShieldAlert },
    { label: 'System Logs', href: '/admin/logs', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#1e293b] min-h-screen text-white flex flex-col fixed left-0 top-0 h-full z-50 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
          <span className="bg-indigo-600 px-2 py-1 rounded text-sm">ADMIN</span>
          Panel
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full px-4 py-2 text-sm font-bold transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}