import React from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Site Name</label>
            <input className="w-full border p-2 rounded-md" defaultValue="ElectronicUSA" />
        </div>
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Maintenance Mode</label>
            <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
                <span className="text-sm text-gray-600">Enable maintenance mode</span>
            </div>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700">
            <Save size={18}/> Save Changes
        </button>
      </div>
    </div>
  );
}