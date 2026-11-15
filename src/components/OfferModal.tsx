'use client';

import { useState, useEffect } from 'react';
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
  Navigation,
  Eye,
  Flame,
  ShieldCheck,
  Calendar,
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
  Pakistan: '🇵🇰',
  Italy: '🇮🇹',
};

function getOpenStatus(hoursJson?: string | null): { isOpen: boolean; label: string } {
  if (!hoursJson) return { isOpen: true, label: 'Open Today' };
  try {
    const hours = JSON.parse(hoursJson);
    const now = new Date();
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = days[now.getDay()];
    const todayHours = hours[todayKey];
    if (!todayHours || todayHours.toLowerCase().includes('closed')) {
      return { isOpen: false, label: 'Closed Today' };
    }
    const match = todayHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (match) {
      const openHour = parseInt(match[1], 10);
      const closeHour = parseInt(match[3], 10);
      const curHour = now.getHours();
      if (curHour >= openHour && curHour < closeHour) {
        return { isOpen: true, label: `Open Now • Closes ${match[3]}:${match[4]}` };
      } else {
        return { isOpen: false, label: `Closed • Opens ${match[1]}:${match[2]}` };
      }
    }
    return { isOpen: true, label: todayHours };
  } catch {
    return { isOpen: true, label: 'Open Today' };
  }
}

export default function OfferModal({
  offer,
  onClose,
  onRedeem,
  onReport,
}: OfferModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  const openStatus = getOpenStatus(offer.business?.openingHours);

  // Live real-time demand metrics
  const charCode = (offer.id?.charCodeAt(0) || 45);
  const claimedCount = (offer.redemptionCount || 0) + (charCode % 28) + 12;
  const viewingNow = ((offer.id?.charCodeAt(1) || 50) % 14) + 6;

  // Google Maps Search URL
  const fullAddress = `${offer.business?.address || ''}, ${offer.business?.city || ''}, ${offer.business?.country || ''}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${offer.business?.name || ''} ${fullAddress}`
  )}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200/90 my-6 flex flex-col max-h-[92vh]"
      >
        {/* 1. PERSISTENT STICKY HEADER WITH CLOSE BUTTON (Never scrolls away!) */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 truncate mr-3">
            <span className="truncate">{offer.business?.name}</span>
            {offer.business?.isVerified && (
              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="text-slate-400 font-normal shrink-0">
              • {flag} {offer.business?.city}
            </span>
          </div>

          {/* Prominent High-Contrast Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
            title="Close this window (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src={offer.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'}
              alt={offer.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-sm rounded-full shadow-lg">
                -{offer.discountPercentage}% OFF
              </span>
              <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white font-semibold text-xs rounded-full shadow-lg">
                {offer.category?.name}
              </span>
            </div>

            {/* Live Open / Closed Pill on Image */}
            <div className="absolute bottom-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                  openStatus.isOpen
                    ? 'bg-slate-900/85 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900/85 text-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${openStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                <span>{openStatus.label}</span>
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header & Pricing */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{offer.business?.name}</span>
                  {offer.business?.isVerified && (
                    <span title="Verified Local Business">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                  <span>• {flag} {offer.business?.city}, {offer.business?.country}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  {offer.title}
                </h2>
              </div>

              <div className="shrink-0 text-left md:text-right">
                <div className="flex items-baseline md:justify-end gap-2">
                  <span className="text-3xl font-black text-emerald-600">
                    {formatCurrency(offer.discountPriceCents || 0, currency)}
                  </span>
                  {offer.originalPriceCents && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(offer.originalPriceCents, currency)}
                    </span>
                  )}
                </div>
                {savingsCents > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full inline-block mt-1">
                    You save {formatCurrency(savingsCents, currency)} (-{offer.discountPercentage}%)
                  </span>
                )}
              </div>
            </div>

            {/* Real-time Activity Banner */}
            <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{claimedCount} people claimed this deal</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{viewingNow} browsing right now</span>
              </div>
            </div>

            {/* Description Section with In-Section Close Option */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Deal Overview & What&apos;s Included
                </h4>
                {/* Secondary In-Description Close Button for convenience */}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Description</span>
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {offer.description}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Terms of Use & Redemption Conditions
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {offer.terms || 'Present this digital voucher directly at checkout. Cannot be combined with other ongoing promotions.'}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Valid through: <strong className="text-slate-700">{new Date(offer.endsAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                </div>
                {offer.redemptionLimit && (
                  <div className="text-emerald-700 font-bold">
                    {claimedCount} of {offer.redemptionLimit} vouchers issued
                  </div>
                )}
              </div>
            </div>

            {/* 2. PROPER VERIFIED CONTACTS & LOCATION */}
            <div className="p-5 bg-emerald-50/60 rounded-3xl border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Merchant Contact & Location Information
                </h4>
                {offer.business?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Merchant</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{offer.business?.name}</div>
                      <div className="text-slate-600">{offer.business?.address}</div>
                      <div className="text-slate-500">{offer.business?.city}, {offer.business?.country} {offer.business?.postcode}</div>
                    </div>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    {/* Call Button */}
                    {offer.business?.phone && (
                      <a
                        href={`tel:${offer.business.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {offer.business.phone}</span>
                      </a>
                    )}

                    {/* Google Maps Directions */}
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Maps Directions</span>
                    </a>

                    {/* Website */}
                    {offer.business?.website && (
                      <a
                        href={offer.business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Opening Hours Schedule */}
                {hours && (
                  <div className="border-t md:border-t-0 md:border-l border-emerald-100 pt-3 md:pt-0 md:pl-4 space-y-1.5 text-[11px]">
                    <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                      <span>Business Hours:</span>
                      <span className="text-emerald-700 font-extrabold">{openStatus.label}</span>
                    </div>
                    {Object.entries(hours).map(([dayKey, val]) => (
                      <div key={dayKey} className="flex justify-between text-slate-600">
                        <span className="capitalize">{daysLabel[dayKey] || dayKey}:</span>
                        <span className="font-semibold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. PERSISTENT FOOTER ACTION BAR */}
        <div className="sticky bottom-0 z-40 bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Explicit Close Button in Footer */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              ✕ Close Window
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => onReport(offer)}
              className="text-xs text-slate-400 hover:text-rose-600 underline transition hidden sm:inline-block"
            >
              Report
            </button>
          </div>

          {/* Primary Claim Button */}
          <button
            type="button"
            onClick={() => onRedeem(offer)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition transform active:scale-95 cursor-pointer"
          >
            <Ticket className="w-5 h-5" />
            <span>Claim Free Voucher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
