"use client";
import React, { useEffect, useState } from 'react';
import { getAdminAds, approveAdAdmin, rejectAdAdmin, deleteAdAdmin } from '@/lib/adminActions';
import { Eye, Check, X, Filter, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function AdminListingsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();

  const loadAds = async () => {
    setLoading(true);
    const data = await getAdminAds();
    setAds(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleAction = async (action: string, id: number) => {
      if(!confirm(`Are you sure you want to ${action} this ad?`)) return;

      setProcessing(id);
      let res;

      if (action === 'approve') res = await approveAdAdmin(id);
      else if (action === 'reject') res = await rejectAdAdmin(id);
      else if (action === 'delete') res = await deleteAdAdmin(id);

      if (res?.success) {
          addToast(`Ad ${action}d successfully`, 'success');
          // Optimistic update
          if (action === 'delete') {
              setAds(prev => prev.filter(ad => ad.id !== id));
          } else {
              setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: action === 'approve' ? 'yayinda' : 'reddedildi' } : ad));
          }
      } else {
          addToast(res?.error || 'Action failed', 'error');
      }
      setProcessing(null);
  };

  const filteredAds = ads.filter(ad => filter === 'all' || ad.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Ad Management</h1>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
            {['all', 'onay_bekliyor', 'yayinda', 'reddedildi'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-md text-xs font-bold capitalize transition-colors ${filter === status ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {status === 'onay_bekliyor' ? 'Pending' : (status === 'yayinda' ? 'Active' : (status === 'reddedildi' ? 'Rejected' : 'All'))}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Title / Owner</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={5} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600"/></td></tr>
                    ) : filteredAds.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center text-gray-500">No ads found.</td></tr>
                    ) : (
                        filteredAds.map(ad => (
                        <tr key={ad.id} className="hover:bg-gray-50 group transition-colors">
                            <td className="px-6 py-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                    {ad.image ? <img src={ad.image} className="w-full h-full object-cover" alt="Ad"/> : <div className="w-full h-full flex items-center justify-center text-[10px]">No Img</div>}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="max-w-[220px]">
                                    <Link href={`/ilan/${ad.id}`} target="_blank" className="font-bold text-slate-900 truncate block hover:text-indigo-600 flex items-center gap-1">
                                        {ad.title} <ExternalLink size={10} className="opacity-50"/>
                                    </Link>
                                    <p className="text-xs text-gray-500">{ad.profiles?.full_name || ad.profiles?.email || 'Unknown User'}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-indigo-700">
                                {formatPrice(ad.price, ad.currency)}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    ad.status === 'yayinda' ? 'bg-green-100 text-green-700 border border-green-200' :
                                    (ad.status === 'onay_bekliyor' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200')
                                }`}>
                                    {ad.status === 'yayinda' ? 'Active' : (ad.status === 'onay_bekliyor' ? 'Pending' : 'Rejected')}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {processing === ad.id ? (
                                        <Loader2 size={18} className="animate-spin text-gray-400"/>
                                    ) : (
                                        <>
                                            {ad.status !== 'yayinda' && (
                                                <button onClick={() => handleAction('approve', ad.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Approve">
                                                    <Check size={16}/>
                                                </button>
                                            )}
                                            {ad.status !== 'reddedildi' && (
                                                <button onClick={() => handleAction('reject', ad.id)} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors" title="Reject">
                                                    <X size={16}/>
                                                </button>
                                            )}
                                            <button onClick={() => handleAction('delete', ad.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete Permanently">
                                                <Trash2 size={16}/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}