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
    "\n🚀 CONNECTING HEADER TO DATABASE SETTINGS...\n" +
    colors.reset,
);

const filesToUpdate = [
  // 1. HEADER: Artık site ismini veritabanından (prop olarak) alıyor
  {
    path: "components/Header.tsx",
    content: `"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Plus, User, X, Home, List, MessageSquare, Settings, LogOut, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';

// Site ismi artık yukarıdan (Layout'tan) geliyor
export default function Header({ siteName = 'ElectronicUSA' }: { siteName?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const hideSearch = pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // LOGO HARFİ: Veritabanından gelen ismin baş harfi
  const logoLetter = siteName ? siteName.charAt(0).toUpperCase() : 'E';

  // Marka ismini renklendirme (Son 3 harfi renkli yapalım, estetik olsun)
  const renderBrandName = () => {
     if (!siteName) return null;
     if (siteName.length <= 3) return <span className="text-slate-800">{siteName}</span>;

     const mainPart = siteName.slice(0, -3);
     const coloredPart = siteName.slice(-3);

     return (
       <>
         <span className="text-slate-800">{mainPart}</span>
         <span className="text-indigo-600">{coloredPart}</span>
       </>
     );
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-[70px] md:h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all shadow-sm">
        <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 h-full gap-3 md:gap-4 relative">

          {/* LOGO & SITE NAME */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Dinamik Baş Harf */}
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-200 transition-all duration-300">
                {logoLetter}
              </div>
              {/* Veritabanından Gelen İsim */}
              <span className="font-black text-lg md:text-2xl tracking-tighter hidden md:block">
                {renderBrandName()}
              </span>
            </Link>
          </div>

          {/* SEARCH BAR */}
          {!hideSearch && (
            <div className="flex-1 max-w-[600px]">
              <form onSubmit={handleSearch} className="relative group w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-[40px] md:h-[46px] pl-10 md:pl-12 pr-4 bg-slate-100 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none placeholder:text-slate-400"
                />
                <Search size={18} className="absolute left-3.5 md:left-4 top-[11px] md:top-[14px] text-slate-400 group-focus-within:text-indigo-600" />
              </form>
            </div>
          )}

          {/* ACTIONS & MENU */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/post-ad" className="bg-indigo-600 text-white p-2 md:px-5 md:py-2.5 rounded-full md:rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={20}/> <span className="hidden md:inline">Post Ad</span>
            </Link>

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
                <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
`,
  },
  // 2. LAYOUT: Veritabanından ismi çekip Header'a gönderiyor
  {
    path: "app/layout.tsx",
    content: `import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalRoot from "@/components/ModalRoot";
import { getSystemSettings } from "@/lib/adminActions"; // Ayarları çekmek için

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace - Global İlan Platformu",
  description: "Dünyanın en büyük ilan platformu.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Veritabanından Site İsmini Çek
  const settings = await getSystemSettings();
  const siteName = settings?.site_name || 'ElectronicUSA'; // Varsayılan değer

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* Site ismini Header'a prop olarak gönder */}
            <Header siteName={siteName} />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ModalRoot />
        </Providers>
      </body>
    </html>
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
      colors.green + "✔ " + file.path + " successfully updated." + colors.reset,
    );
  } catch (err) {
    console.error(colors.bold + "✘ Error: " + err.message + colors.reset);
  }
});

console.log(
  colors.green +
    "\n✅ System integrated! Header text and logo letter now come from the Database." +
    colors.reset,
);
