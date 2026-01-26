"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { categoryTree, computerBrands } from '@/lib/hierarchyData';

function findCategoryBySlug(cats: any[], slug: string): any {
  for (const cat of cats) {
    if (cat.slug === slug) return cat;
    if (cat.subs) {
      const found = findCategoryBySlug(cat.subs, slug);
      if (found) return found;
    }
  }
  return null;
}

export default function SmartCategoryGrid({ searchParams }: { searchParams: any }) {
  const currentSlug = searchParams.category;
  const currentBrand = searchParams.brand;

  const categoryNode = currentSlug ? findCategoryBySlug(categoryTree, currentSlug) : null;

  if (!categoryNode) {
    return <GridDisplay items={categoryTree} type="category" parentParams={searchParams} title="Categories" />;
  }

  if (categoryNode.subs && categoryNode.subs.length > 0) {
    return (
        <GridDisplay
            items={categoryNode.subs}
            type="category"
            parentParams={searchParams}
            title={`${categoryNode.title} Subcategories`}
            listAllLabel={`List All ${categoryNode.title} Ads`}
        />
    );
  }

  if (categoryNode.isDynamic) {
      if (!currentBrand) {
          const brands = computerBrands.sort().map(b => ({ id: b, title: b, slug: b.toLowerCase() }));
          return (
            <GridDisplay
                items={brands}
                type="brand"
                parentParams={searchParams}
                title="Select Brand"
                listAllLabel="List All Ads"
            />
          );
      }
  }

  return null;
}

function GridDisplay({ items, type, parentParams, title, listAllLabel }: any) {
  const listAllParams = new URLSearchParams(parentParams);
  listAllParams.set('showResults', 'true');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutGrid className="text-indigo-600" size={24} />
          {title}
        </h2>

        {listAllLabel && (
            <Link
                href={`/search?${listAllParams.toString()}`}
                className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
                <List size={16} className="text-slate-300 group-hover:text-white" />
                {listAllLabel}
            </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item: any) => {
          const params = new URLSearchParams(parentParams);
          if (type === 'category') params.set('category', item.slug);
          else if (type === 'brand') params.set('brand', item.title);

          return (
            <Link
              key={item.id}
              href={`/search?${params.toString()}`}
              className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transition-all group text-center h-28 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={16} className="text-indigo-600" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:text-indigo-600 transition-colors text-gray-500 font-bold text-lg shadow-sm">
                {item.title.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-700 line-clamp-2 leading-tight">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}