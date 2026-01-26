"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { getAdDetailServer, updateAdAction } from '@/lib/actions';
import ImageUploader from '@/components/ui/ImageUploader';
import ComputerFields from '@/components/form/ComputerFields';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

function EditAdContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [images, setImages] = useState<string[]>([]);
  const [adId, setAdId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
        if(!user) return;
        try {
            const { id } = await params;
            const ad = await getAdDetailServer(Number(id));
            if (!ad) { router.push('/dashboard/my-ads'); return; }
            if (ad.user_id !== user.id) {
                addToast('Unauthorized access.', 'error');
                router.push('/');
                return;
            }
            setFormData(ad);
            setImages(ad.images || (ad.image ? [ad.image] : []));
            setAdId(ad.id);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadData();
  }, [user, params]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (e: any) => {
    const { name, value } = e.target || e;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adId) return;
    setSaving(true);

    const updateData = {
        ...formData,
        images: images,
        image: images[0] || null,
        price: Number(formData.price)
    };

    const res = await updateAdAction(adId, updateData);
    if (res.error) { addToast(res.error, 'error'); }
    else {
        addToast('Ad updated successfully!', 'success');
        router.push('/dashboard/my-ads');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20}/></button>
            <h1 className="text-xl font-bold text-gray-800">Edit Ad: {formData.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-8">
            <section className="space-y-4">
                <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
                <Textarea label="Description" name="description" value={formData.description} onChange={handleInputChange} className="h-32" required />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Currency</label>
                        <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm">
                            <option>USD</option><option>EUR</option><option>GBP</option>
                        </select>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Technical Specs</h3>
                <div className="px-2">
                    <ComputerFields data={formData} onChange={handleDynamicChange} categorySlug={formData.category} />
                </div>
            </section>

            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Photos</h3>
                <div className="px-2"><ImageUploader onImagesChange={setImages} initialImages={images} /></div>
            </section>

            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Location</h3>
                <div className="grid grid-cols-2 gap-4 px-2">
                    <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
                    <Input label="District" name="district" value={formData.district} onChange={handleInputChange} />
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-8 py-3 rounded-sm font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Changes
                </button>
            </div>
        </form>
    </div>
  );
}

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
    return <Suspense fallback={<div>Loading...</div>}><EditAdContent params={params} /></Suspense>
}