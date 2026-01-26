import { Monitor, Smartphone, Camera, Tv, Gamepad2, Plug, Cpu, Laptop, Watch, Headphones, Speaker, Shield, Zap, Wifi, Disc, Keyboard, Mouse, Bot, Plane } from 'lucide-react';

export const categories = [
  {
    id: 'bilgisayar', title: 'Bilgisayar', icon: 'Monitor', slug: 'bilgisayar',
    subs: [
      { id: 'laptop', title: 'Laptop / Notebook', slug: 'laptop', icon: 'Laptop' },
      { id: 'masaustu', title: 'Masaüstü PC', slug: 'masaustu', icon: 'Monitor' },
      { id: 'tablet', title: 'Tablet', slug: 'tablet', icon: 'Tablet' },
      { id: 'bilesenler', title: 'PC Bileşenleri', slug: 'bilesenler', icon: 'Cpu' },
      { id: 'ekipman', title: 'Oyuncu Ekipmanları', slug: 'oyuncu-ekipman', icon: 'Keyboard' }
    ]
  },
  {
    id: 'telefon', title: 'Telefon & Aksesuar', icon: 'Smartphone', slug: 'telefon',
    subs: [
      { id: 'cep', title: 'Cep Telefonu', slug: 'cep-telefonu', icon: 'Smartphone' },
      { id: 'giyilebilir', title: 'Akıllı Saat', slug: 'giyilebilir', icon: 'Watch' },
      { id: 'kilif', title: 'Kılıf & Koruyucu', slug: 'kilif', icon: 'Shield' }
    ]
  },
  {
    id: 'oyun', title: 'Oyun & Konsol', icon: 'Gamepad2', slug: 'oyun',
    subs: [
      { id: 'konsol', title: 'Oyun Konsolları', slug: 'konsol', icon: 'Gamepad2' },
      { id: 'oyunlar', title: 'Oyunlar', slug: 'video-oyun', icon: 'Disc' }
    ]
  },
  {
    id: 'tv-ses', title: 'TV & Ses', icon: 'Tv', slug: 'tv-ses',
    subs: [
      { id: 'tv', title: 'Televizyon', slug: 'televizyon', icon: 'Tv' },
      { id: 'kulaklik', title: 'Kulaklık', slug: 'kulaklik', icon: 'Headphones' },
      { id: 'hoparlor', title: 'Hoparlör', slug: 'hoparlor', icon: 'Speaker' }
    ]
  },
  {
    id: 'kamera', title: 'Kamera', icon: 'Camera', slug: 'kamera',
    subs: [
      { id: 'dslr', title: 'Dijital Kamera', slug: 'dslr', icon: 'Camera' },
      { id: 'drone', title: 'Drone', slug: 'drone', icon: 'Plane' }
    ]
  },
  {
    id: 'akilli-ev', title: 'Akıllı Ev', icon: 'Zap', slug: 'akilli-ev',
    subs: [
        { id: 'robot', title: 'Robot Süpürge', slug: 'robot-supurge', icon: 'Bot' }
    ]
  }
];

export const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Kocaeli', 'Adana', 'Eskişehir'];