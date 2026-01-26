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
    "\n🚀 OPTIMIZING CATEGORY HIERARCHY & IMPORTING DATA...\n" +
    colors.reset,
);

// NOT: Supabase > Authentication > Users kısmından kendi ID'nizi buraya yapıştırın.
const MOCK_USER_ID = "YOUR_SUPABASE_USER_ID_HERE";

const filesToUpdate = [
  {
    path: "components/Header.tsx",
    content: `"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Plus, User, LogOut, Menu } from 'lucide-react';
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
    if (searchTerm.trim()) router.push(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-[70px] md:h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all">
        <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 h-full gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 active:bg-slate-100 rounded-full">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-200">E</div>
              <span className="font-black text-lg md:text-2xl tracking-tighter text-slate-800 hidden xs:block">Electronic<span className="text-indigo-600">USA</span></span>
            </Link>
          </div>

          {!hideSearch && (
            <div className="flex-1 max-w-[500px] hidden lg:block">
              <form onSubmit={handleSearch} className="relative group">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search brands, models or products..." className="w-full h-[46px] pl-12 pr-4 bg-slate-100 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none" />
                <Search size={18} className="absolute left-4 top-[14px] text-slate-400 group-focus-within:text-indigo-600" />
              </form>
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/post-ad" className="bg-indigo-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-full md:rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={20}/> <span className="hidden md:inline">Post Ad</span>
            </Link>
            {!user ? (
              <Link href="/login" className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100">Login</Link>
            ) : (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-transparent hover:border-indigo-200 transition-all overflow-hidden flex items-center justify-center">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-600" />}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link href="/dashboard" className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700">Dashboard</Link>
                    <Link href="/dashboard/my-ads" className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700">My Listings</Link>
                    <div className="border-t border-slate-50 mt-2 pt-2">
                      <button onClick={logout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 font-bold"><LogOut size={16}/> Logout</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {!hideSearch && (
        <div className="lg:hidden bg-white px-4 pb-3 border-b border-slate-100 sticky top-[70px] z-[45]">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search ads..." className="w-full h-[40px] pl-10 pr-4 bg-slate-100 rounded-xl text-sm outline-none border-none focus:ring-2 focus:ring-indigo-200" />
            <Search size={16} className="absolute left-3 top-[12px] text-slate-400" />
          </form>
        </div>
      )}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}`,
  },
];

filesToUpdate.forEach((file) => {
  try {
    const filePath = path.join(process.cwd(), file.path);
    fs.writeFileSync(filePath, file.content.trim());
    console.log(colors.green + "✔ " + file.path + " updated." + colors.reset);
  } catch (err) {
    console.error(colors.bold + "✘ Failed: " + err.message + colors.reset);
  }
});

// SQL DOSYASI OLUŞTURMA (Hiyerarşik Yapı)
let sqlContent =
  "-- 1. Kategorileri Temizle\\nTRUNCATE TABLE categories CASCADE;\\n\\n";

sqlContent += "-- 2. Ana Kategorileri Ekle\\n";
sqlContent += "INSERT INTO categories (id, title, slug, icon) VALUES\\n";
sqlContent += "(1, 'Apple Ecosystem', 'apple', 'Smartphone'),\\n";
sqlContent += "(2, 'Gaming & VR', 'gaming', 'Gamepad2'),\\n";
sqlContent += "(3, 'Laptops & Computing', 'computing', 'Monitor'),\\n";
sqlContent += "(4, 'Smart Home & Streaming', 'smart-home', 'Zap'),\\n";
sqlContent += "(5, 'Cameras & Action Cam', 'cameras', 'Camera'),\\n";
sqlContent += "(6, 'Consumer Electronics', 'consumer', 'Plug');\\n\\n";

sqlContent += "-- 3. Mantıklı Alt Kategorileri Ekle\\n";
sqlContent += "INSERT INTO categories (title, slug, parent_id) VALUES\\n";
sqlContent +=
  "('iPhones', 'iphones', 1), ('Airpods', 'airpods', 1), ('Apple Watch', 'apple-watch', 1), ('iPads', 'ipads', 1), ('Mac & Desktop', 'macs', 1), ('Apple Accessories', 'apple-acc', 1),\\n";
sqlContent +=
  "('VR Headsets (Meta)', 'vr-meta', 2), ('Gaming Consoles', 'consoles', 2), ('Controllers', 'controllers', 2), ('PlayStation VR', 'psvr', 2),\\n";
sqlContent +=
  "('Gaming Laptops', 'gaming-laptops', 3), ('Business Laptops', 'business-laptops', 3), ('PC Components', 'components', 3), ('Monitors', 'monitors', 3), ('Internal HDD/SSD', 'storage-drive', 3),\\n";
sqlContent +=
  "('Streaming Sticks (Fire/Onn)', 'streaming-sticks', 4), ('Smart Thermostats (Nest)', 'thermostats', 4), ('Mesh Wi-Fi & Routers', 'routers', 4), ('Echo & Smart Speakers', 'smart-speakers', 4),\\n";
sqlContent +=
  "('Action Cameras (DJI)', 'action-cams', 5), ('Camera Accessories', 'cam-acc', 5), ('Instant Film', 'instant-film', 5),\\n";
sqlContent +=
  "('Starlink Terminals', 'starlink', 6), ('Fitness Trackers (Whoop)', 'fitness', 6), ('Power Adapters', 'adapters', 6);\\n\\n";

sqlContent += "-- 4. Ürün Listesini Doğru Kategorilere Bağlayarak Ekle\\n";
sqlContent +=
  "INSERT INTO ads (user_id, title, price, currency, category, brand, city, status, is_vitrin) VALUES\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'Meta Quest 3S 128GB Walking Dead Bundle', 300, 'USD', 'vr-meta', 'Meta', 'Atlanta', 'yayinda', true),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'iPhone 17 Pro Max 256GB Orange Edition', 1199, 'USD', 'iphones', 'Apple', 'Miami', 'yayinda', true),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'Apple AirPods 4 - White MXP63LL/A', 179, 'USD', 'airpods', 'Apple', 'USA', 'yayinda', false),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'Sony PlayStation 5 Slim Console Digital', 499, 'USD', 'consoles', 'Sony', 'Miami', 'yayinda', true),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'HP Victus 15.6 Gaming Laptop RTX 4050', 850, 'USD', 'gaming-laptops', 'HP', 'USA', 'yayinda', false),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'Starlink Mini - High Speed Internet', 599, 'USD', 'starlink', 'SpaceX', 'USA', 'yayinda', true),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'Amazon Fire TV Stick 4K Max 2024', 59, 'USD', 'streaming-sticks', 'Amazon', 'Miami', 'yayinda', false),\\n";
sqlContent +=
  "('" +
  MOCK_USER_ID +
  "', 'Google Nest Learning Thermostat 3rd Gen', 249, 'USD', 'thermostats', 'Google', 'Miami', 'yayinda', false);\\n";

fs.writeFileSync("supabase/seed_data.sql", sqlContent);

console.log(
  colors.blue +
    "\n👉 Generated 'supabase/seed_data.sql'. Please run its content in Supabase SQL Editor." +
    colors.reset,
);
console.log(colors.green + "\n✅ ALL UPDATES READY!" + colors.reset);
