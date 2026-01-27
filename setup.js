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
    "\n🚀 MAKING 'ADMIN PANEL' TEXT CLICKABLE (LINK TO HOME)...\n" +
    colors.reset,
);

const filesToUpdate = [
  // 1. AdminLayoutWrapper (Mobil Üst Başlık)
  {
    path: "components/admin/AdminLayoutWrapper.tsx",
    content: `"use client";
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link'; // Link eklendi

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

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

            {/* Logo ve Başlık (Artık Tıklanabilir Link) */}
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
`,
  },
  // 2. AdminSidebar (Yan Menü Başlığı)
  {
    path: "components/AdminSidebar.tsx",
    content: `"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, List, Settings, FileText, LogOut, Tag, X, ShieldAlert, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Listings', href: '/admin/listings', icon: List },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'System Logs', href: '/admin/logs', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* --- BACKDROP (Sadece Mobilde) --- */}
      <div
        className={\`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 \${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }\`}
        onClick={onClose}
      />

      {/* --- SIDEBAR PANEL --- */}
      <aside
        className={\`
          fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 shadow-2xl border-r border-slate-800
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:fixed lg:shadow-none
          \${isOpen ? 'translate-x-0' : '-translate-x-full'}
        \`}
      >
        <div className="flex flex-col h-full">

            {/* HEADER / LOGO (Artık Tıklanabilir Link) */}
            <div className="p-6 flex justify-between items-center border-b border-slate-800/60 bg-slate-900">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  E
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white leading-none">Admin Panel</h1>
                    <p className="text-[10px] text-indigo-400 font-medium tracking-wider mt-1 uppercase">Go to Home</p>
                </div>
              </Link>

              {/* Mobil Kapatma Butonu */}
              <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* MENÜ LİNKLERİ */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-2">Main Menu</p>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={\`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative \${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }\`}
                  >
                    <item.icon size={20} className={\`transition-transform group-hover:scale-110 \${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}\`} />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                  </Link>
                );
              })}
            </nav>

            {/* USER PROFILE & LOGOUT */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              {user && (
                  <div className="flex items-center gap-3 mb-4 px-2">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar ? (
                              <img src={user.avatar} className="w-full h-full object-cover" alt="Admin" />
                          ) : (
                              <span className="font-bold text-indigo-400">{user.name?.charAt(0).toUpperCase()}</span>
                          )}
                      </div>
                      <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                  </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-transparent hover:border-red-500/20"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
        </div>
      </aside>
    </>
  );
}
`,
  },
];

filesToUpdate.forEach((file) => {
  try {
    const filePath = path.join(process.cwd(), file.path);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " updated successfully." + colors.reset,
    );
  } catch (err) {
    console.error(colors.bold + "✘ Error: " + err.message + colors.reset);
  }
});

console.log(
  colors.green +
    "\n✅ 'Admin Panel' text is now a link to the homepage in both Sidebar and Mobile Header." +
    colors.reset,
);
