"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim())
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-[70px] md:h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all">
        <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 h-full gap-4">
          {/* SOL: LOGO & MENU TOGGLE */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-200">
                E
              </div>
              <span className="font-black text-lg md:text-2xl tracking-tighter text-slate-800 hidden xs:block">
                Electronic<span className="text-indigo-600">USA</span>
              </span>
            </Link>
          </div>

          {/* ORTA: ARAMA (Masaüstü) */}
          <div className="flex-1 max-w-[500px] hidden lg:block">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Marka, model veya ürün ara..."
                className="w-full h-[46px] pl-12 pr-4 bg-slate-100 border-transparent rounded-full focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm outline-none"
              />
              <Search
                size={18}
                className="absolute left-4 top-[14px] text-slate-400 group-focus-within:text-indigo-600"
              />
            </form>
          </div>

          {/* SAĞ: AKSİYONLAR */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/post-ad"
              className="bg-indigo-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-full md:rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
            >
              <Plus size={20} />{" "}
              <span className="hidden md:inline">İlan Ver</span>
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            {!user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-indigo-600 text-sm font-bold px-2"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:block text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100"
                >
                  Kayıt Ol
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-transparent hover:border-indigo-200 transition-all overflow-hidden"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-slate-600" />
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-xs text-slate-400 font-bold uppercase">
                        Hesabım
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {user.name}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700 transition-colors"
                    >
                      Panelim
                    </Link>
                    <Link
                      href="/dashboard/my-ads"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700 transition-colors"
                    >
                      İlanlarım
                    </Link>
                    <div className="border-t border-slate-50 mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 font-bold transition-colors"
                      >
                        <LogOut size={16} /> Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBİL ARAMA ÇUBUĞU (Sadece Mobilde Logo Altında) */}
      <div className="lg:hidden bg-white px-4 pb-3 border-b border-slate-100 sticky top-[70px] z-[45]">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="w-full h-[40px] pl-10 pr-4 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <Search
            size={16}
            className="absolute left-3 top-[12px] text-slate-400"
          />
        </form>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
