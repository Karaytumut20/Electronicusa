const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🇺🇸  EXECUTING FINAL TRANSLATION & BRANDING FIX...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// 1. LOADING SCREEN (Brand Colors & English)
// ---------------------------------------------------------
const loadingPageContent = `
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={48} className="text-indigo-600 animate-spin" />
        <span className="text-slate-700 font-bold text-lg animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}
`;

// ---------------------------------------------------------
// 2. IMAGE UPLOADER (English & Brand Colors)
// ---------------------------------------------------------
const imageUploaderContent = `
"use client";
import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
};

type UploadItem = {
  id: string;
  url: string;
  file?: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  remoteUrl?: string;
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<UploadItem[]>(
    initialImages.map((url, i) => ({
      id: \`init-\${i}\`,
      url: url,
      status: 'success',
      remoteUrl: url
    }))
  );

  const [isGlobalUploading, setIsGlobalUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
            addToast(\`\${file.name} is too large (Max 5MB).\`, 'error');
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    const newItems: UploadItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      status: 'uploading'
    }));

    setItems(prev => [...prev, ...newItems]);
    setIsGlobalUploading(true);

    for (const item of newItems) {
      if (!item.file) continue;

      try {
        const publicUrl = await uploadImageClient(item.file);

        setItems(current => current.map(i =>
          i.id === item.id ? { ...i, status: 'success', remoteUrl: publicUrl } : i
        ));

      } catch (error: any) {
        console.error("Upload error:", error);
        setItems(current => current.map(i =>
          i.id === item.id ? { ...i, status: 'error' } : i
        ));
        addToast(\`Failed to upload \${item.file?.name}\`, 'error');
      }
    }

    setIsGlobalUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  React.useEffect(() => {
    const successUrls = items
      .filter(i => i.status === 'success' && i.remoteUrl)
      .map(i => i.remoteUrl as string);
    onImagesChange(successUrls);
  }, [items, onImagesChange]);

  const removeImage = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Upload Button */}
        <div
          onClick={() => !isGlobalUploading && fileInputRef.current?.click()}
          className={\`w-28 h-28 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50 hover:border-indigo-400 group \${isGlobalUploading ? 'opacity-50 cursor-not-allowed' : ''}\`}
        >
          {isGlobalUploading ? (
            <div className="text-center">
                <Loader2 size={24} className="animate-spin text-indigo-600 mx-auto mb-2" />
                <span className="text-[10px] text-indigo-600 font-bold">Loading...</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="text-indigo-400 mb-2 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs text-indigo-900 font-bold">Add Photo</span>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={isGlobalUploading}
          />
        </div>

        {/* Image List */}
        {items.map((item, idx) => (
          <div key={item.id} className="relative w-28 h-28 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden group shadow-sm">
            <img src={item.url} alt="preview" className={\`w-full h-full object-cover transition-opacity \${item.status === 'error' ? 'opacity-50 grayscale' : ''}\`} />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {item.status === 'uploading' && <div className="bg-white/80 p-2 rounded-full shadow"><Loader2 size={20} className="animate-spin text-indigo-600" /></div>}
              {item.status === 'error' && <div className="bg-red-100 p-2 rounded-full shadow text-red-600"><AlertCircle size={20} /></div>}
            </div>

            {idx === 0 && item.status === 'success' && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10 shadow-sm">COVER</div>
            )}

            <button
              onClick={() => removeImage(item.id)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 z-20 cursor-pointer shadow-md hover:scale-110"
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <AlertCircle size={16} className="text-indigo-500 shrink-0 mt-0.5"/>
        <p>We recommend uploading at least 3 photos for better visibility. The first photo will be used as the cover image.</p>
      </div>
    </div>
  );
}
`;

// ---------------------------------------------------------
// 3. AD DETAIL PAGE (Full English)
// ---------------------------------------------------------
const adDetailPageContent = `
import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
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
import { Eye, MapPin, Calendar, Tag, AlertTriangle } from 'lucide-react';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('en-US');
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
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={breadcrumbItems} />

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
                 <p className="text-4xl font-extrabold text-indigo-700 tracking-tight">{formattedPrice} <span className="text-2xl text-slate-400 font-normal">{ad.currency}</span></p>
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
      <MobileAdActionBar price={\`\${formattedPrice} \${ad.currency}\`} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}
`;

// ---------------------------------------------------------
// 4. ACTION BUTTONS & MOBILE BAR
// ---------------------------------------------------------
const actionButtonsContent = `
"use client";
import React from 'react';
import { Flag, Printer, Share2, MessageSquare, Star } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useMessage } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFavorites } from '@/context/FavoritesContext';

export default function AdActionButtons({ id, title, image, sellerName }: { id: number, title: string, image?: string, sellerName?: string }) {
  const { openModal } = useModal();
  const { startConversation } = useMessage();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const liked = isFavorite(id);

  const handlePrint = () => window.print();

  const handleSendMessage = () => {
    if (!user) {
      addToast('Please login to send a message.', 'error');
      return;
    }
    const adImage = image || 'https://via.placeholder.com/300';
    const sName = sellerName || 'Seller';
    startConversation(id, title, adImage, sName);
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-4 text-[11px] text-blue-800">
         <button onClick={handleSendMessage} className="flex items-center gap-1 hover:underline font-bold text-blue-900 md:hidden">
            <MessageSquare size={14}/> Message
         </button>
        <button onClick={() => toggleFavorite(id)} className={\`flex items-center gap-1 hover:underline \${liked ? 'text-yellow-600 font-bold' : ''}\`}>
          <Star size={14} className={liked ? "fill-yellow-500 text-yellow-500" : ""} />
          {liked ? 'Saved' : 'Add to Favorites'}
        </button>
        <button onClick={() => openModal('REPORT', { id })} className="flex items-center gap-1 hover:underline">
          <Flag size={14}/> Report
        </button>
        <button onClick={handlePrint} className="flex items-center gap-1 hover:underline">
          <Printer size={14}/> Print
        </button>
        <button onClick={() => openModal('SHARE', { title, url: window.location.href })} className="flex items-center gap-1 hover:underline">
          <Share2 size={14}/> Share
        </button>
      </div>
    </div>
  );
}
`;

