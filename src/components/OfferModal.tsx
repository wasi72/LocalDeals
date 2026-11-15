'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Phone,
  Globe,
  Clock,
  BadgeCheck,
  AlertCircle,
  Share2,
  Ticket,
  Check,
  Building,
} from 'lucide-react';
import { formatCurrency } from '@/lib/discounts';

interface OfferModalProps {
  offer: any;
  onClose: () => void;
  onRedeem: (offer: any) => void;
  onReport: (offer: any) => void;
}

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

export default function OfferModal({
  offer,
  onClose,
  onRedeem,
  onReport,
}: OfferModalProps) {
  const [copied, setCopied] = useState(false);

  if (!offer) return null;

  const currency = offer.currency || 'USD';
  const savingsCents = (offer.originalPriceCents || 0) - (offer.discountPriceCents || 0);
  const flag = COUNTRY_FLAGS[offer.business?.country] || '📍';

  const handleShare = () => {
    try {
      if (typeof window !== 'undefined' && navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(window.location.origin + `/?deal=${offer.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  // Parse opening hours
  let hours: Record<string, string> | null = null;
  if (offer.business?.openingHours) {
    try {
      hours = JSON.parse(offer.business.openingHours);
    } catch {}
  }

  const daysLabel: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200/80 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-100">
          <Image
            src={offer.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'}
            alt={offer.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-sm rounded-full shadow-lg">
              -{offer.discountPercentage}%
            </span>
            <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white font-semibold text-xs rounded-full shadow-lg">
              {offer.category?.name}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Header & Pricing */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{offer.business?.name}</span>
                {offer.business?.isVerified && (
                  <span title="Verified Business">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                )}
                <span>• {flag} {offer.business?.city}, {offer.business?.country}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                {offer.title}
              </h2>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <div className="flex items-baseline md:justify-end gap-2">
                <span className="text-2xl font-extrabold text-emerald-600">
                  {formatCurrency(offer.discountPriceCents || 0, currency)}
                </span>
                {offer.originalPriceCents && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(offer.originalPriceCents, currency)}
                  </span>
                )}
              </div>
              {savingsCents > 0 && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  You save {formatCurrency(savingsCents, currency)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Deal Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {offer.description}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Terms of Use & Redemption Conditions
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {offer.terms || 'Present this digital voucher directly at checkout. Cannot be combined with other ongoing promotions.'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Expires on {new Date(offer.endsAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {offer.redemptionLimit && (
                <div className="text-emerald-700 font-semibold">
                  {offer.redemptionCount} / {offer.redemptionLimit} vouchers claimed
                </div>
              )}
            </div>
          </div>

          {/* Business Details Card */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                Location & Merchant Information
              </h4>
              {offer.business?.siret && (
                <span className="text-[10px] text-slate-500 font-mono">
                  {offer.business.siret}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{offer.business?.name}</div>
                    <div>{offer.business?.address}</div>
                    <div>{offer.business?.city}, {offer.business?.country} {offer.business?.postcode}</div>
                  </div>
                </div>
                {offer.business?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`tel:${offer.business.phone}`} className="hover:underline">
                      {offer.business.phone}
                    </a>
                  </div>
                )}
                {offer.business?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={offer.business.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline truncate">
                      Official Website
                    </a>
                  </div>
                )}
              </div>

              {/* Hours */}
              {hours && (
                <div className="border-t md:border-t-0 md:border-l border-emerald-100 pt-2 md:pt-0 md:pl-3 space-y-1 text-[11px]">
                  <div className="font-semibold text-slate-800 mb-1">Opening Hours:</div>
                  {Object.entries(hours).map(([dayKey, val]) => (
                    <div key={dayKey} className="flex justify-between text-slate-600">
                      <span>{daysLabel[dayKey] || dayKey}:</span>
                      <span className="font-medium text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => onReport(offer)}
                className="text-xs text-slate-500 hover:text-rose-600 underline transition"
              >
                Report issue
              </button>
            </div>

            <button
              onClick={() => onRedeem(offer)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
            >
              <Ticket className="w-5 h-5" />
              <span>Claim Free Voucher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
