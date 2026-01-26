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
  status: 'pending' | 'uploading' | 'success' | 'error';
  remoteUrl?: string;
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>(
    initialImages.map((url, i) => ({ id: `init-${i}`, url, status: 'success', remoteUrl: url }))
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);

    // Client-side limit check
    if (items.length + files.length > 10) {
        addToast('You can upload a maximum of 10 photos.', 'error');
        return;
    }

    setIsUploading(true);

    const newItems = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
        status: 'uploading' as const
    }));

    setItems(prev => [...prev, ...newItems]);

    // Process sequentially to prevent network congestion
    for (const item of newItems) {
        try {
            const publicUrl = await uploadImageClient(item.file);
            setItems(current => current.map(i => i.id === item.id ? { ...i, status: 'success', remoteUrl: publicUrl } : i));
        } catch (error) {
            console.error(error);
            setItems(current => current.map(i => i.id === item.id ? { ...i, status: 'error' } : i));
            addToast('Image upload failed. Try a smaller file.', 'error');
        }
    }

    setIsUploading(false);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  React.useEffect(() => {
    const successUrls = items.filter(i => i.status === 'success' && i.remoteUrl).map(i => i.remoteUrl as string);
    onImagesChange(successUrls);
  }, [items, onImagesChange]);

  const removeImage = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-28 h-28 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="text-center"><Loader2 size={24} className="animate-spin text-indigo-600 mx-auto mb-2"/><span className="text-[10px] text-indigo-600 font-bold">Optimizing...</span></div>
          ) : (
            <><Upload size={24} className="text-indigo-400 mb-2"/><span className="text-xs text-indigo-900 font-bold">Add Photo</span></>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" disabled={isUploading} />
        </div>

        {items.map((item, idx) => (
          <div key={item.id} className="relative w-28 h-28 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden group shadow-sm">
            <img src={item.url} className={`w-full h-full object-cover ${item.status === 'error' ? 'opacity-50 grayscale' : ''}`} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {item.status === 'uploading' && <div className="bg-white/80 p-2 rounded-full"><Loader2 size={20} className="animate-spin text-indigo-600"/></div>}
              {item.status === 'error' && <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertCircle size={20}/></div>}
            </div>
            {idx === 0 && item.status === 'success' && <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10 shadow-sm">COVER</div>}
            <button onClick={() => removeImage(item.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 cursor-pointer shadow-md"><X size={12}/></button>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <AlertCircle size={16} className="text-indigo-500 shrink-0 mt-0.5"/>
        <p>Images are automatically compressed for faster upload. Max 10 photos.</p>
      </div>
    </div>
  );
}