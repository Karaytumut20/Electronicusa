import React from 'react';
import { getAdsServer, getCategoryTreeServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import SmartCategoryGrid from '@/components/SmartCategoryGrid';
import { SearchX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SearchPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const categories = await getCategoryTreeServer(); // Dinamik kategorileri çek

  const manualSearch = searchParams.showResults === 'true';
  const textSearch = !!searchParams.q;
  const isDeepLevelCar = !!searchParams.model;
  const shouldFetchAds = manualSearch || textSearch || isDeepLevelCar;

  let ads = [];
  let totalPages = 0;
  let count = 0;

  if (shouldFetchAds) {
    const res = await getAdsServer(searchParams);
    ads = res.data;
    totalPages = res.totalPages;
    count = res.count;
  }

  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'list';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar: Kategorileri prop olarak alıyor */}
        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar categories={categories} />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 min-w-0">

           {!shouldFetchAds && (
             <SmartCategoryGrid searchParams={searchParams} categories={categories} />
           )}

           {shouldFetchAds ? (
             <>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center animate-in fade-in">
                  <div>
                     <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        Search Results
                        {searchParams.brand && <span className="text-indigo-600">/ {searchParams.brand}</span>}
                        {searchParams.q && <span className="text-indigo-600">/ "{searchParams.q}"</span>}
                     </h1>
                     <p className="text-sm text-slate-500">{count} listings found</p>
                  </div>
                  <ViewToggle currentView={viewMode} />
               </div>

               {(!ads || ads.length === 0) ? (
                 <div className="bg-white p-16 rounded-xl border border-gray-100 text-center">
                   <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchX size={40} className="text-slate-400"/>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">No Results Found</h3>
                   <p className="text-slate-500 max-w-md mx-auto">We couldn't find any listings matching your criteria. Try clearing filters or searching for something else.</p>
                   <Link href="/search" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                        <ArrowLeft size={16}/> Clear All Filters
                   </Link>
                 </div>
               ) : (
                 <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                   {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
                 </div>
               )}

               <div className="mt-10"><Pagination totalPages={totalPages} currentPage={Number(searchParams.page) || 1} /></div>
             </>
           ) : (
             <div className="text-center text-gray-400 text-sm mt-4">
                {/* Placeholder */}
             </div>
           )}
        </main>
      </div>
    </div>
  );
}