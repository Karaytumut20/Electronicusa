const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 AUTH TIME FIX VE ADMIN KATEGORİ YÖNETİMİ EKLENİYOR...\n" +
    colors.reset,
);

const filesToUpdate = [
  // 1. AuthContext: Timeout süresi artırıldı (10sn) ve hata yönetimi iyileştirildi
  {
    path: "context/AuthContext.tsx",
    content: `"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'store' | 'admin';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = async (sessionUser: any) => {
      try {
        const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();

        if (error) {
            console.warn("Profil çekilemedi (İlk giriş olabilir):", error.message);
        }

        setUser({
            id: sessionUser.id,
            email: sessionUser.email!,
            name: profile?.full_name || sessionUser.email?.split('@')[0] || 'Kullanıcı',
            avatar: profile?.avatar_url,
            role: profile?.role || 'user'
        });
      } catch (err) {
          console.error("fetchProfile hatası:", err);
          // Hata durumunda temel kullanıcı verisiyle devam et
          setUser({
            id: sessionUser.id,
            email: sessionUser.email!,
            name: sessionUser.email?.split('@')[0] || 'Kullanıcı',
            role: 'user'
          });
      }
  };

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        // Timeout 10 saniyeye çıkarıldı
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 10000));
        const sessionPromise = supabase.auth.getSession();

        const { data: { session } } : any = await Promise.race([sessionPromise, timeoutPromise]);

        if (session?.user && mounted) {
          await fetchProfile(session.user);
        }
      } catch (error) {
        console.warn("Auth Check Warning:", error);
        // Hata olsa bile kullanıcıyı null set ederek uygulamanın açılmasını sağla
        if(mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
         await fetchProfile(session.user);
      } else {
        setUser(null);
        router.refresh();
      }
      setLoading(false);
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await fetchProfile(session.user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
`,
  },
  // 2. AdminSidebar: Categories linki eklendi
  {
    path: "components/AdminSidebar.tsx",
    content: `"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, List, CreditCard, Settings, FileText, LogOut, ShieldAlert, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Listings', href: '/admin/listings', icon: List },
    { label: 'Categories', href: '/admin/categories', icon: Tag }, // EKLENDİ
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Moderation', href: '/admin/moderation', icon: ShieldAlert },
    { label: 'System Logs', href: '/admin/logs', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#1e293b] min-h-screen text-white flex flex-col fixed left-0 top-0 h-full z-50 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
          <span className="bg-indigo-600 px-2 py-1 rounded text-sm">ADMIN</span>
          Panel
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 \${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }\`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full px-4 py-2 text-sm font-bold transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
`,
  },
  // 3. Admin Categories Page: Kategorileri ve alt kategorileri ekleme sayfası
  {
    path: "app/admin/categories/page.tsx",
    content: `"use client";
import React, { useState, useEffect } from 'react';
import { addCategoryAction, getCategoryTreeServer } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Plus, FolderPlus, Loader2, Tag, ChevronRight } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [newCat, setNewCat] = useState({ title: '', slug: '', icon: 'Tag', parent_id: '' });

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    setLoading(true);
    const data = await getCategoryTreeServer();
    setCategories(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Parent ID boş string ise undefined gönderelim
    const payload = {
        ...newCat,
        parent_id: newCat.parent_id ? Number(newCat.parent_id) : undefined
    };

    const res = await addCategoryAction(payload);
    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('Kategori başarıyla eklendi.', 'success');
        setNewCat({ title: '', slug: '', icon: 'Tag', parent_id: '' });
        refreshCategories();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Kategori Yönetimi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* EKLEME FORMU */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-indigo-900"><Plus size={18}/> Yeni Kategori / Alt Kategori</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Başlık</label>
                    <input
                        value={newCat.title}
                        onChange={e => setNewCat({...newCat, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')})}
                        className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-indigo-500"
                        placeholder="Örn: Gaming Laptop" required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">URL Slug (Otomatik)</label>
                    <input value={newCat.slug} readOnly className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded-md text-sm text-slate-500" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600">Üst Kategori (Opsiyonel)</label>
                    <select
                        value={newCat.parent_id}
                        onChange={e => setNewCat({...newCat, parent_id: e.target.value})}
                        className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-indigo-500 bg-white"
                    >
                        <option value="">-- Ana Kategori Olarak Ekle --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Eğer bir alt kategori ekliyorsanız (Örn: Computer &gt; Laptop), buradan üst kategoriyi seçin.</p>
                </div>
                <button disabled={submitting} className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-bold flex justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={18}/> : <FolderPlus size={18}/>} Kaydet
                </button>
            </form>
        </div>

        {/* KATEGORİ LİSTESİ */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-slate-700">Mevcut Kategori Yapısı</div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
                {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-indigo-600"/></div> : (
                    <div className="space-y-3">
                        {categories.map(cat => (
                            <div key={cat.id} className="border border-gray-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <Tag size={16} className="text-indigo-600"/> {cat.title}
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal">{cat.slug}</span>
                                </div>

                                {cat.subs && cat.subs.length > 0 && (
                                    <div className="mt-3 ml-6 pl-4 border-l-2 border-indigo-100 space-y-2">
                                        {cat.subs.map((sub: any) => (
                                            <div key={sub.id} className="flex items-center gap-2 text-xs text-slate-600">
                                                <ChevronRight size={12} className="text-gray-400"/>
                                                <span className="font-medium">{sub.title}</span>
                                                <span className="text-[9px] text-gray-400">({sub.slug})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(!cat.subs || cat.subs.length === 0) && (
                                    <p className="text-[10px] text-gray-400 ml-8 mt-1 italic">Alt kategori yok</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
`,
  },
];

filesToUpdate.forEach((file) => {
  try {
    const filePath = path.join(process.cwd(), file.path);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " güncellendi." + colors.reset,
    );
  } catch (err) {
    console.error(colors.bold + "✘ Hata: " + err.message + colors.reset);
  }
});

console.log(
  colors.green +
    "\n✅ Auth sorunu çözüldü ve Admin paneline 'Categories' menüsü eklendi." +
    colors.reset,
);
