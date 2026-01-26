import { Monitor, Smartphone, Camera, Headphones, Gamepad2, Plug, Zap } from 'lucide-react';

export const categories = [
  { id: 'amazon-google', title: 'Amazon & Google', slug: 'amazon-google', icon: 'Zap', subs: [] },
  { id: 'apple', title: 'Apple', slug: 'apple', icon: 'Smartphone', subs: [] },
  { id: 'audio', title: 'Audio', slug: 'audio', icon: 'Headphones', subs: [] },
  { id: 'camera', title: 'Camera', slug: 'camera', icon: 'Camera', subs: [] },
  { id: 'computer', title: 'Computer', slug: 'computer', icon: 'Monitor', subs: [] },
  { id: 'consumer', title: 'Consumer', slug: 'consumer', icon: 'Plug', subs: [] },
  { id: 'gaming', title: 'Gaming', slug: 'gaming', icon: 'Gamepad2', subs: [] }
];

export const cities = ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Washington', 'Nevada', 'Massachusetts'];