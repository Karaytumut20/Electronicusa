"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, RotateCcw, ChevronDown, ChevronUp, Search, Cpu, Monitor } from 'lucide-react';
import { computerBrands, phoneBrands } from '@/lib/hierarchyData';
import { processors, ramOptions, screenSizes, gpuCapacities, ssdCapacities } from '@/lib/computerData';

export default function FilterSidebar({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<any>({});
  const [expanded, setExpanded] = useState<any>({
      brand: true, specs: true, price: true, screen: true
  });

  useEffect(() => {
    const newFilters: any = {};
    searchParams.forEach((value, key) => { newFilters[key] = value; });
    setFilters(newFilters);
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
      setFilters((prev: any) => {
          const next = { ...prev, [key]: value };
          if (!value) delete next[key];
          return next;
      });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value as string);
    });
    params.set('showResults', 'true');
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/search');
  };

  const toggle = (id: string) => setExpanded((prev: any) => ({ ...prev, [id]: !prev[id] }));

  // Brands logic
  const cat = filters.category || '';
  let activeBrands = computerBrands;
  if (cat.includes('phone') || cat.includes('mobile') || cat.includes('apple')) activeBrands = phoneBrands;

  const FilterSection = ({ id, title, icon: Icon, children }: any) => (
      <div className="border-b border-gray-100 py-4 last:border-0">
          <button onClick={() => toggle(id)} className="flex items-center justify-between w-full text-left mb-2 group">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                  {Icon && <Icon size={14} className="text-slate-400 group-hover:text-indigo-500"/>} {title}
              </span>
              {expanded[id] ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
          </button>
          {expanded[id] && <div className="space-y-3 pt-2 animate-in slide-in-from-top-1">{children}</div>}
      </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-24">

      <div className="mb-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
        <h3 className="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
            <Filter size={16} /> Filters
        </h3>
        <button onClick={applyFilters} className="w-full bg-indigo-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2">
            <Search size={16} /> Show Results
        </button>
        <button onClick={clearFilters} className="w-full text-center text-xs text-slate-500 hover:text-red-600 mt-2 flex items-center justify-center gap-1 font-medium transition-colors">
            <RotateCcw size={12}/> Clear All
        </button>
      </div>

      <FilterSection id="price" title="Price Range">
          <div className="flex gap-2 items-center">
              <input type="number" placeholder="Min $" value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              <span className="text-gray-400">-</span>
              <input type="number" placeholder="Max $" value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
      </FilterSection>

      <FilterSection id="brand" title="Brand">
          <select value={filters.brand || ''} onChange={(e) => updateFilter('brand', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-2 focus:border-indigo-500 outline-none bg-white">
              <option value="">All Brands</option>
              {activeBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
      </FilterSection>

      <FilterSection id="specs" title="Technical Specs" icon={Cpu}>
          <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 block">PROCESSOR</label>
              <select value={filters.processor || ''} onChange={(e) => updateFilter('processor', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-2 focus:border-indigo-500 outline-none bg-white">
                  <option value="">Select Processor</option>
                  {processors.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
          </div>
          <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 block">RAM</label>
              <select value={filters.ram || ''} onChange={(e) => updateFilter('ram', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-2 focus:border-indigo-500 outline-none bg-white">
                  <option value="">Select RAM</option>
                  {ramOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
          </div>
          <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 block">STORAGE (SSD)</label>
              <select value={filters.ssd_capacity || ''} onChange={(e) => updateFilter('ssd_capacity', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-2 focus:border-indigo-500 outline-none bg-white">
                  <option value="">Select Storage</option>
                  {ssdCapacities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
          </div>
      </FilterSection>

      <FilterSection id="screen" title="Screen & Graphics" icon={Monitor}>
          <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 block">SCREEN SIZE</label>
              <select value={filters.screen_size || ''} onChange={(e) => updateFilter('screen_size', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-2 focus:border-indigo-500 outline-none bg-white">
                  <option value="">Select Screen</option>
                  {screenSizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
          </div>
          <div className="mt-3">
              <label className="text-[10px] font-bold text-slate-500 mb-1 block">GPU MEMORY</label>
              <select value={filters.gpu_capacity || ''} onChange={(e) => updateFilter('gpu_capacity', e.target.value)} className="w-full border border-gray-300 rounded-lg text-xs h-9 px-2 focus:border-indigo-500 outline-none bg-white">
                  <option value="">Select GPU</option>
                  {gpuCapacities.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
          </div>
      </FilterSection>

    </div>
  );
}