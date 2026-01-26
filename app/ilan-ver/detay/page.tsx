"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, Info, MapPin, Camera, Sparkles, Save, Cpu } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import ComputerFields from '@/components/form/ComputerFields';
import ImageUploader from '@/components/ui/ImageUploader';
import AdCard from '@/components/AdCard';
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
  const categoryPath = searchParams.get('path') || 'Kategori Seçilmedi';
  const urlBrand = searchParams.get('brand') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', currency: 'TL', city: '', district: '',
    brand: urlBrand,
    processor: '', ram: '', screen_size: '', gpu_capacity: '', resolution: '', ssd_capacity: ''
  });

  useEffect(() => {
    if (urlBrand) setFormData(prev => ({ ...prev, brand: urlBrand }));
  }, [urlBrand]);

  useEffect(() => {
    if (formData.city) setDistricts(getDistricts(formData.city));
  }, [formData.city]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
        const fieldErrors = {};
        result.error.issues.forEach(issue => { fieldErrors[issue.path[0]] = issue.message; });
        setErrors(fieldErrors);
        addToast('Lütfen hatalı alanları düzeltiniz.', 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsSubmitting(true);
    const res = await createAdAction(rawData);
    if (res.error) { addToast(res.error, 'error'); }
    else {
        // BAŞARILI! Dopinge değil, direkt başarı sayfasına gönderiyoruz.
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push('/ilan-ver/basarili');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      <div className="flex-1">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Kategori</p>
            <h1 className="text-sm md:text-base font-bold text-indigo-900">{categoryPath}</h1>
          </div>
          <button onClick={() => router.push('/ilan-ver')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">Değiştir</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Info className="text-indigo-500" size={20}/> Temel Bilgiler</h3>
            <div className="space-y-5">
              <Input label="İlan Başlığı" name="title" placeholder="Örn: Macbook Pro M1, Çiziksiz..." value={formData.title} onChange={handleInputChange} error={errors.title} className="font-medium text-base" />
              <Textarea label="İlan Açıklaması" name="description" placeholder="Ürünün durumu, kutu içeriği vb." value={formData.description} onChange={handleInputChange} className="h-32" error={errors.description} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Fiyat" name="price" type="number" placeholder="0" value={formData.price} onChange={handleInputChange} error={errors.price} className="font-bold text-lg text-indigo-900" />
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['TL', 'USD', 'EUR', 'GBP'].map(curr => (
                      <button key={curr} type="button" onClick={() => setFormData({...formData, currency: curr})} className={`h-10 rounded-lg text-sm font-bold border transition-all ${formData.currency === curr ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{curr}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sadece Elektronik/Bilgisayar Alanlarını Gösteriyoruz */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Cpu className="text-orange-500" size={20}/> Teknik Detaylar</h3>
            <div className="-mx-4 md:mx-0">
                <ComputerFields data={formData} onChange={handleDynamicChange} categorySlug={categorySlug} />
            </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><Camera className="text-pink-500" size={20}/> Fotoğraflar</h3>
            <p className="text-sm text-slate-500 mb-6">İlk yüklediğiniz fotoğraf vitrin görseli olacaktır.</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300"><ImageUploader onImagesChange={setImages} initialImages={images} /></div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><MapPin className="text-green-500" size={20}/> Konum Bilgisi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">İl <span className="text-red-500">*</span></label>
                <select name="city" onChange={handleInputChange} value={formData.city} className="w-full h-11 pl-3 pr-8 bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none text-sm transition-shadow shadow-sm">
                    <option value="">Seçiniz</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe <span className="text-red-500">*</span></label>
                <select name="district" value={formData.district} onChange={handleInputChange} className="w-full h-11 pl-3 pr-8 bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none text-sm transition-shadow shadow-sm disabled:bg-gray-100" disabled={!formData.city}>
                    <option value="">Seçiniz</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between pt-4 pb-20 lg:pb-0">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors"><ArrowLeft size={18}/> Geri Dön</button>
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2">{isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'İlanı Yayınla'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></div>}><PostAdFormContent /></Suspense>
}