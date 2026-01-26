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
    "\n🔧  FIXING 'MISSING PROFILE' ERROR & REGISTRATION FLOW...\n" +
    colors.reset,
);

// ---------------------------------------------------------
// 1. SERVICES UPDATE (Self-Healing Profile Logic)
// ---------------------------------------------------------
const servicesContent = `
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// --- STORAGE ---
export async function uploadImageClient(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = \`\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}.\${fileExt}\`;

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
    .or(\`buyer_id.eq.\${userId},seller_id.eq.\${userId}\`)
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
`;

// ---------------------------------------------------------
// 2. REGISTER PAGE UPDATE (Ensure Profile Creation)
// ---------------------------------------------------------
const registerPageContent = `
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanPhone = form.phone.replace(/\\s/g, '');
    const fullName = \`\${form.name} \${form.surname}\`.trim();

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: fullName,
          phone: cleanPhone,
        },
      },
    });

    if (error) {
      addToast(error.message, 'error');
    } else {
      // 2. Explicitly Create Profile (Upsert to be safe)
      if (data.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
              id: data.user.id,
              email: form.email,
              full_name: fullName,
              phone: cleanPhone,
              role: 'user',
              show_phone: false
          });

          if (profileError) {
              console.error("Profile creation failed:", profileError);
              // Don't block registration success, but log it.
          }
      }

      addToast('Registration successful! You can now login.', 'success');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 bg-[#f6f7f9] px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm w-full max-w-[500px] overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#333] mb-2 text-center">Create Account</h2>
          <form onSubmit={handleRegister} className="space-y-4 mt-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Name</label>
                <input type="text" onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Surname</label>
                <input type="text" onChange={e => setForm({...form, surname: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Mobile Phone</label>
              <input
                type="tel"
                placeholder="+1 555..."
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">* Required for communication with buyers.</p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Email</label>
              <input type="email" onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Password</label>
              <input type="password" onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none text-sm" required />
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold h-[44px] rounded-sm hover:bg-indigo-700 transition-colors shadow-sm mt-4 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[12px] text-gray-500">Already a member? </span>
            <Link href="/login" className="text-indigo-600 font-bold text-[12px] hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// ---------------------------------------------------------
// 3. SQL TRIGGER FIX (supabase/fix_profile_trigger_final.sql)
// ---------------------------------------------------------
const sqlTriggerContent = `
-- ⚠️ BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN ⚠️

-- 1. Mevcut trigger ve fonksiyonu temizle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Fonksiyonu yeniden oluştur (Daha sağlam)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'user',
    ''
  )
  ON CONFLICT (id) DO NOTHING; -- Zaten varsa hata verme
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger'ı yeniden oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Manuel Düzeltme: Profil tablosunda olmayan kullanıcıları ekle
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;
`;

const filesToWrite = [
  { path: "lib/services.ts", content: servicesContent },
  { path: "app/register/page.tsx", content: registerPageContent },
  {
    path: "supabase/fix_profile_trigger_final.sql",
    content: sqlTriggerContent,
  },
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
    "\n✅ AUTO-PROFILE CREATION ENABLED!" +
    colors.reset,
);
console.log(
  "👉 IMPORTANT: Run 'supabase/fix_profile_trigger_final.sql' in Supabase SQL Editor to fix existing users.",
);
