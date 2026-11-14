'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Clock,
  Tag,
  ArrowRight,
  Store,
  ShieldCheck,
  Percent,
  Globe2,
  Utensils,
  Scissors,
  Dumbbell,
  ShoppingBag,
  Wrench,
  Ticket,
} from 'lucide-react';
import OfferCard from '@/components/OfferCard';
import OfferModal from '@/components/OfferModal';
import RedemptionModal from '@/components/RedemptionModal';
import ReportModal from '@/components/ReportModal';
import { calculateHaversineDistanceKm, KNOWN_CITIES } from '@/lib/geo';

const CATEGORY_ICONS: Record<string, any> = {
  Utensils,
  Scissors,
  Dumbbell,
  Sparkles,
  ShoppingBag,
  Wrench,
  Ticket,
};

export default function HomePage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyEndingSoon, setOnlyEndingSoon] = useState<boolean>(false);

  // Active Modals
  const [activeOffer, setActiveOffer] = useState<any | null>(null);
  const [redeemOffer, setRedeemOffer] = useState<any | null>(null);
  const [reportOffer, setReportOffer] = useState<any | null>(null);

  // Fetch all offers
  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        const res = await fetch('/api/offers');
        const data = await res.json();
        if (data.success) {
          setOffers(data.offers);
        }
      } catch (err) {
        console.error('Failed to load offers', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  // Filter & calculate distances
  const enrichedOffers = useMemo(() => {
    const cityCoords = KNOWN_CITIES[selectedCity.toLowerCase()] || (selectedCity !== 'all' ? KNOWN_CITIES.paris : null);

    return offers.map((offer) => {
      let distanceKm: number | undefined = undefined;
      if (cityCoords && cityCoords.latitude !== 0 && offer.business?.latitude && offer.business?.longitude) {
        distanceKm = calculateHaversineDistanceKm(
          cityCoords.latitude,
          cityCoords.longitude,
          offer.business.latitude,
          offer.business.longitude
        );
      }
      return { ...offer, distanceKm };
    });
  }, [offers, selectedCity]);

  const filteredOffers = useMemo(() => {
    return enrichedOffers.filter((offer) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = offer.title.toLowerCase().includes(q);
        const matchDesc = offer.description.toLowerCase().includes(q);
        const matchBiz = offer.business?.name.toLowerCase().includes(q);
        const matchCity = offer.business?.city?.toLowerCase().includes(q);
        const matchCountry = offer.business?.country?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBiz && !matchCity && !matchCountry) return false;
      }

      // City / Worldwide Filter
      if (selectedCity !== 'all') {
        const cityKey = selectedCity.toLowerCase();
        const matchCity = offer.business?.city?.toLowerCase().includes(cityKey);
        const matchCountry = offer.business?.country?.toLowerCase().includes(cityKey);
        if (!matchCity && !matchCountry) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (offer.category?.slug !== selectedCategory) return false;
      }

      // Min discount
      if (minDiscount > 0) {
        if ((offer.discountPercentage || 0) < minDiscount) return false;
      }

      // Ending soon (in <= 7 days)
      if (onlyEndingSoon) {
        const now = new Date();
        const end = new Date(offer.endsAt);
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) return false;
      }

      return true;
    });
  }, [enrichedOffers, searchQuery, selectedCity, selectedCategory, minDiscount, onlyEndingSoon]);

  // Featured Offers
  const featuredOffers = useMemo(() => {
    return enrichedOffers.filter((o) => o.isFeatured).slice(0, 3);
  }, [enrichedOffers]);

  // Ending Soon Offers
  const endingSoonOffers = useMemo(() => {
    const now = new Date();
    return enrichedOffers
      .filter((o) => {
        const diffDays = Math.ceil((new Date(o.endsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      })
      .slice(0, 3);
  }, [enrichedOffers]);

  const cityTabs = [
    { label: '🌍 Worldwide (All Offers)', value: 'all' },
    { label: '🇺🇸 New York', value: 'New York' },
    { label: '🇬🇧 London', value: 'London' },
    { label: '🇯🇵 Tokyo', value: 'Tokyo' },
    { label: '🇫🇷 Paris', value: 'Paris' },
    { label: '🇩🇪 Berlin', value: 'Berlin' },
    { label: '🇦🇺 Sydney', value: 'Sydney' },
    { label: '🇦🇪 Dubai', value: 'Dubai' },
  ];

  const categories = [
    { label: 'All Categories', slug: 'all', icon: Tag },
    { label: 'Dining, Food & Cafes', slug: 'dining-food-cafes', icon: Utensils },
    { label: 'Beauty & Wellness', slug: 'beauty-spa-wellness', icon: Sparkles },
    { label: 'Salons & Barbershops', slug: 'hair-salons-barbershops', icon: Scissors },
    { label: 'Fitness & Movement', slug: 'fitness-yoga-movement', icon: Dumbbell },
    { label: 'Boutiques & Shops', slug: 'boutiques-specialty-shops', icon: ShoppingBag },
    { label: 'Local Services', slug: 'services-artisans', icon: Wrench },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Global Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 border-b border-slate-200/60 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide shadow-sm">
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Worldwide Local Deals Platform • Verified Independent Businesses</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Support local shops,{' '}
              <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy">
                save worldwide
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover authentic, verified promotions from independent bakeries, ramen bars, craft pizzerias, grooming clubs, and boutique gyms in top cities across the globe. Claim free digital vouchers with zero prepayments.
            </p>

            {/* Main Search & Filter Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="p-2 bg-white rounded-2xl shadow-lg border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-3 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search deals worldwide (pizza, ramen, spa, barber, gym...)"
                    className="w-full py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => setOnlyEndingSoon(!onlyEndingSoon)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      onlyEndingSoon
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ending Soon</span>
                  </button>
                </div>
              </div>

              {/* Quick discount pills */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-600" />
                  Min Discount:
                </span>
                {[0, 20, 30, 40].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setMinDiscount(pct)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      minDiscount === pct
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {pct === 0 ? 'All Discounts' : `≥ ${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Worldwide City Selector Tabs */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              Select Global Destination or View All
            </h3>
            <span className="text-xs font-semibold text-emerald-700">
              Showing {filteredOffers.length} of {offers.length} offers
            </span>
          </div>

          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {cityTabs.map((tab) => {
                const isSelected = selectedCity === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedCity(tab.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Category Pills Navigation */}
        <section id="categories" className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured Deals Section (when not deeply filtered) */}
        {!searchQuery && selectedCategory === 'all' && minDiscount === 0 && !onlyEndingSoon && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Featured Worldwide Specials
                </h2>
                <p className="text-xs text-slate-500">
                  Hand-picked, high-value promotions verified across our global hubs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  distanceKm={offer.distanceKm}
                  onSelect={(o) => setActiveOffer(o)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Ending Soon Section (if not already filtered) */}
        {!onlyEndingSoon && selectedCategory === 'all' && !searchQuery && endingSoonOffers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Ending Soon (Final Days)
                </h2>
                <p className="text-xs text-slate-500">
                  Exclusive promotions expiring in less than 7 days
                </p>
              </div>
              <button
                onClick={() => setOnlyEndingSoon(true)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
                View all expiring
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endingSoonOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  distanceKm={offer.distanceKm}
                  onSelect={(o) => setActiveOffer(o)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Deals Grid: All Offers Present */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                {selectedCity === 'all' ? 'All Offers Worldwide' : `Offers in ${selectedCity}`}
              </h2>
              <p className="text-xs text-slate-500">
                {filteredOffers.length} {filteredOffers.length > 1 ? 'promotions available' : 'promotion available'}
                {selectedCategory !== 'all' && ` in this category`}
              </p>
            </div>

            {/* Clear filters shortcut */}
            {(searchQuery || selectedCategory !== 'all' || minDiscount > 0 || onlyEndingSoon || selectedCity !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCity('all');
                  setMinDiscount(0);
                  setOnlyEndingSoon(false);
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                Reset all filters (Show All Worldwide)
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold">Loading worldwide deals...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No deals match your search criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try selecting &quot;Worldwide (All Offers)&quot; or widening your category filters to discover promotions from artisans around the globe.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  distanceKm={offer.distanceKm}
                  onSelect={(o) => setActiveOffer(o)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Merchant Pilot Promotion Banner */}
        <section className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold rounded-full uppercase tracking-wider inline-block">
              Independent Merchants Worldwide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Grow foot traffic in your local store with our 100% free pilot
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Whether you run a pizzeria in New York, a ramen shop in Tokyo, an artisan bakery in Paris, or a fitness studio in London—join LocalDeals without upfront fees or commissions. Publish a welcome special and greet new nearby customers today.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/commercant"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                <Store className="w-4 h-4" />
                <span>Open Merchant Portal</span>
              </Link>
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>0% Commission on In-Store Sales</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Offer Detail Modal */}
      {activeOffer && (
        <OfferModal
          offer={activeOffer}
          onClose={() => setActiveOffer(null)}
          onRedeem={(o) => {
            setActiveOffer(null);
            setRedeemOffer(o);
          }}
          onReport={(o) => {
            setActiveOffer(null);
            setReportOffer(o);
          }}
        />
      )}

      {/* Redemption Voucher Modal */}
      {redeemOffer && (
        <RedemptionModal
          offer={redeemOffer}
          onClose={() => setRedeemOffer(null)}
        />
      )}

      {/* Report Issue Modal */}
      {reportOffer && (
        <ReportModal
          offer={reportOffer}
          onClose={() => setReportOffer(null)}
        />
      )}
    </div>
  );
}
