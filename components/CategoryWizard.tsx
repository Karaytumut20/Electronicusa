"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Monitor, Smartphone, Camera, Tv, Gamepad2, Plug, CheckCircle2, Laptop } from 'lucide-react';
import { categoryTree, computerBrands, phoneBrands } from '@/lib/hierarchyData';

const iconMap = {
  Monitor: <Monitor size={28} />,
  Smartphone: <Smartphone size={28} />,
  Camera: <Camera size={28} />,
  Tv: <Tv size={28} />,
  Gamepad2: <Gamepad2 size={28} />,
  Plug: <Plug size={28} />,
  Laptop: <Laptop size={28} />
};

export default function CategoryWizard() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [currentList, setCurrentList] = useState(categoryTree);
  const [selectedPath, setSelectedPath] = useState([]);
  const [isBrandSelection, setIsBrandSelection] = useState(false);

  const handleSelect = (item) => {
    if (item.isDynamic) {
        setIsBrandSelection(true);
        setHistory([...history, currentList]);
        setSelectedPath([...selectedPath, item.title]);

        let brands = [];
        if (item.dynamicType === 'computer') brands = computerBrands;
        if (item.dynamicType === 'phone') brands = phoneBrands;

        const brandList = brands.map(brand => ({
            id: brand,
            title: brand,
            slug: brand.toLowerCase().replace(/ /g, '-'),
            isFinal: true
        }));
        setCurrentList(brandList);
        return;
    }

    if (isBrandSelection) {
        const brand = item.title;
        const finalPath = [...selectedPath, brand].join(' > ');
        router.push(`/ilan-ver/detay?cat=${selectedPath[0]?.toLowerCase().includes('computing') ? 'laptops' : 'smartphones'}&path=${encodeURIComponent(finalPath)}&brand=${encodeURIComponent(brand)}`);
        return;
    }

    const newPath = [...selectedPath, item.title];

    if (item.subs && item.subs.length > 0) {
      setHistory([...history, currentList]);
      setCurrentList(item.subs);
      setSelectedPath(newPath);
    } else {
      router.push(`/ilan-ver/detay?cat=${item.slug}&path=${newPath.join(' > ')}`);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevList = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentList(prevList);
    setSelectedPath(selectedPath.slice(0, -1));
    if (isBrandSelection) setIsBrandSelection(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        {history.length > 0 && (
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {history.length === 0 ? 'Select Category' : selectedPath[selectedPath.length - 1] || 'Make a selection'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((item) => {
          const Icon = iconMap[item.icon] || null;
          const isLeaf = (!item.subs || item.subs.length === 0) || item.isFinal;

          return (
            <button
              key={item.id || item.title}
              onClick={() => handleSelect(item)}
              className="group relative flex items-center p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mr-4 bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                {history.length === 0 && Icon ? Icon : (isLeaf ? <CheckCircle2 size={24} className="text-green-600" /> : <div className="text-sm font-bold opacity-50">{item.title.substring(0,2).toUpperCase()}</div>)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-bold text-slate-700 group-hover:text-indigo-900 text-base mb-0.5 truncate">{item.title}</span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium">
                    {isLeaf ? 'Select' : 'View Subcategories'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}