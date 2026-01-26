"use client";
import React, { useEffect, useState } from 'react';
import { getAdminAds } from '@/lib/adminActions';
import { Eye, Check, X, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminListingsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAdminAds().then((data) => {
        if(data) setAds(data);
        setLoading(false);
    });
  }, []);

  const filteredAds = ads.filter(ad => filter === 'all' || ad.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Ad Management</h1>
        <div className="flex gap-2">
            {['all', 'onay_bekliyor', 'yayinda', 'reddedildi'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${filter === status ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    {status === 'onay_bekliyor' ? 'Pending' : (status === 'yayinda' ? 'Active' : (status === 'reddedildi' ? 'Rejected' : 'All'))}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <tr>
                    <th className="px-6 py-4">Listing</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr> : filteredAds.map(ad => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                    {ad.image && <img src={ad.image} className="w-full h-full object-cover"/>}
                                </div>
                                <div className="max-w-[200px]">
                                    <p className="font-bold text-slate-900 truncate">{ad.title}</p>
                                    <p className="text-xs text-gray-500">ID: {ad.id}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-700">
                            {formatPrice(ad.price, ad.currency)}
                        </td>
                        <td className="px-6 py-4 text-gray-600 capitalize">
                            {ad.category}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                ad.status === 'yayinda' ? 'bg-green-100 text-green-700' :
                                (ad.status === 'onay_bekliyor' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')
                            }`}>
                                {ad.status === 'yayinda' ? 'Active' : (ad.status === 'onay_bekliyor' ? 'Pending' : 'Rejected')}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="View"><Eye size={16}/></button>
                                <button className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve"><Check size={16}/></button>
                                <button className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject"><X size={16}/></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}