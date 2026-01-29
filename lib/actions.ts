'use server'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'
import { logActivity } from '@/lib/logger'
import { AdFormData } from '@/types'
import { analyzeAdContent } from '@/lib/moderation/engine'

// --- HELPER FUNCTIONS ---
async function checkRateLimit(userId: string) {
    const supabase = await createClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', oneDayAgo);
    return (count || 0) < 10;
}

// Recursively collect slug of the target category and all its descendants
function getCategorySlugsRecursively(categories: any[], targetSlug: string): string[] {
  let slugs: string[] = [];

  function collect(cat: any) {
    slugs.push(cat.slug);
    if (cat.subs && cat.subs.length > 0) {
      cat.subs.forEach((sub: any) => collect(sub));
    }
  }

  function findAndCollect(list: any[]) {
    for (const cat of list) {
      if (cat.slug === targetSlug) {
        collect(cat);
        return true;
      }
      if (cat.subs && cat.subs.length > 0) {
        if (findAndCollect(cat.subs)) return true;
      }
    }
    return false;
  }

  findAndCollect(categories);
  return slugs;
}

// --- CREATE AD ---
export async function createAdAction(formData: Partial<AdFormData>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in.' }

  if (!(await checkRateLimit(user.id))) return { error: 'Daily ad limit reached.' };

  const validation = adSchema.safeParse(formData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const analysis = analyzeAdContent(validation.data.title, validation.data.description);

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const { data, error } = await supabase.from('ads').insert([{
    ...validation.data,
    user_id: user.id,
    status: 'onay_bekliyor',
    is_vitrin: false, is_urgent: false,
    moderation_score: analysis.score, moderation_tags: analysis.flags,
    admin_note: analysis.autoReject ? `AUTO REJECT: ${analysis.rejectReason}` : null
  }]).select('id').single()

  if (error) return { error: `Error: ${error.message}` }

  await logActivity(user.id, 'CREATE_AD', { adId: data.id, title: validation.data.title });
  if (analysis.autoReject) return { error: `Ad rejected: ${analysis.rejectReason}` };

  revalidatePath('/');
  return { success: true, adId: data.id }
}

// --- LIST ADS ---
export async function getInfiniteAdsAction(page = 1, limit = 20) {
    const supabase = await createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count, error } = await supabase
        .from('ads')
        .select('*, profiles(full_name)', { count: 'exact' })
        .eq('status', 'yayinda')
        .order('is_vitrin', { ascending: false })
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) return { data: [], total: 0, hasMore: false };
    return { data: data || [], total: count || 0, hasMore: (count || 0) > end + 1 };
}

export async function getAdsServer(searchParams: any) {
  const supabase = await createClient()
  const page = Number(searchParams?.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)', { count: 'exact' }).eq('status', 'yayinda');

  if (searchParams?.q) query = query.textSearch('fts', searchParams.q, { config: 'turkish', type: 'websearch' });
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);

  // CATEGORY FILTERING (Improved Logic)
  if (searchParams?.category) {
     // Fetch full tree to identify subcategories
     const categories = await getCategoryTreeServer();
     const slugs = getCategorySlugsRecursively(categories, searchParams.category);

     if (slugs.length > 0) {
         // Filter by the category OR any of its subcategories (using 'in' operator)
         query = query.in('category', slugs);
     } else {
         // Exact match fallback (if category not found in tree)
         query = query.eq('category', searchParams.category);
     }
  }

  if (searchParams?.brand) query = query.eq('brand', searchParams.brand);

  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('is_vitrin', { ascending: false }).order('created_at', { ascending: false });

  query = query.range(from, to);
  const { data, count, error } = await query;

  if (error) return { data: [], count: 0, totalPages: 0 };
  return { data: data || [], count: count || 0, totalPages: count ? Math.ceil(count / limit) : 0 };
}

// --- DYNAMIC CATEGORY SYSTEM (Recursive) ---
export const getCategoryTreeServer = unstable_cache(
  async () => {
    const supabase = createStaticClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('title', { ascending: true });

    if (error || !data) return [];

    // Build recursive tree to support infinite nesting
    const buildTree = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          subs: buildTree(items, item.id)
        }));
    };

    return buildTree(data, null);
  },
  ['category-tree-cache'],
  { revalidate: 3600, tags: ['categories'] }
);

