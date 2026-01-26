import React from 'react';
import { processors, ramOptions, screenSizes, gpuCapacities, resolutions, ssdCapacities } from '@/lib/computerData';

export default function ComputerFields({ data, onChange, categorySlug }) {
  // Event handler adaptasyonu
  const handleChange = (e) => {
    // onChange prop'u artık direkt event bekliyor (parent'taki handleDynamicChange)
    onChange(e);
  };

  const isLaptop = categorySlug?.includes('laptop');
  const isPhone = categorySlug?.includes('cep') || categorySlug?.includes('telefon');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* İŞLEMCİ */}
      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">İşlemci</label>
        <select name="processor" value={data.processor || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Seçiniz</option>
          {processors.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* RAM */}
      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">RAM</label>
        <select name="ram" value={data.ram || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Seçiniz</option>
          {ramOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* SSD */}
      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Depolama (SSD)</label>
        <select name="ssd_capacity" value={data.ssd_capacity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Seçiniz</option>
          {ssdCapacities.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* EKRAN KARTI (Sadece Bilgisayar) */}
      {!isPhone && (
        <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Ekran Kartı</label>
            <select name="gpu_capacity" value={data.gpu_capacity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
            <option value="">Seçiniz</option>
            {gpuCapacities.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>
      )}

      {/* EKRAN BOYUTU */}
      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Ekran Boyutu</label>
        <select name="screen_size" value={data.screen_size || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Seçiniz</option>
          {screenSizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ÇÖZÜNÜRLÜK */}
      <div>
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Çözünürlük</label>
        <select name="resolution" value={data.resolution || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-10 px-2 text-sm bg-white outline-none">
          <option value="">Seçiniz</option>
          {resolutions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  );
}