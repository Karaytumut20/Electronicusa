"use client";
import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, CheckCircle, Edit, Ban, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AdminEditUserModal from '@/components/modals/AdminEditUserModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Edit State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const supabase = createClient();

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if(data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user) => {
      setSelectedUser(user);
      setIsEditOpen(true);
  };

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
                {loading ? (
                    <tr><td colSpan={5} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600"/></td></tr>
                ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td></tr>
                ) : (
                    filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{user.full_name || 'No Name'}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                user.role === 'store' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                                {user.role || 'user'}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md w-fit border ${
                                user.status === 'banned' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                            }`}>
                                {user.status === 'banned' ? <Ban size={12}/> : <CheckCircle size={12}/>}
                                {user.status === 'banned' ? 'Banned' : 'Active'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit User"
                            >
                                <Edit size={18}/>
                            </button>
                        </td>
                    </tr>
                )))}
            </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {selectedUser && (
          <AdminEditUserModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            user={selectedUser}
            onSuccess={loadUsers}
          />
      )}
    </div>
  );
}