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
        const res = await fetch('/api/offers');
        const data = await res.json();

        if (data.offers && data.offers.length > 0) {
          // Pre-populate with Lucas's claimed voucher (Boulangerie) and favorite (Spa)
          const boulangerieOffer = data.offers.find((o: any) => o.business?.name.includes('Fontaine')) || data.offers[0];
          const spaOffer = data.offers.find((o: any) => o.business?.name.includes('Beauté')) || data.offers[1];

          setVouchers([
            {
              id: 'vouch-01',
              code: 'LD-PARIS-8821',
              status: 'ACTIVE',
              expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
              offer: boulangerieOffer,
            },
          ]);

          if (spaOffer) {
            setFavorites([spaOffer]);
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
            Mes Coupons & Favoris
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Retrouvez tous vos bons de réduction prêts à être présentés chez vos commerçants
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-bold w-fit">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'vouchers'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coupons actifs ({vouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'favorites'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Favoris sauvegardés ({favorites.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">
          Chargement de vos coupons...
        </div>
      ) : activeTab === 'vouchers' ? (
        vouchers.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Aucun coupon réclamé pour le moment</h3>
            <p className="text-xs text-slate-500">
              Explorez les offres de votre quartier pour réclamer des réductions exclusives gratuites.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Explorer les bons plans
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
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                      Prêt à être utilisé
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
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Code de réduction</div>
                    <div className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                      {v.code}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVoucherOffer(v.offer)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Afficher le QR</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{v.offer?.business?.address}, {v.offer?.business?.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Expire le {new Date(v.expiresAt).toLocaleDateString('fr-FR')}</span>
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
            <h3 className="text-base font-bold text-slate-800">Aucun bon plan favori</h3>
            <p className="text-xs text-slate-500">
              Cliquez sur le cœur d&apos;une offre pour la sauvegarder et la retrouver facilement.
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
                    <span>Voir l&apos;offre</span>
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
