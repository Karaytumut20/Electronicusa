import React from 'react';
import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/HomeFeed";
import { getInfiniteAdsAction, getCategoryTreeServer } from "@/lib/actions";
import Link from 'next/link';
import { LayoutGrid, ChevronRight } from 'lucide-react';

export const revalidate = 0; // Her zaman güncel veri

export default async function Home() {
  const { data: initialAds } = await getInfiniteAdsAction(1, 20);
  const categories = await getCategoryTreeServer(); // Veritabanından gelen hiyerarşi

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl font-sans">

      {/* --- MOBILE CATEGORY BAR (Visible only on mobile/tablet) --- */}
      <div className="lg:hidden mb-8">
         <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <LayoutGrid size={18} className="text-indigo-600"/> Categories
            </h3>
            <Link href="/search" className="text-xs text-indigo-600 font-bold flex items-center bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors">
              View All <ChevronRight size={12}/>
            </Link>
         </div>

         <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 min-w-[80px] snap-start group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-indigo-500 group-hover:shadow-md transition-all relative overflow-hidden">
                   <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="text-2xl font-black text-slate-700 group-hover:text-indigo-600 relative z-10">
                     {cat.title.charAt(0)}
                   </span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 text-center leading-tight max-w-[80px] truncate group-hover:text-indigo-700 transition-colors">
                  {cat.title}
                </span>
              </Link>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-24">
            <Sidebar categories={categories} />
          </div>
        </aside>

        <main className="lg:col-span-9 xl:col-span-10 min-w-0">
          <HomeFeed initialAds={initialAds} />
        </main>
      </div>
    </div>
  );
}