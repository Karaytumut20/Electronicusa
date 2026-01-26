'use client';
import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
            <p className="text-gray-500 mb-8 text-sm">
                We apologize for the inconvenience. A critical error occurred.
                {process.env.NODE_ENV === 'development' && <br/> && <span className="text-red-400 text-xs mt-2 block bg-red-50 p-2 rounded">{error.message}</span>}
            </p>
            <div className="flex flex-col gap-3">
                <button onClick={() => reset()} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <RefreshCcw size={18}/> Try Again
                </button>
                <a href="/" className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Home size={18}/> Go Home
                </a>
            </div>
        </div>
      </body>
    </html>
  );
}