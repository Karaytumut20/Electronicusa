import { Monitor, Smartphone, Camera, Tv, Gamepad2, Plug, Cpu, Laptop, Watch, Headphones, Speaker, Shield, Zap, Wifi, Disc, Keyboard, Mouse, Bot, Plane } from 'lucide-react';

export const categories = [
  {
    id: 'computing', title: 'Computing', icon: 'Monitor', slug: 'computing',
    subs: [
      { id: 'laptops', title: 'Laptops', slug: 'laptops', icon: 'Laptop' },
      { id: 'desktops', title: 'Desktops', slug: 'desktops', icon: 'Monitor' },
      { id: 'tablets', title: 'Tablets', slug: 'tablets', icon: 'Tablet' },
      { id: 'components', title: 'Components', slug: 'components', icon: 'Cpu' },
      { id: 'networking', title: 'Networking', slug: 'networking', icon: 'Wifi' }
    ]
  },
  {
    id: 'phones', title: 'Phones & Accessories', icon: 'Smartphone', slug: 'phones',
    subs: [
      { id: 'smartphones', title: 'Smartphones', slug: 'smartphones', icon: 'Smartphone' },
      { id: 'wearables', title: 'Smart Watches', slug: 'wearables', icon: 'Watch' },
      { id: 'cases', title: 'Cases & Protection', slug: 'cases', icon: 'Shield' }
    ]
  },
  {
    id: 'gaming', title: 'Gaming', icon: 'Gamepad2', slug: 'gaming',
    subs: [
      { id: 'consoles', title: 'Consoles', slug: 'consoles', icon: 'Gamepad2' },
      { id: 'games', title: 'Video Games', slug: 'games', icon: 'Disc' },
      { id: 'accessories', title: 'Accessories', slug: 'gaming-accessories', icon: 'Keyboard' }
    ]
  },
  {
    id: 'audio', title: 'TV & Audio', icon: 'Tv', slug: 'audio-video',
    subs: [
      { id: 'tvs', title: 'Televisions', slug: 'tvs', icon: 'Tv' },
      { id: 'headphones', title: 'Headphones', slug: 'headphones', icon: 'Headphones' },
      { id: 'speakers', title: 'Speakers', slug: 'speakers', icon: 'Speaker' }
    ]
  },
  {
    id: 'cameras', title: 'Cameras', icon: 'Camera', slug: 'cameras',
    subs: [
      { id: 'digital', title: 'Digital Cameras', slug: 'digital-cameras', icon: 'Camera' },
      { id: 'drones', title: 'Drones', slug: 'drones', icon: 'Plane' }
    ]
  }
];