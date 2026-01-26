import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/imageCompression';

const supabase = createClient();

// Helper for retrying failed requests
async function fetchWithRetry(fn: () => Promise<any>, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((res) => setTimeout(res, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}

// --- STORAGE (Optimized) ---
export async function uploadImageClient(file: File) {
  try {
    // 1. Compress Image before upload
    const compressedFile = await compressImage(file);

    const fileExt = 'jpg'; // Always convert to jpg for consistency
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('ads')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from('ads').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Upload Failed:", error);
    throw new Error("Image upload failed. Please try again.");
  }
}

// --- ADS (Safe Fetching) ---
export async function getAdsClient(searchParams?: any) {
  try {
    let query = supabase.from('ads').select('id, title, price, currency, image, city, district, created_at, is_vitrin, is_urgent').eq('status', 'yayinda');

    if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
    if (searchParams?.category) query = query.eq('category', searchParams.category);

    // Pagination limit to prevent large payload timeouts
    const { data, error } = await query.limit(20);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Ads Fetch Error:", e);
    return [];
  }
}

// --- MESSAGING (Realtime Safe) ---
export async function getConversationsClient(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, ads(id, title, image, price, currency), profiles:buyer_id(full_name), seller:seller_id(full_name)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Conversation Error:", error);
    return [];
  }
  return data;
}

export async function getMessagesClient(conversationId: number) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return data;
}

export async function sendMessageClient(conversationId: number, senderId: string, content: string) {
  // Use optimistic UI in frontend, but here ensure data integrity
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender_id: senderId, content }])
    .select()
    .single();

  if (!error) {
    // Fire and forget update (don't await to speed up response)
    supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .then();
  }

  return { data, error };
}

// ... (Other functions remain similar but using the singleton supabase instance)
// Re-exporting missing functions from previous steps to ensure no breaks
export async function getUserAdsClient(userId: string) {
    const { data } = await supabase.from('ads').select('*').eq('user_id', userId);
    return data || [];
}
export async function getFavoritesClient(userId: string) {
    const { data } = await supabase.from('favorites').select('ad_id, ads(*)').eq('user_id', userId);
    return data ? data.filter((i:any) => i.ads).map((i:any) => i.ads) : [];
}
export async function toggleFavoriteClient(userId: string, adId: number) {
    const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single();
    if(data) { await supabase.from('favorites').delete().eq('id', data.id); return false; }
    else { await supabase.from('favorites').insert([{user_id: userId, ad_id: adId}]); return true; }
}
export async function getProfileClient(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return data;
}
export async function startConversationClient(adId: number, buyerId: string, sellerId: string) {
    const { data: existing } = await supabase.from('conversations').select('*').eq('ad_id', adId).eq('buyer_id', buyerId).eq('seller_id', sellerId).maybeSingle();
    if(existing) return { data: existing, error: null };
    return await supabase.from('conversations').insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }]).select().single();
}
export async function markMessagesAsReadClient(conversationId: number, userId: string) {
    await supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', userId);
}
export async function getNotificationsClient(userId: string) {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', {ascending: false}).limit(20);
    return data || [];
}
export async function markNotificationReadClient(id: number) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}
export async function markAllNotificationsReadClient(userId: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
}
export async function createNotificationClient(userId: string, title: string, message: string) {
    await supabase.from('notifications').insert([{user_id: userId, title, message}]);
}
export async function getSavedSearchesClient(userId: string) {
    const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId);
    return data || [];
}
export async function deleteSavedSearchClient(id: number) {
    await supabase.from('saved_searches').delete().eq('id', id);
}