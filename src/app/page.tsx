'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  RotateCcw,
  Loader2,
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
  { label: '🇨🇦 Toronto', city: 'Toronto' },
  { label: '🇸🇬 Singapore', city: 'Singapore' },
  { label: '🇮🇹 Rome', city: 'Rome' },
  { label: '🇪🇸 Barcelona', city: 'Barcelona' },
  { label: '🇵🇰 Lahore', city: 'Lahore' },
  { label: '🇺🇸 Los Angeles', city: 'Los Angeles' },
];

const KNOWN_SUGGESTIONS = [
  { name: 'New York', country: 'United States', flag: '🇺🇸' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { name: 'Paris', country: 'France', flag: '🇫🇷' },
  { name: 'Berlin', country: 'Germany', flag: '🇩🇪' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Toronto', country: 'Canada', flag: '🇨🇦' },
  { name: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { name: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { name: 'Los Angeles', country: 'United States', flag: '🇺🇸' },
  { name: 'Chicago', country: 'United States', flag: '🇺🇸' },
  { name: 'San Francisco', country: 'United States', flag: '🇺🇸' },
  { name: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { name: 'Madrid', country: 'Spain', flag: '🇪🇸' },
  { name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { name: 'Lahore', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Karachi', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Mumbai', country: 'India', flag: '🇮🇳' },
  { name: 'Melbourne', country: 'Australia', flag: '🇦🇺' },
  { name: 'Vienna', country: 'Austria', flag: '🇦🇹' },
  { name: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
  { name: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { name: 'São Paulo', country: 'Brazil', flag: '🇧🇷' },
];

export default function HomePage() {
  const router = useRouter();

  // Master cache of all worldwide offers
  const [worldwideOffers, setWorldwideOffers] = useState<any[]>([]);
  // Current active offers displayed
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  // Dedicated City State
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
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Core Server Fetch: queries /api/offers with optional city parameter
  const fetchDealsFromServer = useCallback(async (cityName = '', background = false) => {
    try {
      if (!background) {
        setLoading(true);
      }
      setIsSearchingCity(true);

      const trimmed = cityName.trim();
      let url = '/api/offers';
      if (trimmed && trimmed.toLowerCase() !== 'all' && trimmed.toLowerCase() !== 'worldwide') {
        url += `?city=${encodeURIComponent(trimmed)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.offers)) {
        setOffers(data.offers);
        // If this was a full worldwide fetch, save as master cache
        if (!trimmed) {
          setWorldwideOffers(data.offers);
        }
      }
    } catch (err) {
      console.error('Failed to load offers from server', err);
    } finally {
      setLoading(false);
      setIsSearchingCity(false);
    }
  }, []);

  // Initial load: parse URL query ?city=... if present, else fetch all worldwide
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialCity = params.get('city');
      if (initialCity && initialCity.toLowerCase() !== 'all') {
        setCityInput(initialCity);
        setActiveCity(initialCity);
        fetchDealsFromServer(initialCity, false);
        return;
      }
    }
    fetchDealsFromServer('', false);
  }, [fetchDealsFromServer]);

  // Handle clicking outside suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setShowCitySuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced auto-fetch as the user types into cityInput
  const handleCityInputChange = (val: string) => {
    setCityInput(val);
    setShowCitySuggestions(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = val.trim();
    if (!trimmed) {
      // Input cleared: immediately restore worldwide offers
      setActiveCity('');
      if (worldwideOffers.length > 0) {
        setOffers(worldwideOffers);
      } else {
        fetchDealsFromServer('', true);
      }
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      return;
    }

    // After 400ms pause, automatically query server for the entered city
    debounceTimerRef.current = setTimeout(() => {
      setActiveCity(trimmed);
      fetchDealsFromServer(trimmed, true);
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/?city=${encodeURIComponent(trimmed)}`);
      }
    }, 450);
  };

  // Explicit Trigger search by city (Form submit or Enter key or Button click)
  const handleCitySearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setShowCitySuggestions(false);
    const target = cityInput.trim();
    setActiveCity(target);
    fetchDealsFromServer(target, false);

    if (typeof window !== 'undefined') {
      const url = target ? `/?city=${encodeURIComponent(target)}` : '/';
      window.history.pushState({}, '', url);
    }
  };

  // Quick Select a City (Pills or Suggestions)
  const handleSelectCity = (cityName: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setCityInput(cityName);
    setActiveCity(cityName);
    setShowCitySuggestions(false);
    fetchDealsFromServer(cityName, false);

    if (typeof window !== 'undefined') {
      const url = cityName ? `/?city=${encodeURIComponent(cityName)}` : '/';
      window.history.pushState({}, '', url);
    }
  };

  // Reset to Worldwide
  const handleResetToWorldwide = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setCityInput('');
    setActiveCity('');
    setSearchQuery('');
    setSelectedCategory('all');
    setMinDiscount(0);
    setOnlyEndingSoon(false);
    setShowCitySuggestions(false);

    if (worldwideOffers.length > 0) {
      setOffers(worldwideOffers);
    } else {
      fetchDealsFromServer('', false);
    }

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  // Autocomplete suggestions
  const citySuggestions = useMemo(() => {
    if (!cityInput.trim()) return KNOWN_SUGGESTIONS;
    const q = cityInput.toLowerCase();
    return KNOWN_SUGGESTIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [cityInput]);

  // Real-time client-side matching across current offers
  const liveCityFilteredOffers = useMemo(() => {
    const filterQuery = cityInput.trim().toLowerCase();

    // If city input is empty, return whatever offers were returned for activeCity or worldwide
    if (!filterQuery || filterQuery === 'all' || filterQuery === 'worldwide') {
      return offers;
    }

    // If typing, first check if current offers contain matches
    const matched = offers.filter((offer) => {
      const c = offer.business?.city?.toLowerCase() || '';
      const country = offer.business?.country?.toLowerCase() || '';
      const address = offer.business?.address?.toLowerCase() || '';
      const postcode = offer.business?.postcode?.toLowerCase() || '';
      return (
        c.includes(filterQuery) ||
        country.includes(filterQuery) ||
        address.includes(filterQuery) ||
        postcode.includes(filterQuery)
      );
    });

    // If matched has items, show them immediately; otherwise return current offers (server fetch in progress)
    return matched.length > 0 ? matched : offers;
  }, [offers, cityInput]);

  // Calculate distance relative to active city
  const enrichedOffers = useMemo(() => {
    const cityKey = (activeCity || cityInput).trim().toLowerCase();
    const cityCoords = KNOWN_CITIES[cityKey] || null;

    return liveCityFilteredOffers.map((offer) => {
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
  }, [liveCityFilteredOffers, activeCity, cityInput]);

  // Combined filters: keyword search, category, discount, urgency
  const finalFilteredOffers = useMemo(() => {
    return enrichedOffers.filter((offer) => {
      // Keyword query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = offer.title?.toLowerCase().includes(q);
        const matchDesc = offer.description?.toLowerCase().includes(q);
        const matchBiz = offer.business?.name?.toLowerCase().includes(q);
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
    return finalFilteredOffers.filter((o) => o.isFeatured).slice(0, 3);
  }, [finalFilteredOffers]);

  // Ending Soon Offers
  const endingSoonOffers = useMemo(() => {
    const now = new Date();
    return finalFilteredOffers
      .filter((o) => {
        const diffDays = Math.ceil((new Date(o.endsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      })
      .slice(0, 3);
  }, [finalFilteredOffers]);

  const categories = [
    { label: 'All Categories', slug: 'all', icon: Tag },
    { label: 'Dining, Food & Cafes', slug: 'dining-food-cafes', icon: Utensils },
    { label: 'Beauty & Wellness', slug: 'beauty-spa-wellness', icon: Sparkles },
    { label: 'Salons & Barbershops', slug: 'hair-salons-barbershops', icon: Scissors },
    { label: 'Fitness & Movement', slug: 'fitness-yoga-movement', icon: Dumbbell },
    { label: 'Boutiques & Shops', slug: 'boutiques-specialty-shops', icon: ShoppingBag },
    { label: 'Local Services', slug: 'services-artisans', icon: Wrench },
  ];

  const currentDisplayCity = cityInput.trim() || activeCity.trim();

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
              Type the name of any city in the world to instantly discover and fetch authentic promotions from independent neighborhood bakeries, pizzerias, ramen bars, spas, and boutique fitness studios.
            </p>

            {/* Dedicated City & Deal Search Form */}
            <div className="pt-4 max-w-3xl mx-auto">
              <form
                onSubmit={handleCitySearchSubmit}
                className="relative p-2 bg-white rounded-3xl shadow-xl border border-slate-200/90 flex flex-col md:flex-row items-center gap-2"
              >
                {/* 1. Enter City Name Field with Real-Time Fetching */}
                <div className="relative flex-1 flex items-center gap-2.5 px-3.5 py-2 w-full border-b md:border-b-0 md:border-r border-slate-200">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Enter City Name
                      </label>
                      {isSearchingCity && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Fetching...</span>
                        </span>
                      )}
                    </div>
                    <input
                      ref={cityInputRef}
                      type="text"
                      value={cityInput}
                      onChange={(e) => handleCityInputChange(e.target.value)}
                      onFocus={() => setShowCitySuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCitySearchSubmit();
                        }
                      }}
                      placeholder="e.g. New York, Tokyo, London, Paris, Rome, Lahore..."
                      className="w-full text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  {cityInput && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCityInputChange('');
                        cityInputRef.current?.focus();
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                      title="Clear city input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 2. Optional Deal Keyword Field */}
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      What are you looking for?
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pizza, ramen, coffee, massage, gym..."
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
                  className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition transform active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {isSearchingCity ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Fetch City Deals</span>
                </button>

                {/* Autocomplete City Suggestions Dropdown */}
                {showCitySuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 md:left-2 md:w-80 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-left max-h-80 overflow-y-auto"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Click to Fetch City Deals</span>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowCitySuggestions(false);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectCity('');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 text-slate-800 transition font-bold"
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
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectCity(c.name);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 text-slate-800 transition text-left"
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
                  const isSelected =
                    (!currentDisplayCity && !pill.city) ||
                    (currentDisplayCity.toLowerCase() === pill.city.toLowerCase());
                  return (
                    <button
                      key={pill.label}
                      onClick={() => handleSelectCity(pill.city)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
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

              {/* Quick discount pills & ending soon */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-600" />
                  Min Discount:
                </span>
                {[0, 20, 30, 40].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setMinDiscount(pct)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
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
                  className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    onlyEndingSoon
                      ? 'bg-amber-500 text-white shadow-sm'
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
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
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
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              {currentDisplayCity ? <MapPin className="w-5 h-5 text-emerald-600" /> : <Globe2 className="w-5 h-5 text-emerald-600" />}
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                <span>
                  {currentDisplayCity ? `Active City: "${currentDisplayCity}"` : 'Active Location: Worldwide (All Offers)'}
                </span>
                {isSearchingCity ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Fetching live deals...</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {finalFilteredOffers.length} {finalFilteredOffers.length === 1 ? 'deal available' : 'deals available'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentDisplayCity
                  ? `Displaying verified promotions fetched for "${currentDisplayCity}".`
                  : 'Displaying promotions across all verified global independent businesses.'}
              </p>
            </div>
          </div>

          {currentDisplayCity && (
            <button
              onClick={handleResetToWorldwide}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Show All Worldwide Deals</span>
            </button>
          )}
        </section>

        {/* Featured Deals Section (when not deeply filtered) */}
        {!currentDisplayCity && !searchQuery && selectedCategory === 'all' && minDiscount === 0 && !onlyEndingSoon && (
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
        {!onlyEndingSoon && !currentDisplayCity && selectedCategory === 'all' && !searchQuery && endingSoonOffers.length > 0 && (
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
                className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
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

        {/* Main Grid: All Active / City-Filtered Deals */}
        <section id="offers" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Store className="w-6 h-6 text-emerald-600" />
                {currentDisplayCity
                  ? `Local Deals in ${currentDisplayCity}`
                  : 'All Verified Worldwide Neighborhood Deals'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {currentDisplayCity
                  ? `Explore verified local deals available in ${currentDisplayCity}.`
                  : 'Guaranteed minimum 20% discount with no fake markups or hidden fees.'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-600">
                Fetching authentic deals{currentDisplayCity ? ` for ${currentDisplayCity}` : ''}...
              </p>
            </div>
          ) : finalFilteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  distanceKm={offer.distanceKm}
                  onSelect={(o) => setActiveOffer(o)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {currentDisplayCity
                    ? `No deals currently found for "${currentDisplayCity}"`
                    : 'No offers match your criteria'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {currentDisplayCity
                    ? `We are expanding rapidly. Try another city name, select one of the popular hubs below, or explore all worldwide offers.`
                    : 'Try relaxing your search terms, choosing a different category, or lowering the minimum discount.'}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handleResetToWorldwide}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  Explore All Worldwide Deals
                </button>
                {['New York', 'London', 'Tokyo', 'Paris', 'Rome', 'Dubai', 'Sydney'].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSelectCity(c)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Trust & Guarantee Banner */}
        <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent & Protected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Honest neighborhood savings, zero subscription traps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every business is verified with real local credentials. Discounts are locked in native currency with integer-cents accuracy and tamper-resistant cryptographic QR vouchers. Pay directly at the cash counter upon redemption.
            </p>
          </div>
        </section>
      </div>

      {/* Detail, Redemption & Report Modals */}
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

      {redeemOffer && (
        <RedemptionModal
          offer={redeemOffer}
          onClose={() => setRedeemOffer(null)}
        />
      )}

      {reportOffer && (
        <ReportModal
          offer={reportOffer}
          onClose={() => setReportOffer(null)}
        />
      )}
    </div>
  );
}
