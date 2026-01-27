const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 REMOVING MAINTENANCE MODE FEATURE (FIXED)...\n" +
    colors.reset,
);

const filesToUpdate = [
  // 1. Admin Actions: Bakım modu parametresi kaldırıldı
  {
    path: "lib/adminActions.ts",
    content: `'use server'
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
`,
  },
  // 2. Admin Settings Page: Bakım modu UI'ı kaldırıldı
  {
    path: "app/admin/settings/page.tsx",
    content: `"use client";
import React, { useEffect, useState } from 'react';
import { Save, Loader2, Globe } from 'lucide-react';
import { getSystemSettings, updateSystemSettings } from '@/lib/adminActions';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
      site_name: ''
  });

  useEffect(() => {
    async function loadSettings() {
        const data = await getSystemSettings();
        if (data) {
            setSettings({
                site_name: data.site_name || 'ElectronicUSA'
            });
        }
        setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
        const res = await updateSystemSettings(settings);
        if (res.success) {
            addToast('System settings saved successfully.', 'success');
        } else {
            addToast(res.error || 'Save failed.', 'error');
        }
    } catch (err) {
        addToast('An unexpected error occurred.', 'error');
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">

        {/* Site Name */}
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Globe size={16} className="text-slate-400"/> Site Name
            </label>
            <p className="text-xs text-slate-500 mb-2">The name that appears in the browser title and logos.</p>
            <input
                value={settings.site_name}
                onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Ex: ElectronicUSA"
            />
        </div>

        <div className="pt-4 border-t border-gray-100">
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-70 transition-all shadow-md shadow-indigo-100"
            >
                {saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}
`,
  },
];

filesToUpdate.forEach((file) => {
  try {
    const filePath = path.join(process.cwd(), file.path);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " successfully updated." + colors.reset,
    );
  } catch (err) {
    console.error(colors.bold + "✘ Error: " + err.message + colors.reset);
  }
});

console.log(
  colors.green +
    "\n✅ Maintenance Mode removed from Admin Settings and Actions." +
    colors.reset,
);
