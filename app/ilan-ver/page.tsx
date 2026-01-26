"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LegacyPostAdRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/post-ad'); }, [router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-indigo-600 mb-2" size={32}/>
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}