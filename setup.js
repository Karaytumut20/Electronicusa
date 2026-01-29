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
    "\n🚀 TRANSLATING ALL REMAINING TURKISH UI ELEMENTS TO ENGLISH...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// 1. UPDATE app/search/page.tsx (English Text & Date Format)
// ---------------------------------------------------------
const searchPageContent = `import React from 'react';
import { getAdsServer, getCategoryTreeServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import SmartCategoryGrid from '@/components/SmartCategoryGrid';
import MobileFilterBar from '@/components/MobileFilterBar';
import { SearchX, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

// Helper to find category in tree
function findCategory(categories: any[], slug: string): any {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    if (cat.subs) {
      const found = findCategory(cat.subs, slug);
      if (found) return found;
    }
  }
  return null;
}

export default async function SearchPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const categories = await getCategoryTreeServer();

  // --- SMART LISTING LOGIC ---
  const currentCategorySlug = searchParams.category;
  const selectedCategory = currentCategorySlug ? findCategory(categories, currentCategorySlug) : null;
  const isLeafCategory = selectedCategory && (!selectedCategory.subs || selectedCategory.subs.length === 0);

  const manualSearch = searchParams.showResults === 'true';
  const textSearch = !!searchParams.q;
  const isBrandSelected = !!searchParams.brand;
  const isModelSelected = !!searchParams.model;

  const shouldFetchAds = manualSearch || textSearch || isBrandSelected || isModelSelected || isLeafCategory;

  let ads = [];
  let totalPages = 0;
  let count = 0;

  if (shouldFetchAds) {
    const res = await getAdsServer(searchParams);
    ads = res.data;
    totalPages = res.totalPages;
    count = res.count;
  }

  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'grid';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      <MobileFilterBar categories={categories} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar categories={categories} />
        </aside>

        <main className="lg:col-span-9 min-w-0">

           {!shouldFetchAds && (
             <SmartCategoryGrid searchParams={searchParams} categories={categories} />
           )}

           {shouldFetchAds ? (
             <>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center animate-in fade-in">
                  <div>
                     <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {selectedCategory ? selectedCategory.title : 'Search Results'}
                        {searchParams.brand && <span className="text-indigo-600">/ {searchParams.brand}</span>}
                        {searchParams.q && <span className="text-indigo-600">/ "{searchParams.q}"</span>}
                     </h1>
                     <p className="text-xs text-slate-500 font-medium mt-1">{count} listings found</p>
                  </div>
                  <ViewToggle currentView={viewMode} />
               </div>

               {(!ads || ads.length === 0) ? (
                 <div className="bg-white p-16 rounded-xl border border-gray-100 text-center">
                   <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchX size={40} className="text-slate-400"/>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">No Results Found</h3>
                   <p className="text-slate-500 max-w-md mx-auto text-sm">We couldn't find any listings matching your criteria.</p>
                   <Link href="/search" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline bg-indigo-50 px-6 py-3 rounded-lg transition-colors">
                        <ArrowLeft size={16}/> Clear Filters
                   </Link>
                 </div>
               ) : (
                 <>
                   {/* --- GRID VIEW (Default) --- */}
                   {viewMode === 'grid' && (
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                       {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode="grid" />)}
                     </div>
                   )}

                   {/* --- LIST VIEW --- */}
                   {viewMode === 'list' && (
                     <div className="space-y-4">
                       {ads.map((ad: any) => (
                           <div key={ad.id} className="h-32">
                               <AdCard ad={ad} viewMode="list" />
                           </div>
                       ))}
                     </div>
                   )}

                   {/* --- TABLE VIEW (OPTIMIZED) --- */}
                   {viewMode === 'table' && (
                     <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                       <div className="overflow-x-auto">
                         <table className="w-full text-left text-sm whitespace-nowrap">
                           <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold text-xs uppercase">
                             <tr>
                               <th className="px-4 py-3 w-16">Image</th>
                               <th className="px-4 py-3">Details</th>
                               <th className="px-4 py-3 text-right">Price</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                             {ads.map((ad: any) => (
                               <tr key={ad.id} className="hover:bg-slate-50 transition-colors group relative">
                                 {/* Resim */}
                                 <td className="px-4 py-2">
                                   <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden border border-gray-200 relative">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={ad.image || 'https://via.placeholder.com/100'}
                                        alt={ad.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <Link href={\`/ilan/\${ad.id}\`} className="absolute inset-0" />
                                   </div>
                                 </td>

                                 {/* Başlık, Konum ve Tarih */}
                                 <td className="px-4 py-2">
                                   <Link href={\`/ilan/\${ad.id}\`} className="font-bold text-slate-800 hover:text-indigo-600 block text-sm truncate max-w-[220px] mb-1" title={ad.title}>
                                     {ad.title}
                                   </Link>
                                   <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                      <span className="flex items-center gap-1">
                                        <MapPin size={12} className="text-slate-400"/> {ad.city} / {ad.district}
                                      </span>
                                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                      <span>
                                        {new Date(ad.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                      </span>
                                   </div>
                                 </td>

                                 {/* Fiyat */}
                                 <td className="px-4 py-2 font-bold text-indigo-700 text-sm text-right">
                                   {formatPrice(ad.price, ad.currency)}
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   )}
                 </>
               )}

               <div className="mt-10"><Pagination totalPages={totalPages} currentPage={Number(searchParams.page) || 1} /></div>
             </>
           ) : (
             <div className="text-center text-gray-400 text-sm mt-4"></div>
           )}
        </main>
      </div>
    </div>
  );
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "app/search/page.tsx"),
    searchPageContent.trim(),
  );
  console.log(
    colors.green +
      "✔ app/search/page.tsx translated to English." +
      colors.reset,
  );
} catch (e) {
  console.error("Error updating search page:", e.message);
}

// ---------------------------------------------------------
// 2. UPDATE components/MobileFilterBar.tsx (English Text)
// ---------------------------------------------------------
const mobileFilterContent = `"use client";
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import FilterSidebar from '@/components/FilterSidebar';

