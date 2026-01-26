import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export default function MobileAdActionBar({ price, phone }: { price: string, phone?: string }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-[90] md:hidden flex items-center p-3 gap-3 pb-[20px]">
      <div className="flex-1">
        <p className="text-[10px] text-gray-500">Price</p>
        <p className="text-lg font-bold text-indigo-900 leading-none">{price}</p>
      </div>

      <div className="flex gap-2">
        <button className="bg-indigo-100 text-indigo-700 p-3 rounded-md">
          <MessageSquare size={20} />
        </button>
        {phone ? (
          <a href={`tel:${phone}`} className="bg-indigo-700 text-white px-6 py-2.5 rounded-md font-bold flex items-center gap-2 text-sm shadow-md hover:bg-indigo-800">
             <Phone size={18} /> Call
          </a>
        ) : (
           <button disabled className="bg-gray-300 text-gray-500 px-6 py-2.5 rounded-md font-bold text-sm">No Phone</button>
        )}
      </div>
    </div>
  );
}