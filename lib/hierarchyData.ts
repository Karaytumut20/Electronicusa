import { Monitor, Smartphone, Camera, Tv, Gamepad2, Plug } from 'lucide-react';

export type CategoryNode = {
  id: string;
  title: string;
  slug: string;
  icon?: any;
  subs?: CategoryNode[];
  isDynamic?: boolean;
  dynamicType?: 'computer' | 'phone';
};

export const categoryTree: CategoryNode[] = [
  {
    id: 'bilgisayar', title: 'Bilgisayar', icon: 'Monitor', slug: 'bilgisayar',
    subs: [
      { id: 'laptop', title: 'Laptop', slug: 'laptop', isDynamic: true, dynamicType: 'computer' },
      { id: 'masaustu', title: 'Masaüstü', slug: 'masaustu' },
      { id: 'tablet', title: 'Tablet', slug: 'tablet' },
      { id: 'bilesenler', title: 'Bileşenler', slug: 'bilesenler' }
    ]
  },
  {
    id: 'telefon', title: 'Telefon', icon: 'Smartphone', slug: 'telefon',
    subs: [
      { id: 'cep-telefonu', title: 'Cep Telefonu', slug: 'cep-telefonu', isDynamic: true, dynamicType: 'phone' },
      { id: 'aksesuar', title: 'Aksesuar', slug: 'telefon-aksesuar' }
    ]
  },
  {
    id: 'tv-ses', title: 'TV & Ses', icon: 'Tv', slug: 'tv-ses',
    subs: [
      { id: 'televizyon', title: 'Televizyon', slug: 'televizyon' },
      { id: 'ses-sistemi', title: 'Ses Sistemi', slug: 'ses-sistemi' }
    ]
  },
  {
    id: 'kamera', title: 'Kamera', icon: 'Camera', slug: 'kamera',
    subs: [
      { id: 'fotograf', title: 'Fotoğraf Makinesi', slug: 'fotograf-makinesi' },
      { id: 'drone', title: 'Drone', slug: 'drone' }
    ]
  },
  {
    id: 'oyun', title: 'Oyun & Konsol', icon: 'Gamepad2', slug: 'oyun',
    subs: [
      { id: 'konsol', title: 'Oyun Konsolu', slug: 'konsol' }
    ]
  }
];

// Araba verisi boşaltıldı
export const carHierarchy: Record<string, Record<string, string[]>> = {};

export const computerBrands = [
  "Apple", "Asus", "Lenovo", "HP", "Dell", "Acer", "MSI", "Monster", "Casper", "Huawei", "Samsung", "Toshiba", "Microsoft"
];

export const phoneBrands = [
  "Apple", "Samsung", "Xiaomi", "Huawei", "Oppo", "Vivo", "Realme", "Honor", "General Mobile", "Tecno"
];