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
              href={`/search?category=${cat.slug}`}
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