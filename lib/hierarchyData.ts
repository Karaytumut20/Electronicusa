import { Monitor, Smartphone, Camera, Tv, Gamepad2 } from 'lucide-react';

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
    id: 'computing', title: 'Computing', icon: 'Monitor', slug: 'computing',
    subs: [
      { id: 'laptops', title: 'Laptops', slug: 'laptops', isDynamic: true, dynamicType: 'computer' },
      { id: 'desktops', title: 'Desktops', slug: 'desktops' },
      { id: 'tablets', title: 'Tablets', slug: 'tablets' },
      { id: 'components', title: 'PC Components', slug: 'components' }
    ]
  },
  {
    id: 'phones', title: 'Phones', icon: 'Smartphone', slug: 'phones',
    subs: [
      { id: 'smartphones', title: 'Smartphones', slug: 'smartphones', isDynamic: true, dynamicType: 'phone' },
      { id: 'accessories', title: 'Accessories', slug: 'cases' }
    ]
  },
  {
    id: 'gaming', title: 'Gaming', icon: 'Gamepad2', slug: 'gaming',
    subs: [
      { id: 'consoles', title: 'Consoles', slug: 'consoles' }
    ]
  }
];

export const carHierarchy: Record<string, Record<string, string[]>> = {};

export const computerBrands = [
  "Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Razer", "Microsoft", "Samsung", "Toshiba"
];

export const phoneBrands = [
  "Apple", "Samsung", "Google", "OnePlus", "Motorola", "Xiaomi", "Sony", "Nokia"
];