import React from 'react';
import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/HomeFeed";
import { getInfiniteAdsAction, getCategoryTreeServer } from "@/lib/actions";

export const revalidate = 0;

export default async function Home() {
  const { data: initialAds } = await getInfiniteAdsAction(1, 20);
  const categories = await getCategoryTreeServer();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-24">
            <Sidebar categories={categories} />
          </div>
        </aside>
        <main className="lg:col-span-9 xl:col-span-10 min-w-0">
          <HomeFeed initialAds={initialAds} />
        </main>
      </div>
    </div>
  );
}