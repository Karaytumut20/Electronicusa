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
    "\n🇺🇸  FIXING IMAGE UPLOADER & LEGACY ROUTES...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// 1. IMAGE UPLOADER (English & Brand Colors)
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
// 2. OLD 'ILAN-VER' PAGE (Translation Fix)
// ---------------------------------------------------------
const ilanVerPageContent = `
import React from 'react';
import CategoryWizard from '@/components/CategoryWizard';

export default function PostAdCategoryPage() {
  return (
    <div className="max-w-[800px] mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#333] mb-2">Post Free Ad</h1>
        <p className="text-gray-500 text-sm">Select the correct category to reach the right buyers.</p>
      </div>
      <CategoryWizard />
    </div>
  );
}
`;

const filesToWrite = [
  { path: "components/ui/ImageUploader.tsx", content: imageUploaderContent },
  { path: "app/ilan-ver/page.tsx", content: ilanVerPageContent }, // Eski sayfayı da İngilizceye çeviriyoruz
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
  colors.blue + colors.bold + "\n✅ TRANSLATION FIXES COMPLETE!" + colors.reset,
);
console.log("👉 Restart your server with 'npm run dev' to see the changes.");
