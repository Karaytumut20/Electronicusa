import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// --- STORAGE ---
export async function uploadImageClient(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('ads')
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from('ads').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

// --- ADS & FAVORITES ---
export async function getUserAdsClient(userId: string) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user ads:', error);
    return [];
  }
  return data;
}

export async function updateAdStatusClient(id: number, status: string) {
  return await supabase.from('ads').update({ status }).eq('id', id);
}

export async function getFavoritesClient(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('ad_id, ads(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data ? data.filter((i: any) => i.ads).map((i: any) => i.ads) : [];
}

export async function toggleFavoriteClient(userId: string, adId: number) {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('ad_id', adId)
    .single();

  if (data) {
    await supabase.from('favorites').delete().eq('id', data.id);
    return false;
  } else {
    await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }]);
    return true;
  }
}

// --- PROFILE & REVIEWS ---
export async function getProfileClient(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function getReviewsClient(targetId: string) {
  const { data } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(full_name, avatar_url)')
    .eq('target_id', targetId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addReviewClient(targetId: string, rating: number, comment: string, reviewerId: string) {
  if (targetId === reviewerId) return { error: { message: 'You cannot review yourself.' } };
  return await supabase.from('reviews').insert([{ target_id: targetId, reviewer_id: reviewerId, rating, comment }]);
}

// --- SEARCHES ---
export async function getSavedSearchesClient(userId: string) {
    const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data || [];
}

export async function deleteSavedSearchClient(id: number) {
    await supabase.from('saved_searches').delete().eq('id', id);
}

// --- MESSAGING (WITH SELF-HEALING PROFILE LOGIC) ---
export async function startConversationClient(adId: number, buyerId: string, sellerId: string) {
  try {
    // 1. Check existing
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('ad_id', adId)
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId)
      .maybeSingle();

    if (fetchError) {
        console.error("Check Conv Error:", fetchError);
        return { data: null, error: fetchError };
    }

    if (existing) return { data: existing, error: null };

    // 2. Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }])
      .select()
      .single();

    if (error) {
        // --- AUTO FIX: CREATE MISSING PROFILE ---
        // Error 23503: Foreign key violation (Key (buyer_id)=... is not present in table "profiles")
        if (error.code === '23503' && error.message.includes('profiles')) {
            console.warn("⚠️ Profile missing for user. Attempting to auto-create...");

            // Get current user info
            const { data: { user } } = await supabase.auth.getUser();

            if (user && user.id === buyerId) {
                 const { error: createProfileError } = await supabase.from('profiles').upsert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    role: 'user',
                    phone: user.user_metadata?.phone || ''
                 });

                 if (createProfileError) {
                     console.error("❌ Failed to auto-create profile:", createProfileError);
                     return { data: null, error };
                 }

                 console.log("✅ Profile auto-created. Retrying conversation...");

                 // Retry conversation creation
                 const { data: retryData, error: retryError } = await supabase
                    .from('conversations')
                    .insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }])
                    .select()
                    .single();

                 return { data: retryData, error: retryError };
            }
        }
        // --- END AUTO FIX ---

        console.error("Create Conv Error:", error);
        return { data: null, error };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("Start Conversation Exception:", err);
    return { data: null, error: err };
  }
}

export async function getConversationsClient(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, ads(id, title, image, price, currency, city, district), profiles:buyer_id(full_name), seller:seller_id(full_name)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Get Conversations Error:", error);
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
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender_id: senderId, content }])
    .select()
    .single();

  if (!error) {
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  }

  return { data, error };
}

export async function markMessagesAsReadClient(conversationId: number, userId: string) {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
}

// --- NOTIFICATIONS ---
export async function getNotificationsClient(userId: string) {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  return data || [];
}

export async function markNotificationReadClient(id: number) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}

export async function markAllNotificationsReadClient(userId: string) {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
}

export async function createNotificationClient(userId: string, title: string, message: string) {
  const { error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, title, message }]);

  if (error) console.error("Notification Error:", error);
}