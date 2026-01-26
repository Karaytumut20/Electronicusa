"use client";
import React, { useState, useEffect } from 'react';
import { addCategoryAction, getCategoryTreeServer } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Plus, FolderPlus, Loader2, Tag, ChevronRight } from 'lucide-react';

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

    // Parent ID boş string ise undefined gönderelim
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
        {/* EKLEME FORMU */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-indigo-900"><Plus size={18}/> Yeni Kategori / Alt Kategori</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Başlık</label>
                    <input
                        value={newCat.title}
                        onChange={e => setNewCat({...newCat, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')})}
                        className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-indigo-500"
                        placeholder="Örn: Gaming Laptop" required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">URL Slug (Otomatik)</label>
                    <input value={newCat.slug} readOnly className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded-md text-sm text-slate-500" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Üst Kategori (Opsiyonel)</label>
                    <select
                        value={newCat.parent_id}
                        onChange={e => setNewCat({...newCat, parent_id: e.target.value})}
                        className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-indigo-500 bg-white"
                    >
                        <option value="">-- Ana Kategori Olarak Ekle --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Eğer bir alt kategori ekliyorsanız (Örn: Computer &gt; Laptop), buradan üst kategoriyi seçin.</p>
                </div>
                <button disabled={submitting} className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-bold flex justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={18}/> : <FolderPlus size={18}/>} Kaydet
                </button>
            </form>
        </div>

        {/* KATEGORİ LİSTESİ */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-slate-700">Mevcut Kategori Yapısı</div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
                {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-indigo-600"/></div> : (
                    <div className="space-y-3">
                        {categories.map(cat => (
                            <div key={cat.id} className="border border-gray-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <Tag size={16} className="text-indigo-600"/> {cat.title}
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal">{cat.slug}</span>
                                </div>

                                {cat.subs && cat.subs.length > 0 && (
                                    <div className="mt-3 ml-6 pl-4 border-l-2 border-indigo-100 space-y-2">
                                        {cat.subs.map((sub: any) => (
                                            <div key={sub.id} className="flex items-center gap-2 text-xs text-slate-600">
                                                <ChevronRight size={12} className="text-gray-400"/>
                                                <span className="font-medium">{sub.title}</span>
                                                <span className="text-[9px] text-gray-400">({sub.slug})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(!cat.subs || cat.subs.length === 0) && (
                                    <p className="text-[10px] text-gray-400 ml-8 mt-1 italic">Alt kategori yok</p>
                                )}
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