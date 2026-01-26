"use client";
import React, { useRef, useState } from 'react';
import { Camera, User, Loader2, Trash2 } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

type AvatarUploaderProps = {
  currentImage?: string | null;
  onImageChange: (url: string | null) => void;
};

export default function AvatarUploader({ currentImage, onImageChange }: AvatarUploaderProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      addToast('File size must be less than 2MB.', 'error');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadImageClient(file);
      onImageChange(publicUrl);
      addToast('Profile photo updated.', 'success');
    } catch (error: any) {
      console.error(error);
      addToast('Upload failed.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative group cursor-pointer"
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          ) : currentImage ? (
            <img src={currentImage} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}

          {!uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="w-8 h-8 text-white/90" />
            </div>
          )}
        </div>

        {!uploading && currentImage && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-transform hover:scale-110 z-10"
            title="Remove Photo"
          >
            <Trash2 size={14} />
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
        />
      </div>

      <div className="text-center">
        <p className="text-xs font-bold text-indigo-900 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
          Change Photo
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Max 2MB (JPG, PNG)</p>
      </div>
    </div>
  );
}