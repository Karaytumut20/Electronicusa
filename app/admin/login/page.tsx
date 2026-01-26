"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        addToast(error.message, 'error');
        setLoading(false);
        return;
    }

    // Check role (Optional security check on client, mainly handled by Middleware/RLS)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();

    if (profile?.role !== 'admin') {
        addToast('Access Denied. You are not an admin.', 'error');
        await supabase.auth.signOut();
        setLoading(false);
        return;
    }

    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/20">
                <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
            <p className="text-slate-500 text-sm">Secure Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="admin@electronicusa.com"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={20}/> : 'Login to Dashboard'}
            </button>
        </form>
      </div>
    </div>
  );
}