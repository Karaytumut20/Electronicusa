"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';

export default function AdCard({ ad, viewMode = 'grid' }: { ad: any, viewMode?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(ad.id);

  const priceDisplay = formatPrice(ad.price, ad.currency);
  const imageUrl = ad.image || 'https://via.placeholder.com/600x400?text=No+Image';

  // Format Date to English
  const dateStr = new Date(ad.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link href={`/ilan/${ad.id}`} className="group block h-full">
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden">

        {/* IMAGE */}
        <div className="relative aspect-[1/1] xs:aspect-[4/3] overflow-hidden bg-slate-50">
          <Image
            src={imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* BADGES (ENGLISH) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {ad.is_urgent && (
              <span className="bg-rose-500 text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
                <Zap size={10} fill="currentColor"/> URGENT
              </span>
            )}
            {ad.is_vitrin && (
              <span className="bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg">
                FEATURED
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(ad.id); }}
            className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Star size={16} className={liked ? "fill-rose-500 text-rose-500" : ""} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-2.5 md:p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-slate-800 text-[11px] md:text-sm leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {ad.title}
          </h3>

          <div className="mt-auto">
            <div className="text-indigo-700 font-black text-[13px] md:text-lg tracking-tight">
              {priceDisplay}
            </div>
            <div className="flex justify-between items-center mt-1 border-t border-slate-50 pt-1.5 text-[9px] md:text-[10px] text-slate-400">
              <span className="flex items-center gap-0.5 truncate max-w-[70%] italic">
                <MapPin size={10} /> {ad.city}
              </span>
              <span className="font-medium whitespace-nowrap">
                {dateStr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}