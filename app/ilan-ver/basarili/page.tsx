import React from 'react';
import Link from 'next/link';
import { CheckCircle, Home, Eye } from 'lucide-react';

export default function PostAdSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
        <CheckCircle size={56} />
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-3">Congratulations!</h1>
      <h2 className="text-xl font-medium text-gray-600 mb-8">Your ad has been created successfully.</h2>

      <div className="flex gap-4">
        <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">
          <Home size={20} /> Home
        </Link>
        <Link href="/bana-ozel/ilanlarim" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
          <Eye size={20} /> Manage Ads
        </Link>
      </div>
    </div>
  );
}