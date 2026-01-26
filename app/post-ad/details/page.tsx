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

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat') || '';
  const categoryPath = searchParams.get('path') || 'No Category Selected';
  const urlBrand = searchParams.get('brand') || '';

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
     // ComputerFields passes a fake event object or direct name/value?
     // Standardizing to event object for simplicity based on existing component
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Category</p>
            <h1 className="text-sm md:text-base font-bold text-indigo-900">{categoryPath}</h1>
          </div>
          <button onClick={() => router.push('/post-ad')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">Change</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Info className="text-indigo-500" size={20}/> Basic Information</h3>
             <div className="space-y-5">
               <Input label="Ad Title" name="title" placeholder="Ex: Macbook Pro M1, Like New..." value={formData.title} onChange={handleInputChange} error={errors.title} />
               <Textarea label="Description" name="description" placeholder="Describe your product..." value={formData.description} onChange={handleInputChange} className="h-32" error={errors.description} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <Input label="Price" name="price" type="number" placeholder="0" value={formData.price} onChange={handleInputChange} error={errors.price} />
                 <div>
                   <label className="block text-[11px] font-bold text-gray-600 mb-1">Currency</label>
                   <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full h-10 border border-gray-300 rounded-sm px-2 text-sm bg-white outline-none">
                     <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
                   </select>
                 </div>
               </div>
             </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Cpu className="text-orange-500" size={20}/> Tech Specs</h3>
             <ComputerFields data={formData} onChange={handleDynamicChange} categorySlug={categorySlug} />
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><MapPin className="text-green-500" size={20}/> Location</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                 <label className="block text-[11px] font-bold text-gray-600 mb-1">State / City</label>
                 <select name="city" onChange={handleInputChange} value={formData.city} className="w-full h-11 px-3 bg-white border border-gray-300 rounded-lg outline-none text-sm">
                    <option value="">Select</option>
                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-[11px] font-bold text-gray-600 mb-1">District / Area</label>
                 <select name="district" value={formData.district} onChange={handleInputChange} className="w-full h-11 px-3 bg-white border border-gray-300 rounded-lg outline-none text-sm" disabled={!formData.city}>
                    <option value="">Select</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
               </div>
             </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Camera className="text-pink-500" size={20}/> Photos</h3>
             <ImageUploader onImagesChange={setImages} initialImages={images} />
          </section>

          <div className="flex justify-end pt-4">
             <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200">
                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Publish Ad'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></div>}><PostAdFormContent /></Suspense>
}