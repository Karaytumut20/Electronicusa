"use client";
import React, { useEffect, useState } from 'react';
import { Users, FileText, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { getAdminStats } from '@/lib/adminActions';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, ads: 0, revenue: 0, active: 0 });

  useEffect(() => {
    getAdminStats().then((data) => {
        if(data) setStats(data);
    });
  }, []);

  const Card = ({ title, value, icon: Icon, color, sub }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white shadow-sm`}>
          <Icon size={24} />
        </div>
      </div>
      {sub && <p className="text-xs text-emerald-600 font-bold flex items-center gap-1"><TrendingUp size={12}/> {sub}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <span className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Users" value={stats.users} icon={Users} color="bg-blue-600" sub="+12% this month" />
        <Card title="Total Listings" value={stats.ads} icon={FileText} color="bg-indigo-600" sub="+5% this week" />
        <Card title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" sub="Verified Sales" />
        <Card title="Active Ads" value={stats.active} icon={Activity} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
            <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="text-sm text-slate-500 text-center py-10">Chart data loading...</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
            <h3 className="font-bold text-slate-800 mb-4">Pending Approvals</h3>
            <div className="text-sm text-slate-500 text-center py-10">No pending items.</div>
        </div>
      </div>
    </div>
  );
}