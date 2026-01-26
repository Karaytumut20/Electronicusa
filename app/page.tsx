import React from 'react';
import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/HomeFeed";
import { getInfiniteAdsAction, getCategoryTreeServer } from "@/lib/actions";
import Link from 'next/link';
import { LayoutGrid, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default async function Home() {
  const { data: initialAds } = await getInfiniteAdsAction(1, 20);
  const categories = await getCategoryTreeServer();

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl font-sans">

      {/* MOBILE CATEGORY GRID */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center justify-between mb-5 px-1">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
            Categories
          </h2>
          <Link href="/search" className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="flex items-center gap-3 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-sm active:bg-indigo-50 active:border-indigo-200 transition-all group"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                {cat.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-700 truncate leading-tight">{cat.title}</p>
                <p className="text-[10px] text-slate-400 font-medium">Browse</p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
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