import React from 'react';

export default function RealEstateFields({ data, onChange }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 space-y-4 animate-in fade-in">
      <h3 className="font-bold text-[#333] text-sm border-b border-gray-300 pb-2 mb-2">Property Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Area (m²)</label>
          <input
            type="number"
            name="m2"
            value={data.m2 || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-3 focus:border-indigo-500 outline-none text-sm"
            placeholder="Ex: 120"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Rooms</label>
          <select
            name="room"
            value={data.room || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-indigo-500 outline-none text-sm bg-white"
          >
            <option value="">Select</option>
            <option value="1+1">1+1</option>
            <option value="2+1">2+1</option>
            <option value="3+1">3+1</option>
          </select>
        </div>
      </div>
    </div>
  );
}