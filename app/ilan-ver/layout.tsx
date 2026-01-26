"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Check, Layers, FileText } from 'lucide-react';

const steps = [
  { id: 'category', label: 'Category', path: '/ilan-ver', icon: Layers },
  { id: 'details', label: 'Details', path: '/ilan-ver/detay', icon: FileText },
];

export default function PostAdLayout({ children }) {
  const pathname = usePathname();
  const activeIndex = steps.findIndex(s => pathname === s.path || pathname.startsWith(s.path + '/'));
  const safeActiveIndex = activeIndex === -1 && pathname.includes('basarili') ? 2 : activeIndex;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= safeActiveIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {idx + 1}
                    </div>
                    <span className="font-bold text-sm text-gray-700 hidden md:block">{step.label}</span>
                </div>
            ))}
        </div>
      </div>
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}