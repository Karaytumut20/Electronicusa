import React, { useEffect, useState } from 'react';
import {
  fuelTypes, gearTypes, vehicleStatuses, bodyTypes,
  motorPowers, engineCapacities, tractions, colors, sellerTypes, plateTypes
} from '@/lib/constants';
import { carCatalog, TechnicalSpecs } from '@/lib/carCatalog';
import { Info } from 'lucide-react';

export default function VehicleFields({ data, onChange }: any) {
  const [specs, setSpecs] = useState<TechnicalSpecs | null>(null);

  useEffect(() => {
    if (data.brand && data.series && data.model) {
        const brandData = carCatalog[data.brand];
        if (brandData) {
            const seriesData = brandData[data.series];
            if (seriesData) {
                const modelData = seriesData.find(m => m.name === data.model);
                if (modelData && modelData.specs) {
                    setSpecs(modelData.specs);
                    onChange('technical_specs', modelData.specs);
                }
            }
        }
    }
  }, [data.brand, data.series, data.model]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const renderSelect = (label: string, name: string, options: string[], required = false) => (
    <div>
      <label className="block text-[12px] font-bold text-gray-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <select
        name={name}
        value={data[name] || ''}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-indigo-500 outline-none text-sm bg-white"
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
        <h3 className="font-bold text-[#333] text-sm border-b border-gray-300 pb-2 mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Year <span className="text-red-500">*</span></label>
            <select name="year" value={data.year || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-indigo-500 outline-none text-sm bg-white">
                <option value="">Select</option>
                {Array.from({length: 40}, (_, i) => 2025 - i).map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
            </div>
            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Kilometers (KM) <span className="text-red-500">*</span></label>
            <input type="number" name="km" value={data.km || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-3 focus:border-indigo-500 outline-none text-sm" placeholder="Ex: 120000" />
            </div>
            {renderSelect("Fuel", "fuel", fuelTypes, true)}
            {renderSelect("Gear", "gear", gearTypes, true)}
            {renderSelect("Condition", "vehicle_status", vehicleStatuses)}
        </div>
      </div>
    </div>
  );
}