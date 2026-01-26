"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Layers, FileText } from 'lucide-react';

const steps = [
  { id: 'category', label: 'Category', path: '/post-ad', icon: Layers },
  { id: 'details', label: 'Details', path: '/post-ad/details', icon: FileText },
];

export default function PostAdLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Simple check to activate steps based on URL
  const activeIndex = steps.findIndex(s => pathname === s.path) !== -1
    ? steps.findIndex(s => pathname === s.path)
    : (pathname.includes('/details') ? 1 : (pathname.includes('/success') ? 2 : 0));

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= activeIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {idx + 1}
                    </div>
                    <span className={`font-bold text-sm hidden md:block ${idx <= activeIndex ? 'text-indigo-900' : 'text-gray-500'}`}>{step.label}</span>
                    {idx < steps.length - 1 && <div className="w-12 h-[1px] bg-gray-200 mx-2 hidden md:block"></div>}
                </div>
            ))}
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeIndex >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <span className={`font-bold text-sm hidden md:block ${activeIndex >= 2 ? 'text-green-700' : 'text-gray-500'}`}>Finish</span>
            </div>
        </div>
      </div>
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}