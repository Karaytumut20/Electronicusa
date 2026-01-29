"use client";
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
          Filtrele & Sırala
        </button>
      </div>

      {/* Full Screen Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Filter size={20} className="text-indigo-600"/> Filtreler
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
              Sonuçları Göster
            </button>
          </div>
        </div>
      )}
    </>
  );
}