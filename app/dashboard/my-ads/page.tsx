"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Loader2, Search, Plus, Eye, Filter, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserAdsClient } from '@/lib/services';
import DeleteAdButton from '@/components/DeleteAdButton';
import { formatPrice } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

export default function MyAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (user) {
        setLoading(true);
        getUserAdsClient(user.id)
            .then(data => setAds(data || []))
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user, authLoading]);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'yayinda': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Active</span>;
      case 'onay_bekliyor': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Pending</span>;
      case 'pasif': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Inactive</span>;
      case 'reddedildi': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Rejected</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  if (authLoading || (loading && user)) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={32}/></div>;
  if (!user) return <div className="p-10 text-center">Please login to view your ads.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link href="/ilan-ver" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={18} /> Post New Ad
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'yayinda', 'onay_bekliyor', 'pasif'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize whitespace-nowrap ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {status === 'all' ? 'All Ads' : (status === 'yayinda' ? 'Active' : (status === 'onay_bekliyor' ? 'Pending' : 'Inactive'))}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input type="text" placeholder="Search ads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-indigo-500"/>
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        {filteredAds.length === 0 ? (
          <div className="p-12"><EmptyState icon={Plus} title="No Ads Found" description="You haven't posted any ads yet or no ads match your filter." actionLabel="Post Ad Now" actionUrl="/ilan-ver"/></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
                  <tr><th className="px-6 py-4">Item</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0 border relative">
                            {ad.image ? <img src={ad.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No IMG</div>}
                          </div>
                          <div>
                            <Link href={`/ilan/${ad.id}`} className="font-bold text-gray-900 text-sm hover:text-indigo-600 block line-clamp-1">{ad.title}</Link>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {ad.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-900 text-sm">{formatPrice(ad.price, ad.currency)}</td>
                      <td className="px-6 py-4">{getStatusBadge(ad.status)}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(ad.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Link href={`/ilan-duzenle/${ad.id}`} className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-full transition-colors"><Edit size={16}/></Link>
                           <DeleteAdButton adId={ad.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile View Omitted */}
          </>
        )}
      </div>
    </div>
  );
}