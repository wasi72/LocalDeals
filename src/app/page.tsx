'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  MapPin,
  X,
  Utensils,
  Scissors,
  Dumbbell,
  ShoppingBag,
  Wrench,
  Ticket,
  ChevronRight,
  Building,
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

const POPULAR_CITIES = [
  { label: '🌍 All Worldwide', city: '' },
  { label: '🇺🇸 New York', city: 'New York' },
  { label: '🇬🇧 London', city: 'London' },
  { label: '🇯🇵 Tokyo', city: 'Tokyo' },
  { label: '🇫🇷 Paris', city: 'Paris' },
  { label: '🇩🇪 Berlin', city: 'Berlin' },
  { label: '🇦🇺 Sydney', city: 'Sydney' },
  { label: '🇦🇪 Dubai', city: 'Dubai' },
];

export default function HomePage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dedicated City Input & Active City State
  const [cityInput, setCityInput] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Keyword, Category & Urgency Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyEndingSoon, setOnlyEndingSoon] = useState<boolean>(false);

  // Active Modals
  const [activeOffer, setActiveOffer] = useState<any | null>(null);
  const [redeemOffer, setRedeemOffer] = useState<any | null>(null);
  const [reportOffer, setReportOffer] = useState<any | null>(null);

  const cityInputRef = useRef<HTMLInputElement>(null);

  // Fetch deals function - supports explicit city name
  const fetchDeals = async (cityToFetch = activeCity) => {
    try {
      setLoading(true);
      const trimmed = cityToFetch.trim();
      let url = '/api/offers';
      if (trimmed && trimmed.toLowerCase() !== 'all' && trimmed.toLowerCase() !== 'worldwide') {
        url += `?city=${encodeURIComponent(trimmed)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (err) {
      console.error('Failed to load offers', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: fetch all deals worldwide
  useEffect(() => {
    fetchDeals('');
  }, []);

  // Handle City Search Form Submit
  const handleCitySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowCitySuggestions(false);
    const targetCity = cityInput.trim();
    setActiveCity(targetCity);
    fetchDeals(targetCity);
  };

  // Handle Quick City Pill Click
  const handleSelectQuickCity = (cityName: string) => {
    setCityInput(cityName);
    setActiveCity(cityName);
    setShowCitySuggestions(false);
    fetchDeals(cityName);
  };

  // Reset to Worldwide
  const handleResetToWorldwide = () => {
    setCityInput('');
    setActiveCity('');
    setSearchQuery('');
    setSelectedCategory('all');
    setMinDiscount(0);
    setOnlyEndingSoon(false);
    fetchDeals('');
  };

  // Autocomplete suggestions based on available cities
  const citySuggestions = useMemo(() => {
    const list = [
      { name: 'New York', country: 'United States', flag: '🇺🇸' },
      { name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
      { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
      { name: 'Paris', country: 'France', flag: '🇫🇷' },
      { name: 'Berlin', country: 'Germany', flag: '🇩🇪' },
      { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
      { name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪' },
    ];
    if (!cityInput.trim()) return list;
    const q = cityInput.toLowerCase();
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [cityInput]);

  // Enrich with distance if a known city coordinates match
  const enrichedOffers = useMemo(() => {
    const cityKey = activeCity.toLowerCase();
    const cityCoords = KNOWN_CITIES[cityKey] || (activeCity ? KNOWN_CITIES.paris : null);

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
  }, [offers, activeCity]);

  // Client-side category & query filtering
  const filteredOffers = useMemo(() => {
    return enrichedOffers.filter((offer) => {
      // Keyword query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = offer.title.toLowerCase().includes(q);
        const matchDesc = offer.description.toLowerCase().includes(q);
        const matchBiz = offer.business?.name.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBiz) return false;
      }

      // Category filter
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
  }, [enrichedOffers, searchQuery, selectedCategory, minDiscount, onlyEndingSoon]);

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
      {/* Global Hero & Dedicated City Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 border-b border-slate-200/60 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide shadow-sm">
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Worldwide Neighborhood Discounts • Verified Independent Businesses</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Enter any city,{' '}
              <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy">
                fetch all local deals
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Type the name of any city to discover authentic promotions from independent neighborhood bakeries, pizzerias, ramen bars, spas, and boutique fitness studios.
            </p>

            {/* Dedicated City & Deal Search Box */}
            <div className="pt-4 max-w-3xl mx-auto">
              <form
                onSubmit={handleCitySearch}
                className="relative p-2 bg-white rounded-3xl shadow-xl border border-slate-200/90 flex flex-col md:flex-row items-center gap-2"
              >
                {/* 1. Enter City Name Field */}
                <div className="relative flex-1 flex items-center gap-2.5 px-3.5 py-1.5 w-full border-b md:border-b-0 md:border-r border-slate-200">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      City Name
                    </label>
                    <input
                      ref={cityInputRef}
                      type="text"
                      value={cityInput}
                      onChange={(e) => {
                        setCityInput(e.target.value);
                        setShowCitySuggestions(true);
                      }}
                      onFocus={() => setShowCitySuggestions(true)}
                      placeholder="e.g. New York, Tokyo, London, Paris..."
                      className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  {cityInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCityInput('');
                        cityInputRef.current?.focus();
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 2. Optional Deal Keyword Field */}
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-1.5 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      What are you looking for?
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pizza, ramen, massage, hair, gym..."
                      className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 3. Action Submit Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Fetch City Deals</span>
                </button>

                {/* Autocomplete City Suggestions Dropdown */}
                {showCitySuggestions && (
                  <div className="absolute top-full left-0 right-0 md:left-2 md:w-80 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-left">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Select or Click a City</span>
                      <button
                        type="button"
                        onClick={() => setShowCitySuggestions(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectQuickCity('')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 text-slate-800 transition font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>Worldwide (All Cities)</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {citySuggestions.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelectQuickCity(c.name)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 text-slate-800 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span className="font-semibold">{c.name}</span>
                          <span className="text-[11px] text-slate-400">({c.country})</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Quick Popular City Click Pills */}
              <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Quick cities:
                </span>
                {POPULAR_CITIES.map((pill) => {
                  const isSelected = (!activeCity && !pill.city) || (activeCity.toLowerCase() === pill.city.toLowerCase());
                  return (
                    <button
                      key={pill.label}
                      onClick={() => handleSelectQuickCity(pill.city)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
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

                <button
                  onClick={() => setOnlyEndingSoon(!onlyEndingSoon)}
                  className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    onlyEndingSoon
                      ? 'bg-amber-500 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ending Soon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

        {/* Active City Filter Status Banner */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              {activeCity ? <MapPin className="w-5 h-5 text-emerald-600" /> : <Globe2 className="w-5 h-5 text-emerald-600" />}
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>
                  {activeCity ? `Offers in "${activeCity}"` : 'All Offers Worldwide'}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {filteredOffers.length} {filteredOffers.length === 1 ? 'deal found' : 'deals found'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {activeCity
                  ? `Showing all verified promotions available in ${activeCity}.`
                  : 'Displaying verified independent merchant promotions across all global hubs.'}
              </p>
            </div>
          </div>

          {activeCity && (
            <button
              onClick={handleResetToWorldwide}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Show All Worldwide Deals</span>
            </button>
          )}
        </section>

        {/* Featured Deals Section (when not filtered by city) */}
        {!activeCity && !searchQuery && selectedCategory === 'all' && minDiscount === 0 && !onlyEndingSoon && (
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
        {!onlyEndingSoon && !activeCity && selectedCategory === 'all' && !searchQuery && endingSoonOffers.length > 0 && (
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

        {/* Main Deals Grid: All Offers for the Selected City / Worldwide */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                {activeCity ? `All Offers in ${activeCity}` : 'All Offers Worldwide'}
              </h2>
              <p className="text-xs text-slate-500">
                {filteredOffers.length} {filteredOffers.length === 1 ? 'promotion available' : 'promotions available'}
                {selectedCategory !== 'all' && ` in this category`}
              </p>
            </div>

            {/* Clear filters shortcut */}
            {(searchQuery || selectedCategory !== 'all' || minDiscount > 0 || onlyEndingSoon || activeCity) && (
              <button
                onClick={handleResetToWorldwide}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                Reset all filters (Show All Worldwide)
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold">
                {activeCity ? `Fetching deals in ${activeCity}...` : 'Loading worldwide deals...'}
              </p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  {activeCity
                    ? `No active offers found in "${activeCity}" yet`
                    : 'No deals match your search criteria'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {activeCity
                    ? `We haven't launched promotions in ${activeCity} yet, or all vouchers for this city have been claimed. Try searching another city or view all worldwide deals.`
                    : 'Try selecting another city or widening your filters to discover deals.'}
                </p>
              </div>
              <button
                onClick={handleResetToWorldwide}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                <Globe2 className="w-4 h-4" />
                <span>Browse All Worldwide Offers</span>
              </button>
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
