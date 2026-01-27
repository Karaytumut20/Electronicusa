import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalRoot from "@/components/ModalRoot";
import { getSystemSettings } from "@/lib/adminActions"; // Ayarları çekmek için

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace - Global İlan Platformu",
  description: "Dünyanın en büyük ilan platformu.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Veritabanından Site İsmini Çek
  const settings = await getSystemSettings();
  const siteName = settings?.site_name || 'ElectronicUSA'; // Varsayılan değer

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* Site ismini Header'a prop olarak gönder */}
            <Header siteName={siteName} />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ModalRoot />
        </Providers>
      </body>
    </html>
  );
}