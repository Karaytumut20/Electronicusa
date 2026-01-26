import React from 'react';
import { processors, ramOptions, screenSizes, gpuCapacities, resolutions, ssdCapacities } from '@/lib/computerData';

export default function ComputerFields({ data, onChange, categorySlug }) {
  const handleChange = (e) => { onChange(e); };
  const isPhone = categorySlug?.includes('phone') || categorySlug?.includes('smart');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Processor</label>
        <select name="processor" value={data.processor || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Select</option>
          {processors.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">RAM</label>
        <select name="ram" value={data.ram || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Select</option>
          {ramOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Storage</label>
        <select name="ssd_capacity" value={data.ssd_capacity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Select</option>
          {ssdCapacities.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!isPhone && (
        <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Graphics Card</label>
            <select name="gpu_capacity" value={data.gpu_capacity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
            <option value="">Select</option>
            {gpuCapacities.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>
      )}

      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Screen Size</label>
        <select name="screen_size" value={data.screen_size || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Select</option>
          {screenSizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Resolution</label>
        <select name="resolution" value={data.resolution || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Select</option>
          {resolutions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  );
}