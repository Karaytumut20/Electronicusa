const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 UPDATING CURRENCY DISPLAY TO '$' AND ENFORCING USD ONLY...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// 1. UPDATE lib/utils.ts (Change formatPrice to use '$' prefix)
// ---------------------------------------------------------
const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | null | undefined, currency: string = 'USD') {
  if (price === null || price === undefined) return '$0';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  // Always format as USD with '$' prefix, ignoring the currency argument string suffix
  return '$' + new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function truncate(str: string, length: number) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "lib/utils.ts"),
    utilsContent.trim(),
  );
  console.log(colors.green + "✔ lib/utils.ts updated." + colors.reset);
} catch (e) {
  console.error("Error updating lib/utils.ts:", e.message);
}

// ---------------------------------------------------------
// 2. UPDATE components/StickyAdHeader.tsx (Remove currency prop usage)
// ---------------------------------------------------------
const stickyHeaderContent = `"use client";
import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

type Props = {
  title: string;
  price: string;
  currency?: string; // Optional/Ignored
};

export default function StickyAdHeader({ title, price }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-[80] border-b border-gray-200 animate-in slide-in-from-top duration-300 hidden md:block">
      <div className="container max-w-[1150px] mx-auto px-4 h-[60px] flex items-center justify-between">

        <div className="flex-1 min-w-0 pr-8">
          <h2 className="text-[#333] font-bold text-sm truncate">{title}</h2>
          <p className="text-xs text-gray-500">Ad No: 1029381</p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <span className="text-xl font-bold text-blue-900">{price}</span>

          <button className="bg-blue-700 text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors flex items-center gap-2">
            <Phone size={16} /> Contact Seller
          </button>
        </div>

      </div>
    </div>
  );
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "components/StickyAdHeader.tsx"),
    stickyHeaderContent.trim(),
  );
  console.log(
    colors.green + "✔ components/StickyAdHeader.tsx updated." + colors.reset,
  );
} catch (e) {
  console.error("Error updating components/StickyAdHeader.tsx:", e.message);
}

// ---------------------------------------------------------
// 3. UPDATE app/ilan/[id]/page.tsx (Use formatPrice and remove manual currency display)
// ---------------------------------------------------------
const adDetailPageContent = `import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
import { createClient } from '@/lib/supabase/server';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import TechnicalSpecsTab from '@/components/AdDetail/TechnicalSpecsTab';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin, Calendar, Tag, AlertTriangle, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils'; // Import formatPrice

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return notFound();

  // --- GÜVENLİK KONTROLÜ BAŞLANGIÇ ---
  if (ad.status !== 'yayinda') {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const isOwner = user && user.id === ad.user_id;
      let isAdmin = false;

      if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role === 'admin') isAdmin = true;
      }

      if (!isOwner && !isAdmin) {
          return notFound();
      }
  }
  // --- GÜVENLİK KONTROLÜ BİTİŞ ---

  const formattedPrice = formatPrice(ad.price, ad.currency);
  const location = \`\${ad.city || ''}, \${ad.district || ''}\`;
  const sellerInfo = ad.profiles || { full_name: 'Unknown User', phone: '', email: '', show_phone: false };
  const adImages = ad.images && ad.images.length > 0 ? ad.images : (ad.image ? [ad.image] : []);

  const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Search', href: '/search' },
      { label: 'Details' }
  ];

  const tabItems = [
     { id: 'desc', label: 'Description', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-4">{ad.description}</div> },
     { id: 'features', label: 'Features', content: <FeaturesTab ad={ad} /> },
     { id: 'location', label: 'Location', content: <LocationTab city={ad.city} district={ad.district} /> }
  ];

  if (ad.technical_specs) {
      tabItems.splice(1, 0, { id: 'tech_specs', label: 'Tech Specs', content: <TechnicalSpecsTab specs={ad.technical_specs} /> });
  }

  return (
    <div className="pb-20 relative font-sans bg-[#F8FAFC] min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={breadcrumbItems} />

        {ad.status !== 'yayinda' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-bold text-yellow-800">
                            This ad is currently {ad.status === 'onay_bekliyor' ? 'Pending Approval' : 'Inactive'}.
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                            Only you (the owner) and administrators can see this page. It is not publicly accessible.
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin size={16}/> {location}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-indigo-600 font-bold">#{ad.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              {ad.is_urgent && <Badge variant="danger" className="text-sm px-3 py-1 flex items-center gap-1"><AlertTriangle size={12}/> URGENT</Badge>}
              {ad.is_vitrin && <Badge variant="warning" className="text-sm px-3 py-1 flex items-center gap-1"><Tag size={12}/> FEATURED</Badge>}
              <LiveVisitorCount adId={ad.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image} images={adImages} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                 <p className="text-4xl font-extrabold text-indigo-700 tracking-tight">{formattedPrice}</p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>
            <Tabs items={tabItems} />
          </div>

          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar
                sellerId={ad.user_id}
                sellerName={sellerInfo.full_name || 'User'}
                sellerPhone={sellerInfo.phone || ''}
                showPhone={sellerInfo.show_phone}
                adId={ad.id}
                adTitle={ad.title}
                adImage={ad.image}
                price={formattedPrice}
                currency={ad.currency}
             />

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider border-b border-gray-50 pb-2">Details</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-slate-500 flex items-center gap-2"><Calendar size={14}/> Posted Date</span>
                        <span className="font-bold text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span>
                   </li>
                   {ad.brand && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Brand</span><span className="font-medium text-slate-900">{ad.brand}</span></li>}
                   {ad.model && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Model</span><span className="font-medium text-slate-900">{ad.model}</span></li>}
                   {ad.year && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Year</span><span className="font-medium text-slate-900">{ad.year}</span></li>}
                   <li className="flex justify-between pt-1">
                      <span className="text-slate-500 flex items-center gap-2"><Eye size={14}/> Views</span>
                      <span className="font-bold text-slate-900">{ad.view_count || 0}</span>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      </div>
      <MobileAdActionBar price={formattedPrice} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "app/ilan/[id]/page.tsx"),
    adDetailPageContent.trim(),
  );
  console.log(
    colors.green + "✔ app/ilan/[id]/page.tsx updated." + colors.reset,
  );
} catch (e) {
  console.error("Error updating app/ilan/[id]/page.tsx:", e.message);
}

// ---------------------------------------------------------
// 4. UPDATE app/ilan-ver/detay/page.tsx (Remove currency selector, enforce USD)
// ---------------------------------------------------------
const postAdContent = `"use client";
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
import { techSpecsRequiredSlugs } from '@/lib/hierarchyData';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat')?.toLowerCase() || '';
  const categoryPath = searchParams.get('path') || 'No Category Selected';
  const urlBrand = searchParams.get('brand') || '';

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
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="relative">
                   <Input
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      error={errors.price}
                      className="pl-8" // Add padding for the $ sign
                   />
                   {/* Dollar Sign Overlay */}
                   <span className="absolute left-3 top-9 text-slate-500 font-bold">$</span>
                 </div>
                 {/* Currency Selector Removed - Defaulting to USD */}
               </div>
             </div>
          </section>

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
`;

try {
  fs.writeFileSync(
    path.join(process.cwd(), "app/ilan-ver/detay/page.tsx"),
    postAdContent.trim(),
  );
  console.log(
    colors.green +
      "✔ app/ilan-ver/detay/page.tsx updated (Currency input updated)." +
      colors.reset,
  );
} catch (e) {
  console.error("Error updating app/ilan-ver/detay/page.tsx:", e.message);
}
