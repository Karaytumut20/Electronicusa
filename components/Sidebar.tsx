"use client";
import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import RecentAdsWidget from "@/components/RecentAdsWidget";

export default function Sidebar({ categories }: { categories: any[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Categories</h3>
        </div>
        <ul className="divide-y divide-slate-50">
          {categories.map((cat) => (
            <li key={cat.id} className="group">
              <Link href={`/search?category=${cat.slug}`} className="flex items-center justify-between px-4 py-3.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <span className="font-medium">{cat.title}</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <RecentAdsWidget />
    </div>
  );
}