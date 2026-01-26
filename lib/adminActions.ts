'use server'
import { createClient } from '@/lib/supabase/server';

export async function getAdminStats() {
  const supabase = await createClient();

  // Fetch counts safely
  const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: ads } = await supabase.from('ads').select('*', { count: 'exact', head: true });
  const { count: active } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda');

  return {
    users: users || 0,
    ads: ads || 0,
    active: active || 0,
    revenue: 15420 // Placeholder or calculate from payments table if exists
  };
}

export async function getAdminAds() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}