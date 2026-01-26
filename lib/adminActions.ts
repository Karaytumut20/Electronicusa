'use server'
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// İstatistikleri Getir
export async function getAdminStats() {
  const supabase = await createClient();
  const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: ads } = await supabase.from('ads').select('*', { count: 'exact', head: true });
  const { count: active } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda');

  return { users: users || 0, ads: ads || 0, active: active || 0, revenue: 0 };
}

// İlanları Getir
export async function getAdminAds() {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*, profiles(full_name, email)').order('created_at', { ascending: false });
  return data || [];
}

// İlan Onayla
export async function approveAdAdmin(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('ads').update({ status: 'yayinda' }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/listings');
  return { success: true };
}

// İlan Reddet
export async function rejectAdAdmin(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('ads').update({ status: 'reddedildi' }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/listings');
  return { success: true };
}

// İlanı Tamamen Sil (Hard Delete + Storage Cleanup)
export async function deleteAdAdmin(id: number) {
  const supabase = await createClient();

  // 1. Önce resim yollarını al
  const { data: ad } = await supabase.from('ads').select('images, image').eq('id', id).single();

  // 2. İlanı veritabanından sil (Constraints sayesinde mesajlar bozulmayacak, ad_id NULL olacak)
  const { error } = await supabase.from('ads').delete().eq('id', id);

  if (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }

  // 3. Storage temizliği (Opsiyonel: Hata verirse işlemi durdurma)
  try {
      const imagesToDelete = [];
      if (ad?.image) imagesToDelete.push(ad.image);
      if (ad?.images && Array.isArray(ad.images)) {
          ad.images.forEach((img: string) => imagesToDelete.push(img));
      }

      // URL'den dosya yollarını çıkar (bucket adından sonrası)
      const paths = imagesToDelete.map(url => {
          const parts = url.split('/ads/'); // Bucket adı 'ads' varsayılıyor
          return parts.length > 1 ? parts[1] : null;
      }).filter(p => p !== null);

      if (paths.length > 0) {
          await supabase.storage.from('ads').remove(paths);
      }
  } catch (storageErr) {
      console.error("Storage cleanup warning:", storageErr);
  }

  revalidatePath('/admin/listings');
  return { success: true };
}