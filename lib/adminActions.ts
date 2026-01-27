'use server'
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- EXISTING FUNCTIONS (Kept as is) ---

export async function getAdminStats() {
  const supabase = await createClient();
  const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: ads } = await supabase.from('ads').select('*', { count: 'exact', head: true });
  const { count: active } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda');
  return { users: users || 0, ads: ads || 0, active: active || 0, revenue: 0 };
}

export async function getAdminAds() {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*, profiles(full_name, email)').order('created_at', { ascending: false });
  return data || [];
}

export async function approveAdAdmin(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('ads').update({ status: 'yayinda' }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/listings');
  return { success: true };
}

export async function rejectAdAdmin(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('ads').update({ status: 'reddedildi' }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/listings');
  return { success: true };
}

export async function deleteAdAdmin(id: number) {
  const supabase = await createClient();
  const { data: ad } = await supabase.from('ads').select('images, image').eq('id', id).single();
  const { error } = await supabase.from('ads').delete().eq('id', id);

  if (error) return { success: false, error: error.message };

  try {
      const imagesToDelete = [];
      if (ad?.image) imagesToDelete.push(ad.image);
      if (ad?.images && Array.isArray(ad.images)) {
          ad.images.forEach((img: string) => imagesToDelete.push(img));
      }
      const paths = imagesToDelete.map(url => {
          const parts = url.split('/ads/');
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

export async function updateUserAdminAction(userId: string, data: any) {
    const supabase = await createClient();
    const { data: currentUser } = await supabase.auth.getUser();
    const { data: currentProfile } = await supabase.from('profiles').select('role').eq('id', currentUser?.user?.id).single();

    if (currentProfile?.role !== 'admin') {
        return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabase.from('profiles').update({
        full_name: data.full_name,
        role: data.role,
        status: data.status
    }).eq('id', userId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/users');
    return { success: true };
}

// --- SYSTEM SETTINGS (Updated: Removed Maintenance Mode) ---

export async function getSystemSettings() {
    const supabase = await createClient();
    const { data } = await supabase.from('system_settings').select('site_name').eq('id', 1).single();
    return data || { site_name: 'ElectronicUSA' };
}

export async function updateSystemSettings(formData: { site_name: string }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();

    if (profile?.role !== 'admin') {
        return { success: false, error: 'You do not have permission.' };
    }

    // maintenance_mode alanı çıkarıldı
    const { error } = await supabase.from('system_settings').upsert({
        id: 1,
        site_name: formData.site_name,
        updated_at: new Date().toISOString()
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    return { success: true };
}