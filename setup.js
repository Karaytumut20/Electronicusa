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
    "\n🚀 UPDATING SEARCH PAGE LOGIC FOR AUTO-RESULTS & GRID VIEW...\n" +
    colors.reset,
);

const searchPageContent = `import React from 'react';
import { getAdsServer, getCategoryTreeServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import SmartCategoryGrid from '@/components/SmartCategoryGrid';
import { SearchX, ArrowLeft, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

// Kategori ağacında gezinerek seçilen kategoriyi bulan yardımcı fonksiyon
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
  const categories = await getCategoryTreeServer(); // Dinamik kategorileri çek

  // --- AKILLI LİSTELEME MANTIĞI ---
  const currentCategorySlug = searchParams.category;

  // Seçilen kategoriyi bul
  const selectedCategory = currentCategorySlug ? findCategory(categories, currentCategorySlug) : null;

  // Eğer seçilen kategori "yaprak" ise (alt kategorisi yoksa), ürünleri getir.
  // Örn: "Airpods" seçilince altı olmadığı için direkt ürünler gelsin.
  const isLeafCategory = selectedCategory && (!selectedCategory.subs || selectedCategory.subs.length === 0);

  // Manuel arama, metin arama, marka seçimi veya yaprak kategori seçimi varsa ürünleri getir
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

  // Varsayılan görünüm 'grid' olsun (Anasayfa yapısı için)
  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'grid';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar: Masaüstünde solda filtreler */}
        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar categories={categories} />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 min-w-0">

           {/* Eğer ürün listeleme modunda değilsek (yani hala kategori seçiyorsak) Grid'i göster */}
           {!shouldFetchAds && (
             <SmartCategoryGrid searchParams={searchParams} categories={categories} />
           )}

           {/* Ürün Listeleme Modu */}
           {shouldFetchAds ? (
             <>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center animate-in fade-in">
                  <div>
                     <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {selectedCategory ? selectedCategory.title : 'Arama Sonuçları'}
                        {searchParams.brand && <span className="text-indigo-600">/ {searchParams.brand}</span>}
                        {searchParams.q && <span className="text-indigo-600">/ "{searchParams.q}"</span>}
                     </h1>
                     <p className="text-xs text-slate-500 font-medium mt-1">{count} ilan bulundu</p>
                  </div>
                  <ViewToggle currentView={viewMode} />
               </div>

               {(!ads || ads.length === 0) ? (
                 <div className="bg-white p-16 rounded-xl border border-gray-100 text-center">
                   <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchX size={40} className="text-slate-400"/>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Sonuç Bulunamadı</h3>
                   <p className="text-slate-500 max-w-md mx-auto text-sm">Aradığınız kriterlere uygun ilan bulunamadı. Filtreleri temizleyerek veya farklı bir kategori seçerek tekrar deneyin.</p>
                   <Link href="/search" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline bg-indigo-50 px-6 py-3 rounded-lg transition-colors">
                        <ArrowLeft size={16}/> Tüm Filtreleri Temizle
                   </Link>
                 </div>
               ) : (
                 // --- BURASI ANASAYFA YAPISINI (2'li GRID) SAĞLAYAN KISIM ---
                 <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4' : 'space-y-4'}>
                   {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
                 </div>
               )}

               <div className="mt-10"><Pagination totalPages={totalPages} currentPage={Number(searchParams.page) || 1} /></div>
             </>
           ) : (
             // Kategori seçimi henüz bitmediyse veya root'taysak ve kategori seçimi grid'i de yoksa (nadir durum)
             <div className="text-center text-gray-400 text-sm mt-4">
                {/* Boşluk */}
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
`;

try {
  const filePath = path.join(process.cwd(), "app/search/page.tsx");
  fs.writeFileSync(filePath, searchPageContent.trim());
  console.log(
    colors.green + "✔ app/search/page.tsx updated successfully." + colors.reset,
  );
  console.log(
    colors.green + "  - Auto-fetch for leaf categories enabled." + colors.reset,
  );
  console.log(
    colors.green + "  - Auto-fetch for brands enabled." + colors.reset,
  );
  console.log(
    colors.green + "  - Mobile view set to 2-column grid." + colors.reset,
  );
} catch (err) {
  console.error(colors.bold + "✘ Error: " + err.message + colors.reset);
}
