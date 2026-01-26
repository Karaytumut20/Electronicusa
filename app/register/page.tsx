"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanPhone = form.phone.replace(/\s/g, '');
    const fullName = `${form.name} ${form.surname}`.trim();

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: fullName,
          phone: cleanPhone,
        },
      },
    });

    if (error) {
      addToast(error.message, 'error');
    } else {
      // 2. Explicitly Create Profile (Upsert to be safe)
      if (data.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
              id: data.user.id,
              email: form.email,
              full_name: fullName,
              phone: cleanPhone,
              role: 'user',
              show_phone: false
          });

          if (profileError) {
              console.error("Profile creation failed:", profileError);
              // Don't block registration success, but log it.
          }
      }

      addToast('Registration successful! You can now login.', 'success');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 bg-[#f6f7f9] px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm w-full max-w-[500px] overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#333] mb-2 text-center">Create Account</h2>
          <form onSubmit={handleRegister} className="space-y-4 mt-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Name</label>
                <input type="text" onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Surname</label>
                <input type="text" onChange={e => setForm({...form, surname: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Mobile Phone</label>
              <input
                type="tel"
                placeholder="+1 555..."
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">* Required for communication with buyers.</p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Email</label>
              <input type="email" onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Password</label>
              <input type="password" onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold h-[44px] rounded-sm hover:bg-indigo-700 transition-colors shadow-sm mt-4 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[12px] text-gray-500">Already a member? </span>
            <Link href="/login" className="text-indigo-600 font-bold text-[12px] hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}