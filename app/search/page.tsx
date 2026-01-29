import React from 'react';
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
                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                                      <Link href={`/ilan/${ad.id}`} className="absolute inset-0" />
                                   </div>
                                 </td>

                                 {/* Başlık, Konum ve Tarih */}
                                 <td className="px-4 py-2">
                                   <Link href={`/ilan/${ad.id}`} className="font-bold text-slate-800 hover:text-indigo-600 block text-sm truncate max-w-[220px] mb-1" title={ad.title}>
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