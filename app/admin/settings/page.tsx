"use client";
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