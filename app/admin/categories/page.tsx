"use client";
import React, { useState, useEffect } from 'react';
import { addCategoryAction, getCategoryTreeServer } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Plus, FolderPlus, Loader2, Tag } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [newCat, setNewCat] = useState({ title: '', slug: '', icon: 'Tag', parent_id: '' });

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    setLoading(true);
    const data = await getCategoryTreeServer();
    setCategories(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
        ...newCat,
        parent_id: newCat.parent_id ? Number(newCat.parent_id) : undefined
    };

    const res = await addCategoryAction(payload);
    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('Kategori başarıyla eklendi.', 'success');
        setNewCat({ title: '', slug: '', icon: 'Tag', parent_id: '' });
        refreshCategories();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Kategori Yönetimi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Yeni Kategori</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold mb-1">Başlık</label>
                    <input
                        value={newCat.title}
                        onChange={e => setNewCat({...newCat, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                        className="w-full border p-2 rounded-md text-sm"
                        placeholder="Örn: Laptop" required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Slug</label>
                    <input value={newCat.slug} readOnly className="w-full border p-2 rounded-md text-sm bg-gray-50" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Üst Kategori</label>
                    <select
                        value={newCat.parent_id}
                        onChange={e => setNewCat({...newCat, parent_id: e.target.value})}
                        className="w-full border p-2 rounded-md text-sm"
                    >
                        <option value="">Ana Kategori (Yok)</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <button disabled={submitting} className="w-full bg-indigo-600 text-white py-2 rounded-md font-bold flex justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={18}/> : <FolderPlus size={18}/>} Kaydet
                </button>
            </form>
        </div>

        {/* Liste */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-sm">Mevcut Yapı</div>
            <div className="p-4">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : (
                    <div className="space-y-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="border-b border-gray-100 pb-2">
                                <div className="flex items-center gap-2 font-bold text-slate-700">
                                    <Tag size={14} className="text-indigo-500"/> {cat.title}
                                </div>
                                <div className="ml-6 mt-1 flex flex-wrap gap-2">
                                    {cat.subs?.map((sub: any) => (
                                        <span key={sub.id} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200">
                                            {sub.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}