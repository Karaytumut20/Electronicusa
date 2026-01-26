'use client';
import { useEffect } from 'react';
import { WifiOff, RefreshCcw, Home, Database } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  const isConnectionError = error.message.includes('fetch failed') || error.message.includes('NetworkError');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center font-sans">
      <div className="bg-red-50 p-6 rounded-full mb-6 border border-red-100 shadow-sm animate-in zoom-in duration-300">
        {isConnectionError ? <WifiOff className="w-12 h-12 text-red-500" /> : <Database className="w-12 h-12 text-red-500" />}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{isConnectionError ? 'Connection Failed' : 'Something Went Wrong'}</h2>
      <p className="text-gray-600 mb-8 max-w-md text-sm leading-relaxed">
        {isConnectionError ? "We can't connect to the server. Please check your internet connection." : "An unexpected error occurred. Our team has been notified."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button onClick={() => reset()} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
          <RefreshCcw size={18} /> Retry
        </button>
        <Link href="/" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
          <Home size={18} /> Home
        </Link>
      </div>
    </div>
  );
}