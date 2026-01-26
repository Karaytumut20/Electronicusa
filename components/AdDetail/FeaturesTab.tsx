import React from 'react';

export default function FeaturesTab({ ad }) {
  const renderRow = (label, value) => {
    if (value === null || value === undefined || value === '') return null;
    return (
       <div className="flex justify-between border-b border-gray-100 py-3 text-sm hover:bg-gray-50 px-2 transition-colors last:border-0">
          <span className="font-semibold text-gray-600 w-1/2">{label}</span>
          <span className="text-gray-900 font-bold w-1/2 text-right">{value}</span>
       </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
       <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Technical Specifications</h4>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          {renderRow('Brand', ad.brand)}
          {renderRow('Model', ad.model)}
          {renderRow('Processor', ad.processor)}
          {renderRow('RAM', ad.ram)}
          {renderRow('Screen Size', ad.screen_size)}
          {renderRow('Graphics', ad.gpu_capacity)}
          {renderRow('Storage', ad.ssd_capacity)}
          {renderRow('Resolution', ad.resolution)}
          {renderRow('Category', ad.category)}
       </div>
    </div>
  );
}