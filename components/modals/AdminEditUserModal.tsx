"use client";
import React, { useState } from 'react';
import { X, Save, Loader2, User, Shield, Activity } from 'lucide-react';
import { updateUserAdminAction } from '@/lib/adminActions';
import { useToast } from '@/context/ToastContext';

export default function AdminEditUserModal({ user, isOpen, onClose, onSuccess }) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        role: user?.role || 'user',
        status: user?.status || 'active'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await updateUserAdminAction(user.id, formData);

        setLoading(false);
        if (res.success) {
            addToast('User updated successfully.', 'success');
            onSuccess();
            onClose();
        } else {
            addToast(res.error || 'Hata oluştu.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">

                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Edit User</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                           <User size={14}/> Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                               <Shield size={14}/> Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="user">User</option>
                                <option value="store">Store</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                               <Activity size={14}/> Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="active">Active</option>
                                <option value="banned">Banned</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-700">
                        <span className="font-bold">Info:</span> Kullanıcı rolünü değiştirmek yetkilerini anında etkiler.
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}