export default function MobileFilterBar({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-white border border-gray-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Filter size={18} className="text-indigo-600" />
          Filter & Sort
        </button>
      </div>

      {/* Full Screen Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Filter size={20} className="text-indigo-600"/> Filters
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
             {/* Re-using the existing FilterSidebar but stripping sticky behavior via container */}
             <div className="[&>div]:!static [&>div]:!shadow-none [&>div]:!border-none [&>div]:!p-0 [&>div]:bg-transparent">
                <FilterSidebar categories={categories} />
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "components/MobileFilterBar.tsx"),
    mobileFilterContent.trim(),
  );
  console.log(
    colors.green +
      "✔ components/MobileFilterBar.tsx translated to English." +
      colors.reset,
  );
} catch (e) {
  console.error("Error updating MobileFilterBar:", e.message);
}

// ---------------------------------------------------------
// 3. UPDATE components/AdCard.tsx (Ensure English Badges)
// ---------------------------------------------------------
const adCardContent = `"use client";
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
  const imageUrl = ad.image || 'https://via.placeholder.com/600x400?text=No+Image';

  // Date formatting (English - US)
  const dateStr = new Date(ad.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link href={\`/ilan/\${ad.id}\`} className="group block h-full">
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden">

        {/* IMAGE */}
        <div className="relative aspect-[1/1] xs:aspect-[4/3] overflow-hidden bg-slate-50">
          <Image
            src={imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* BADGES (ENGLISH) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {ad.is_urgent && (
              <span className="bg-rose-500 text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
                <Zap size={10} fill="currentColor"/> URGENT
              </span>
            )}
            {ad.is_vitrin && (
              <span className="bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg">
                FEATURED
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

        {/* CONTENT */}
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
                {dateStr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "components/AdCard.tsx"),
    adCardContent.trim(),
  );
  console.log(
    colors.green +
      "✔ components/AdCard.tsx verified (English badges)." +
      colors.reset,
  );
} catch (e) {
  console.error("Error updating AdCard.tsx:", e.message);
}
