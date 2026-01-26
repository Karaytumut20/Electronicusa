"use client";
import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Shield, Ban, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client'; // DÜZELTME: createClient import edildi

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // DÜZELTME: İstemci burada oluşturuldu
  const supabase = createClient();

  useEffect(() => {
    async function load() {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if(data) setUsers(data);
        setLoading(false);
    }
    load();
  }, []);

  const filtered = users.filter(u =>
    (u.full_name?.toLowerCase().includes(search.toLowerCase())) ||
    (u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr> : filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {user.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{user.full_name || 'No Name'}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                {user.role || 'user'}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded w-fit">
                                <CheckCircle size={12}/> Active
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-indigo-600"><MoreVertical size={18}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}