export async function addCategoryAction(categoryData: { title: string, slug: string, icon: string, parent_id?: number }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('categories').insert([categoryData]).select().single();
    if (error) return { error: error.message };

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data };
}

export async function updateCategoryAction(id: number, categoryData: { title: string, slug: string, parent_id?: number }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select().single();
    if (error) return { error: error.message };

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data };
}

export async function deleteCategoryAction(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true };
}

// --- OTHER ACTIONS ---
export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}
export async function updateAdAction(id: number, formData: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update(formData).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/bana-ozel/ilanlarim');
    return { success: true };
}
export async function approveAdAction(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'yayinda' }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
export async function rejectAdAction(id: number, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'reddedildi', admin_note: reason }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
export async function deleteAdSafeAction(adId: number) {
    const supabase = await createClient();
    await supabase.from('ads').update({ status: 'pasif' }).eq('id', adId);
    revalidatePath('/bana-ozel/ilanlarim');
    return { message: 'Deleted' };
}
export async function updateProfileAction(d: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Auth error' };
    const updates = { full_name: d.full_name, phone: d.phone, avatar_url: d.avatar_url, show_phone: d.show_phone };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    return { success: !error, error: error ? error.message : null };
}
export async function updatePasswordAction(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    return { success: !error, error: error?.message };
}
export async function getMyStoreServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single();
  return data;
}
export async function createStoreAction(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Login required.' };
  const { error } = await supabase.from('stores').insert([{ ...formData, user_id: user.id }]);
  if (error) return { error: 'Error occurred.' };
  await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id);
  revalidatePath('/bana-ozel/magazam');
  return { success: true };
}
export async function updateStoreAction(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Login required.' };
  const { error } = await supabase.from('stores').update(formData).eq('user_id', user.id);
  if (error) return { error: 'Update failed.' };
  revalidatePath('/bana-ozel/magazam');
  return { success: true };
}
export async function getStoreBySlugServer(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('stores').select('*').eq('slug', slug).single();
  return data;
}
export async function getStoreAdsServer(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).eq('status', 'yayinda');
  return data || [];
}
export async function getAdFavoriteCount(adId: number) {
    const supabase = await createClient();
    const { count } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('ad_id', adId);
    return count || 0;
}
export async function getSellerReviewsServer(id: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('reviews').select('*').eq('target_user_id', id);
    return data || [];
}
export async function createReviewAction(targetId: string, rating: number, comment: string, adId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Login required' };
    await supabase.from('reviews').insert({ target_user_id: targetId, reviewer_id: user.id, rating, comment, ad_id: adId });
    return { success: true };
}
export async function getRelatedAdsServer(cat: string, id: number, price?: number) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').eq('category', cat).neq('id', id).limit(4);
    return data || [];
}
export async function incrementViewCountAction(id: number) {
    const supabase = await createClient();
    await supabase.rpc('increment_view_count', { ad_id_input: id });
}
export async function getUserDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from('ads').select('status, view_count, price').eq('user_id', user.id);
    return data || [];
}
export async function createReportAction(adId: number, reason: string, description: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('reports').insert([{ ad_id: adId, user_id: user?.id || null, reason, description }]);
    if (error) return { error: error.message };
    return { success: true };
}
export async function getAuditLogsServer() {
    const supabase = await createClient();
    const { data } = await supabase.from('audit_logs').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(100);
    return data || [];
}
export async function getAdsByIds(ids: number[]) {
    if(!ids.length) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').in('id', ids);
    return data || [];
}
export async function getPageBySlugServer(slug: string) {
    return { title: 'Corporate Page', content: '<p>Content...</p>' };
}
export async function getHelpContentServer() {
    return { categories: [], faqs: [] };
}
export async function activateDopingAction(id: number, types: string[]) { return { success: true } }
export async function getAdminStatsServer() { return { totalUsers: 0, activeAds: 0, totalRevenue: 0 }; }
export async function getLocationsServer() { return []; }
export async function getDistrictsServer(cityName: string) { return []; }
export async function getFacetCountsServer() { return []; }