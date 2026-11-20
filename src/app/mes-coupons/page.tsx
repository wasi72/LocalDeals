'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/discounts';
import RedemptionModal from '@/components/RedemptionModal';

export default function MyCouponsPage() {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'favorites'>('vouchers');
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucherOffer, setSelectedVoucherOffer] = useState<any | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/offers?limit=20');
        const data = await res.json();

        if (data.offers && data.offers.length > 0) {
          // Pre-populate with first available deals for active demonstration
          const primaryOffer = data.offers[0];
          const secondaryOffer = data.offers[1] || primaryOffer;

          setVouchers([
            {
              id: 'vouch-01',
              code: 'LD-WORLD-8821',
              status: 'ACTIVE',
              expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
              offer: primaryOffer,
            },
          ]);

          if (secondaryOffer) {
            setFavorites([secondaryOffer]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-emerald-600" />
            My Vouchers &amp; Saved Deals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access all your reserved discount vouchers and favorited local savings in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-bold w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'vouchers'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Vouchers ({vouchers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">
          Loading your vouchers and saved items...
        </div>
      ) : activeTab === 'vouchers' ? (
        vouchers.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No claimed vouchers yet</h3>
            <p className="text-xs text-slate-500">
              Browse authentic local deals in your city and claim exclusive discount vouchers for free.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Explore Deals Near You
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Ready to Redeem
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {v.offer?.business?.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{v.offer?.title}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-emerald-600">
                      {formatCurrency(v.offer?.discountPriceCents || 0, v.offer?.currency || 'USD')}
                    </div>
                    {v.offer?.originalPriceCents && (
                      <div className="text-xs text-slate-400 line-through">
                        {formatCurrency(v.offer.originalPriceCents, v.offer?.currency || 'USD')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Voucher Code Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Code</div>
                    <div className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                      {v.code}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedVoucherOffer(v.offer)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Show QR Voucher</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 truncate mr-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{v.offer?.business?.address}, {v.offer?.business?.city}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Valid until {new Date(v.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Favorites */
        favorites.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No saved favorites yet</h3>
            <p className="text-xs text-slate-500">
              Click the heart icon on any deal card to save it for quick access later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-slate-800">{offer.business?.name}</span>
                    <span className="text-emerald-700 font-bold">-{offer.discountPercentage}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{offer.title}</h4>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-emerald-600">
                    {formatCurrency(offer.discountPriceCents || 0, offer.currency || 'USD')}
                  </span>
                  <Link
                    href={`/?deal=${offer.id}`}
                    className="text-xs font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1"
                  >
                    <span>View Deal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* QR Voucher Modal */}
      {selectedVoucherOffer && (
        <RedemptionModal
          offer={selectedVoucherOffer}
          onClose={() => setSelectedVoucherOffer(null)}
        />
      )}
    </div>
  );
}
