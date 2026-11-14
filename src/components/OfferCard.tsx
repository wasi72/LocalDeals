'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  Heart,
  BadgeCheck,
  Tag,
  ArrowRight,
  Utensils,
  Scissors,
  Dumbbell,
  Sparkles,
  ShoppingBag,
  Wrench,
  Ticket,
} from 'lucide-react';
import { formatCurrency } from '@/lib/discounts';
import { formatDistance } from '@/lib/geo';

const CATEGORY_ICONS: Record<string, any> = {
  Utensils,
  Scissors,
  Dumbbell,
  Sparkles,
  ShoppingBag,
  Wrench,
  Ticket,
};

const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  USA: '🇺🇸',
  'United Kingdom': '🇬🇧',
  UK: '🇬🇧',
  Japan: '🇯🇵',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Australia: '🇦🇺',
  'United Arab Emirates': '🇦🇪',
  UAE: '🇦🇪',
  Canada: '🇨🇦',
  Singapore: '🇸🇬',
  India: '🇮🇳',
};

interface OfferCardProps {
  offer: any;
  distanceKm?: number;
  onSelect: (offer: any) => void;
  isFavorited?: boolean;
}

export default function OfferCard({
  offer,
  distanceKm,
  onSelect,
  isFavorited = false,
}: OfferCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavLoading(true);
    try {
      const res = await fetch(`/api/offers/${offer.id}/favorite`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFavorited(data.isFavorited);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const IconComponent = CATEGORY_ICONS[offer.category?.icon] || Tag;

  // Calculate days left
  const now = new Date();
  const end = new Date(offer.endsAt);
  const diffDays = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isUrgent = diffDays <= 7;

  // Currency & savings
  const currency = offer.currency || 'USD';
  const savingsCents = (offer.originalPriceCents || 0) - (offer.discountPriceCents || 0);
  const flag = COUNTRY_FLAGS[offer.business?.country] || '📍';

  return (
    <div
      onClick={() => onSelect(offer)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Card Header & Photo */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={offer.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'}
          alt={offer.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {/* Discount Percentage Pill */}
          <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full shadow-md">
            -{offer.discountPercentage}%
          </span>

          {/* Category Pill */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md text-slate-800 font-semibold text-[11px] rounded-full shadow-sm">
            <IconComponent className="w-3 h-3 text-emerald-600" />
            {offer.category?.name}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          disabled={favLoading}
          aria-label="Save Deal"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-rose-500 hover:bg-white shadow-sm transition active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${
              favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Countdown urgency pill */}
        {isUrgent && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/95 text-white text-[11px] font-bold shadow-md">
            <Clock className="w-3 h-3" />
            {diffDays === 0 ? 'Ends Today!' : `Ends in ${diffDays} days`}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Business Name, Location & Verification */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 font-semibold text-slate-700 truncate">
              <span className="truncate">{offer.business?.name}</span>
              {offer.business?.isVerified && (
                <span title="Verified Business">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>

            {/* City & Country Flag */}
            <div className="flex items-center gap-1 shrink-0 text-slate-600 font-medium">
              <span>{flag}</span>
              <span>{distanceKm ? formatDistance(distanceKm) : offer.business?.city}</span>
            </div>
          </div>

          {/* Deal Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
            {offer.title}
          </h3>

          {/* Short terms excerpt */}
          {offer.terms && (
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-1 italic">
              « {offer.terms} »
            </p>
          )}
        </div>

        {/* Card Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-emerald-600">
                {formatCurrency(offer.discountPriceCents || 0, currency)}
              </span>
              {offer.originalPriceCents && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(offer.originalPriceCents, currency)}
                </span>
              )}
            </div>
            {savingsCents > 0 && (
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save {formatCurrency(savingsCents, currency)}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
            <span>View Deal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
