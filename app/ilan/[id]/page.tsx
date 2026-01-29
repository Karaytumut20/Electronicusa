import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
import { createClient } from '@/lib/supabase/server';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import TechnicalSpecsTab from '@/components/AdDetail/TechnicalSpecsTab';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin, Calendar, Tag, AlertTriangle, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils'; // Import formatPrice

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return notFound();

  // --- GÜVENLİK KONTROLÜ BAŞLANGIÇ ---
  if (ad.status !== 'yayinda') {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const isOwner = user && user.id === ad.user_id;
      let isAdmin = false;

      if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role === 'admin') isAdmin = true;
      }

      if (!isOwner && !isAdmin) {
          return notFound();
      }
  }
  // --- GÜVENLİK KONTROLÜ BİTİŞ ---

  const formattedPrice = formatPrice(ad.price, ad.currency);
  const location = `${ad.city || ''}, ${ad.district || ''}`;
  const sellerInfo = ad.profiles || { full_name: 'Unknown User', phone: '', email: '', show_phone: false };
  const adImages = ad.images && ad.images.length > 0 ? ad.images : (ad.image ? [ad.image] : []);

  const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Search', href: '/search' },
      { label: 'Details' }
  ];

  const tabItems = [
     { id: 'desc', label: 'Description', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-4">{ad.description}</div> },
     { id: 'features', label: 'Features', content: <FeaturesTab ad={ad} /> },
     { id: 'location', label: 'Location', content: <LocationTab city={ad.city} district={ad.district} /> }
  ];

  if (ad.technical_specs) {
      tabItems.splice(1, 0, { id: 'tech_specs', label: 'Tech Specs', content: <TechnicalSpecsTab specs={ad.technical_specs} /> });
  }

  return (
    <div className="pb-20 relative font-sans bg-[#F8FAFC] min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={breadcrumbItems} />

        {ad.status !== 'yayinda' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-bold text-yellow-800">
                            This ad is currently {ad.status === 'onay_bekliyor' ? 'Pending Approval' : 'Inactive'}.
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                            Only you (the owner) and administrators can see this page. It is not publicly accessible.
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin size={16}/> {location}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-indigo-600 font-bold">#{ad.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              {ad.is_urgent && <Badge variant="danger" className="text-sm px-3 py-1 flex items-center gap-1"><AlertTriangle size={12}/> URGENT</Badge>}
              {ad.is_vitrin && <Badge variant="warning" className="text-sm px-3 py-1 flex items-center gap-1"><Tag size={12}/> FEATURED</Badge>}
              <LiveVisitorCount adId={ad.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image} images={adImages} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                 <p className="text-4xl font-extrabold text-indigo-700 tracking-tight">{formattedPrice}</p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>
            <Tabs items={tabItems} />
          </div>

          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar
                sellerId={ad.user_id}
                sellerName={sellerInfo.full_name || 'User'}
                sellerPhone={sellerInfo.phone || ''}
                showPhone={sellerInfo.show_phone}
                adId={ad.id}
                adTitle={ad.title}
                adImage={ad.image}
                price={formattedPrice}
                currency={ad.currency}
             />

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider border-b border-gray-50 pb-2">Details</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-slate-500 flex items-center gap-2"><Calendar size={14}/> Posted Date</span>
                        <span className="font-bold text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span>
                   </li>
                   {ad.brand && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Brand</span><span className="font-medium text-slate-900">{ad.brand}</span></li>}
                   {ad.model && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Model</span><span className="font-medium text-slate-900">{ad.model}</span></li>}
                   {ad.year && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Year</span><span className="font-medium text-slate-900">{ad.year}</span></li>}
                   <li className="flex justify-between pt-1">
                      <span className="text-slate-500 flex items-center gap-2"><Eye size={14}/> Views</span>
                      <span className="font-bold text-slate-900">{ad.view_count || 0}</span>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      </div>
      <MobileAdActionBar price={formattedPrice} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}