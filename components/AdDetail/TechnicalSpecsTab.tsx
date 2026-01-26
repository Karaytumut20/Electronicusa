import React from 'react';
import { TechnicalSpecs } from '@/lib/carCatalog';

export default function TechnicalSpecsTab({ specs }: { specs: any }) {
  if (!specs) return <div className="text-gray-500 py-4">No technical data available.</div>;

  const renderSection = (title: string, data: Record<string, string>) => (
    <div className="mb-6 last:mb-0">
      <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {Object.entries(data).map(([key, value]) => (
           <div key={key} className="flex justify-between text-xs py-2 border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <span className="text-gray-500 font-medium capitalize">{key}</span>
              <span className="text-gray-900 font-bold">{value}</span>
           </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
       {/* If car specs are used, they need to be mapped. For electronics, we might display raw JSON or specific fields */}
       {/* Assuming structure matches car specs for now, but labels updated to English */}
       {specs.overview && renderSection("Overview", {
           "Production Years": specs.overview.production_years,
           "Segment": specs.overview.segment,
           "Body Type": specs.overview.body_type_detail,
           "Engine": specs.overview.engine_cylinders,
           "Power": specs.overview.power_hp,
           "Transmission": specs.overview.transmission_detail,
           "0-100 km/h": specs.overview.acceleration,
           "Top Speed": specs.overview.top_speed
       })}
    </div>
  );
}