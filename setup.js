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
    "\n📱 MODERN MOBİL UYUMLULUK VE KATEGORİ SİSTEMİ KURULUYOR...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// 1. ANA SAYFA GÜNCELLEMESİ (app/page.tsx)
// Kategori listesini mobilde en üste yatay şerit olarak ekler.
// ---------------------------------------------------------
const pageContent = `
import React from 'react';
import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/HomeFeed";
import { getInfiniteAdsAction, getCategoryTreeServer } from "@/lib/actions";
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

export const revalidate = 0;

export default async function Home() {
  const { data: initialAds } = await getInfiniteAdsAction(1, 20);
  const categories = await getCategoryTreeServer();

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl font-sans">

      {/* MOBİL KATEGORİ ŞERİDİ (Sadece Mobilde Görünür) */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <LayoutGrid size={16} className="text-indigo-600" /> Kategoriler
          </h2>
          <Link href="/search" className="text-xs font-bold text-indigo-600">Tümü</Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={\`/search?category=\${cat.slug}\`}
              className="flex flex-col items-center gap-2 min-w-[80px] group"
            >
              <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 group-active:scale-95 transition-transform">
                {/* İkon ataması Sidebar mantığı ile aynı */}
                <span className="font-bold text-xl">{cat.title.charAt(0)}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight line-clamp-1">{cat.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-24">
            <Sidebar categories={categories} />
          </div>
        </aside>

        {/* ANA İÇERİK */}
        <main className="lg:col-span-9 xl:col-span-10 min-w-0">
          <HomeFeed initialAds={initialAds} />
        </main>
      </div>
    </div>
  );
}
`;

// ---------------------------------------------------------
// 2. HEADER GÜNCELLEMESİ (components/Header.tsx)
// Mobil arama ve menü butonlarını iyileştirir.
// ---------------------------------------------------------
const headerContent = `
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-[70px] md:h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all">
        <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 h-full gap-4">

          {/* SOL: LOGO & MENU TOGGLE */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-200">E</div>
              <span className="font-black text-lg md:text-2xl tracking-tighter text-slate-800 hidden xs:block">
                Electronic<span className="text-indigo-600">USA</span>
              </span>
            </Link>
          </div>

          {/* ORTA: ARAMA (Masaüstü) */}
          <div className="flex-1 max-w-[500px] hidden lg:block">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Marka, model veya ürün ara..."
                className="w-full h-[46px] pl-12 pr-4 bg-slate-100 border-transparent rounded-full focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm outline-none"
              />
              <Search size={18} className="absolute left-4 top-[14px] text-slate-400 group-focus-within:text-indigo-600" />
            </form>
          </div>

          {/* SAĞ: AKSİYONLAR */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/post-ad" className="bg-indigo-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-full md:rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100">
              <Plus size={20}/> <span className="hidden md:inline">İlan Ver</span>
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            {!user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Link href="/login" className="text-slate-600 hover:text-indigo-600 text-sm font-bold px-2">Giriş</Link>
                <Link href="/register" className="hidden sm:block text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100">Kayıt Ol</Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-transparent hover:border-indigo-200 transition-all overflow-hidden"
                >
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-slate-600" />
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-xs text-slate-400 font-bold uppercase">Hesabım</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700 transition-colors">Panelim</Link>
                    <Link href="/dashboard/my-ads" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700 transition-colors">İlanlarım</Link>
                    <div className="border-t border-slate-50 mt-2 pt-2">
                      <button onClick={logout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 font-bold transition-colors">
                        <LogOut size={16}/> Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBİL ARAMA ÇUBUĞU (Sadece Mobilde Logo Altında) */}
      <div className="lg:hidden bg-white px-4 pb-3 border-b border-slate-100 sticky top-[70px] z-[45]">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ne aramıştınız?"
            className="w-full h-[40px] pl-10 pr-4 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <Search size={16} className="absolute left-3 top-[12px] text-slate-400" />
        </form>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
`;

// ---------------------------------------------------------
// 3. AD CARD GÜNCELLEMESİ (components/AdCard.tsx)
// Mobilde daha fazla bilgi sığdırmak için fontları ve boşlukları küçültür.
// ---------------------------------------------------------
const adCardContent = `
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';

export default function AdCard({ ad, viewMode = 'grid' }: { ad: any, viewMode?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(ad.id);

  const priceDisplay = formatPrice(ad.price, ad.currency);
  const imageUrl = ad.image || 'https://via.placeholder.com/600x400?text=Resim+Yok';

  return (
    <Link href={\`/ilan/\${ad.id}\`} className="group block h-full">
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden">

        {/* RESİM ALANI */}
        <div className="relative aspect-[1/1] xs:aspect-[4/3] overflow-hidden bg-slate-50">
          <Image
            src={imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* BADGES */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {ad.is_urgent && (
              <span className="bg-rose-500 text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
                <Zap size={10} fill="currentColor"/> ACİL
              </span>
            )}
            {ad.is_vitrin && (
              <span className="bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg">
                VİTRİN
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(ad.id); }}
            className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Star size={16} className={liked ? "fill-rose-500 text-rose-500" : ""} />
          </button>
        </div>

        {/* İÇERİK ALANI */}
        <div className="p-2.5 md:p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-slate-800 text-[11px] md:text-sm leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {ad.title}
          </h3>

          <div className="mt-auto">
            <div className="text-indigo-700 font-black text-[13px] md:text-lg tracking-tight">
              {priceDisplay}
            </div>
            <div className="flex justify-between items-center mt-1 border-t border-slate-50 pt-1.5 text-[9px] md:text-[10px] text-slate-400">
              <span className="flex items-center gap-0.5 truncate max-w-[70%] italic">
                <MapPin size={10} /> {ad.city}
              </span>
              <span className="font-medium whitespace-nowrap">
                {new Date(ad.created_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
`;

const files = [
  { path: "app/page.tsx", content: pageContent },
  { path: "components/Header.tsx", content: headerContent },
  { path: "components/AdCard.tsx", content: adCardContent },
];

files.forEach((file) => {
  try {
    const filePath = path.join(process.cwd(), file.path);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " revize edildi." + colors.reset,
    );
  } catch (err) {
    console.error(
      colors.bold + "✘ " + file.path + " hata:" + err.message + colors.reset,
    );
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ TASARIM FULL MOBİL UYUMLU HALE GETİRİLDİ!" +
    colors.reset,
);
console.log(
  "👉 Değişikliklerin etkili olması için 'npm run dev' komutunu tekrar çalıştırın.",
);
