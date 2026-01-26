import React from 'react';
import Link from 'next/link';
import { Home, Search, PlusCircle, User, Bell } from 'lucide-react';

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-gray-200 z-50 flex items-center justify-around shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
      <Link href="/" className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-900 w-full h-full">
        <Home size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1">Home</span>
      </Link>

      <Link href="/search" className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-900 w-full h-full">
        <Search size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1">Search</span>
      </Link>

      {/* UPDATED LINK */}
      <Link href="/post-ad" className="flex flex-col items-center justify-center text-blue-600 w-full h-full -mt-4">
        <div className="bg-[#f6f7f9] p-1 rounded-full">
           <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
             <PlusCircle size={24} />
           </div>
        </div>
        <span className="text-[10px] font-bold mt-1 text-blue-900">Post Ad</span>
      </Link>

      <Link href="/dashboard" className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-900 w-full h-full">
        <User size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1">Account</span>
      </Link>

      <Link href="#" className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-900 w-full h-full">
        <Bell size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1">Alerts</span>
      </Link>
    </div>
  );
}