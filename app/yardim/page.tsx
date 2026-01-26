"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, CircleHelp } from 'lucide-react';
import { getHelpContentServer } from '@/lib/actions';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [data, setData] = useState<{ categories: any[], faqs: any[] }>({ categories: [], faqs: [] });

  useEffect(() => {
    getHelpContentServer().then(setData);
  }, []);

  return (
    <div className="bg-[#f6f7f9] min-h-screen pb-10">
      <div className="bg-[#2d405a] text-white py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">How can we help?</h1>
        <div className="max-w-[600px] mx-auto relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-sm text-black focus:outline-none shadow-lg"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>
      <div className="container max-w-[1000px] mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">FAQ</h2>
          {data.faqs.map((item: any) => (
            <div key={item.id} className="border-b border-gray-100 last:border-0">
               <button onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 text-left">
                 <span className="font-bold text-sm text-gray-700">{item.question}</span>
                 {openFaq === item.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
               </button>
               {openFaq === item.id && <div className="p-4 bg-gray-50 text-sm text-gray-600">{item.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}