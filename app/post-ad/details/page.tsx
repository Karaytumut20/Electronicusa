"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Info, MapPin, Camera, Cpu } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import ComputerFields from '@/components/form/ComputerFields';
import ImageUploader from '@/components/ui/ImageUploader';
import { createAdAction } from '@/lib/actions';
import { adSchema } from '@/lib/schemas';
import { cities, getDistricts } from '@/lib/locations';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { techSpecsRequiredSlugs } from '@/lib/hierarchyData';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat')?.toLowerCase() || '';
  const categoryPath = searchParams.get('path') || 'No Category Selected';
  const urlBrand = searchParams.get('brand') || '';

  // AKILLI KONTROL: Eğer kategori slug'ı veya seçilen yol bilgisayar terimleri içeriyorsa Tech Specs açılır.
  const isTechSpecsRequired = techSpecsRequiredSlugs.some(slug =>
    categorySlug.includes(slug) || categoryPath.toLowerCase().includes(slug)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [districts, setDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', currency: 'USD', city: '', district: '',
    brand: urlBrand,
    processor: '', ram: '', screen_size: '', gpu_capacity: '', resolution: '', ssd_capacity: ''
  });

  useEffect(() => {
    if (urlBrand) setFormData(prev => ({ ...prev, brand: urlBrand }));
  }, [urlBrand]);

  useEffect(() => {
    if (formData.city) setDistricts(getDistricts(formData.city));
  }, [formData.city]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (e: any) => {
     const { name, value } = e.target || e;
     setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    const rawData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null,
        images: images,
        price: Number(formData.price),
    };

    const result = adSchema.safeParse(rawData);
    if (!result.success) {
        const fieldErrors: any = {};
        result.error.issues.forEach(issue => { fieldErrors[issue.path[0]] = issue.message; });
        setErrors(fieldErrors);
        addToast('Please fill in required fields.', 'error');
        return;
    }

    setIsSubmitting(true);
    const res = await createAdAction(rawData);
    if (res.error) { addToast(res.error, 'error'); }
    else {
        addToast('Ad published successfully!', 'success');
        router.push('/post-ad/success');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      <div className="flex-1">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Selected Category</p>
            <h1 className="text-sm font-bold text-indigo-900">{categoryPath}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Info className="text-indigo-500" size={20}/> Basic Info</h3>
             <div className="space-y-5">
               <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} />
               <Textarea label="Description" name="description" value={formData.description} onChange={handleInputChange} error={errors.description} />
               <div className="grid grid-cols-2 gap-5">
                 <Input label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} error={errors.price} />
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1">Currency</label>
                   <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full h-10 border border-gray-300 rounded-sm px-2 text-sm bg-white">
                     <option value="USD">USD</option><option value="EUR">EUR</option>
                   </select>
                 </div>
               </div>
             </div>
          </section>

          {/* AKILLI KOŞUL: Sadece listedeki terimler eşleşirse görünür */}
          {isTechSpecsRequired && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Cpu className="text-orange-500" size={20}/> Technical Specifications</h3>
               <ComputerFields data={formData} onChange={handleDynamicChange} categorySlug={categorySlug} />
            </section>
          )}

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><MapPin className="text-green-500" size={20}/> Location</h3>
             <div className="grid grid-cols-2 gap-5">
               <select name="city" onChange={handleInputChange} value={formData.city} className="w-full h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
               </select>
               <select name="district" value={formData.district} onChange={handleInputChange} className="w-full h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm" disabled={!formData.city}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
               </select>
             </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Camera className="text-pink-500" size={20}/> Photos</h3>
             <ImageUploader onImagesChange={setImages} initialImages={images} />
          </section>

          <div className="flex justify-end pt-4">
             <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-lg transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Publish Listing'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div>Loading...</div>}><PostAdFormContent /></Suspense>
}