const mobileActionBarContent = `
import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export default function MobileAdActionBar({ price, phone }: { price: string, phone?: string }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-[90] md:hidden flex items-center p-3 gap-3 pb-[20px]">
      <div className="flex-1">
        <p className="text-[10px] text-gray-500">Price</p>
        <p className="text-lg font-bold text-indigo-900 leading-none">{price}</p>
      </div>

      <div className="flex gap-2">
        <button className="bg-indigo-100 text-indigo-700 p-3 rounded-md">
          <MessageSquare size={20} />
        </button>
        {phone ? (
          <a href={\`tel:\${phone}\`} className="bg-indigo-700 text-white px-6 py-2.5 rounded-md font-bold flex items-center gap-2 text-sm shadow-md hover:bg-indigo-800">
             <Phone size={18} /> Call
          </a>
        ) : (
           <button disabled className="bg-gray-300 text-gray-500 px-6 py-2.5 rounded-md font-bold text-sm">No Phone</button>
        )}
      </div>
    </div>
  );
}
`;

// ---------------------------------------------------------
// 5. EDIT AD PAGE (Translate)
// ---------------------------------------------------------
const editAdPageContent = `
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
`;

// ---------------------------------------------------------
// 6. CONSTANTS (Data Translation)
// ---------------------------------------------------------
const constantsContent = `
export const carBrands = []; // Unused in electronics, kept for legacy if needed

export const currencies = ["USD", "EUR", "GBP"];

// Translated or generic options if needed in future
export const conditions = ["New", "Used", "Refurbished"];
export const warrantyStatus = ["Yes", "No"];
`;

// ---------------------------------------------------------
// 7. NOT FOUND & ERROR PAGES
// ---------------------------------------------------------
const notFoundPageContent = `
import React from 'react';
import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-[100px] font-black text-gray-200 leading-none">404</h1>
      <h2 className="text-2xl font-bold text-[#333] mt-[-20px] mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/" className="flex-1 bg-indigo-600 text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
          <Home size={18} /> Home
        </Link>
        <Link href="/search" className="flex-1 bg-white border border-gray-300 text-[#333] py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <Search size={18} /> Search Ads
        </Link>
      </div>
    </div>
  );
}
`;

const errorPageContent = `
'use client';
import { useEffect } from 'react';
import { WifiOff, RefreshCcw, Home, Database } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  const isConnectionError = error.message.includes('fetch failed') || error.message.includes('NetworkError');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center font-sans">
      <div className="bg-red-50 p-6 rounded-full mb-6 border border-red-100 shadow-sm animate-in zoom-in duration-300">
        {isConnectionError ? <WifiOff className="w-12 h-12 text-red-500" /> : <Database className="w-12 h-12 text-red-500" />}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{isConnectionError ? 'Connection Failed' : 'Something Went Wrong'}</h2>
      <p className="text-gray-600 mb-8 max-w-md text-sm leading-relaxed">
        {isConnectionError ? "We can't connect to the server. Please check your internet connection." : "An unexpected error occurred. Our team has been notified."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button onClick={() => reset()} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
          <RefreshCcw size={18} /> Retry
        </button>
        <Link href="/" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
          <Home size={18} /> Home
        </Link>
      </div>
    </div>
  );
}
`;

const filesToWrite = [
  { path: "app/loading.tsx", content: loadingPageContent },
  { path: "components/ui/ImageUploader.tsx", content: imageUploaderContent },
  { path: "app/ilan/[id]/page.tsx", content: adDetailPageContent },
  { path: "components/AdActionButtons.tsx", content: actionButtonsContent },
  { path: "components/MobileAdActionBar.tsx", content: mobileActionBarContent },
  { path: "app/ilan-duzenle/[id]/page.tsx", content: editAdPageContent },
  { path: "lib/constants.ts", content: constantsContent },
  { path: "app/not-found.tsx", content: notFoundPageContent },
  { path: "app/error.tsx", content: errorPageContent },
];

filesToWrite.forEach((file) => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(process.cwd(), file.path), file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " updated successfully." + colors.reset,
    );
  } catch (e) {
    console.error(
      colors.yellow + "✘ " + file.path + " failed: " + e.message + colors.reset,
    );
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ FINAL ENGLISH FIXES APPLIED!" +
    colors.reset,
);
console.log("👉 Restart your server with 'npm run dev' to see the changes.");
