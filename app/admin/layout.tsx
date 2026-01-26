import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans text-slate-800">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}