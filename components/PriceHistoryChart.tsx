"use client";
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function PriceHistoryChart({ currentPrice }: { currentPrice: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#333] text-md">Price History</h3>
        <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">
          <TrendingUp size={14} /> Stable
        </div>
      </div>
      <div className="h-[100px] flex items-center justify-center text-gray-400 text-xs">
        Chart data loading...
      </div>
    </div>
  );
}