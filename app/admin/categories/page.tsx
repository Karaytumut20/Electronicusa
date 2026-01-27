"use client";
import React, { useState, useEffect } from 'react';
import { addCategoryAction, updateCategoryAction, deleteCategoryAction, getCategoryTreeServer } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Plus, FolderPlus, Loader2, Tag, ChevronRight, Edit, Trash2, X, Save, RefreshCcw } from 'lucide-react';

type Category = {
  id: number;
  title: string;
  slug: string;
  parent_id?: number | null;
  subs?: Category[];
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { addToast } = useToast();

  // Form States
  const [newCat, setNewCat] = useState({ title: '', slug: '', icon: 'Tag', parent_id: '' });
  const [editForm, setEditForm] = useState({ title: '', slug: '', parent_id: '' });

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    setLoading(true);
    const data = await getCategoryTreeServer();
    setCategories(data as Category[]);
    setLoading(false);
  };

  // --- CREATE ---
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
        addToast('Category added successfully!', 'success');
        setNewCat({ title: '', slug: '', icon: 'Tag', parent_id: '' });
        refreshCategories(); // Refresh list from server
    }
    setSubmitting(false);
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Subcategories may also be deleted.')) return;

    // Optimistic Update
    const originalState = [...categories];
    // Remove from UI (simplistic approach for root categories, for subs a deep filter is needed)
    // A full refresh is safer here to sync with DB cascade delete

    const res = await deleteCategoryAction(id);
    if (res.error) {
        addToast(res.error, 'error');
        setCategories(originalState); // Revert
    } else {
        addToast('Category deleted.', 'success');
        refreshCategories();
    }
  };

  // --- UPDATE ---
  const startEdit = (cat: Category) => {
      setEditingId(cat.id);
      setEditForm({
          title: cat.title,
          slug: cat.slug,
          parent_id: cat.parent_id ? String(cat.parent_id) : ''
      });
  };

  const cancelEdit = () => {
      setEditingId(null);
      setEditForm({ title: '', slug: '', parent_id: '' });
  };

  const handleUpdate = async (id: number) => {
      const payload = {
          title: editForm.title,
          slug: editForm.slug,
          parent_id: editForm.parent_id ? Number(editForm.parent_id) : undefined
      };

      const res = await updateCategoryAction(id, payload);
      if (res.error) {
          addToast(res.error, 'error');
      } else {
          addToast('Category updated.', 'success');
          setEditingId(null);
          refreshCategories();
      }
  };

  const renderCategoryList = (list: Category[], level = 0) => {
    return list.map(cat => (
      <div key={cat.id} className="border-b border-gray-100 last:border-0">
        <div className={`flex items-center justify-between p-3 hover:bg-slate-50 transition-colors ${level > 0 ? 'ml-6 border-l-2 border-indigo-100' : ''}`}>

            {/* Display Mode */}
            {editingId !== cat.id ? (
                <>
                    <div className="flex items-center gap-2">
                        {level === 0 ? <Tag size={16} className="text-indigo-600"/> : <ChevronRight size={14} className="text-gray-400"/>}
                        <span className="font-bold text-slate-800 text-sm">{cat.title}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">{cat.slug}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit size={14}/></button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={14}/></button>
                    </div>
                </>
            ) : (
                /* Edit Mode */
                <div className="flex items-center gap-2 w-full animate-in fade-in">
                    <input
                        value={editForm.title}
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                        className="border p-1 rounded text-sm w-1/3" placeholder="Title"
                    />
                    <input
                        value={editForm.slug}
                        onChange={e => setEditForm({...editForm, slug: e.target.value})}
                        className="border p-1 rounded text-sm w-1/3 bg-gray-50" placeholder="Slug"
                    />
                     <button onClick={() => handleUpdate(cat.id)} className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700"><Save size={14}/></button>
                     <button onClick={cancelEdit} className="p-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"><X size={14}/></button>
                </div>
            )}
        </div>
        {/* Recursive render for subcategories */}
        {cat.subs && cat.subs.length > 0 && (
            <div className="bg-gray-50/30">
                {renderCategoryList(cat.subs, level + 1)}
            </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Category Management</h1>
          <button onClick={refreshCategories} className="text-sm flex items-center gap-2 text-indigo-600 hover:underline">
            <RefreshCcw size={14}/> Refresh List
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ADD FORM */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-8">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-indigo-900"><Plus size={18}/> Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Title</label>
                    <input
                        value={newCat.title}
                        onChange={e => setNewCat({...newCat, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')})}
                        className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-indigo-500"
                        placeholder="e.g. Gaming Laptop" required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Slug</label>
                    <input value={newCat.slug} readOnly className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded-md text-sm text-slate-500" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Parent Category (Optional)</label>
                    <select
                        value={newCat.parent_id}
                        onChange={e => setNewCat({...newCat, parent_id: e.target.value})}
                        className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-indigo-500 bg-white"
                    >
                        <option value="">-- Main Category --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>
                <button disabled={submitting} className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-bold flex justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={18}/> : <FolderPlus size={18}/>} Save Category
                </button>
            </form>
        </div>

        {/* CATEGORY LIST */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-slate-700 flex justify-between">
                <span>Category Structure</span>
                <span className="text-xs font-normal text-gray-500">{categories.length} Main Categories</span>
            </div>
            <div className="max-h-[700px] overflow-y-auto">
                {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></div> : (
                    <div className="space-y-0">
                        {renderCategoryList(categories)}
                        {categories.length === 0 && <div className="p-8 text-center text-gray-500">No categories found. Add one from the left.</div>}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}