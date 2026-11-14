'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Building,
  AlertTriangle,
  FileText,
  BadgeCheck,
  Tag,
  Loader2,
  History,
  Store,
  Check,
} from 'lucide-react';
import { formatCurrency } from '@/lib/discounts';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [pendingOffers, setPendingOffers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // We load all offers including pending from API
      const res = await fetch('/api/offers');
      const data = await res.json();

      // For full moderation demo, let's also fetch our seeded pending offers & businesses
      // In our seed, we seeded 1 pending offer: "Brunch du Dimanche Bio..."
      // Let's filter or fetch businesses
      if (data.offers) {
        // Unique businesses
        const bizMap = new Map();
        data.offers.forEach((o: any) => {
          if (o.business) bizMap.set(o.business.id, o.business);
        });
        setBusinesses(Array.from(bizMap.values()));
      }

      // Hardcoded/seeded reports for moderation test
      setReports([
        {
          id: 'rep-01',
          offerTitle: 'Formule Complète : Coupe de Cheveux + Taille de Barbe',
          businessName: 'Maison Barber Craft Marais',
          reporter: 'client.curieux@gmail.com',
          reason: 'HORAIRES_MODIFIES',
          details: 'Le barbier était fermé exceptionnellement jeudi après-midi sans annonce préalable.',
          status: 'PENDING',
          date: 'Il y a 2 heures',
        },
      ]);

      // Seeded pending offer for testing
      setPendingOffers([
        {
          id: 'pending-brunch-01',
          business: { name: 'Boulangerie & Pâtisserie Fontaine', city: 'Paris 11e', isVerified: true },
          title: 'Brunch du Dimanche Bio & Pâtisseries Illimitées à -35%',
          description: 'Nouvelle formule week-end artisanale : buffet sucré/salé bio, jus pressés minute et pâtisseries du jour.',
          terms: 'Dimanche de 11h à 15h. Réservation obligatoire.',
          originalPriceCents: 2800,
          discountPriceCents: 1820,
          discountPercentage: 35,
          redemptionLimit: 30,
          status: 'PENDING_REVIEW',
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModerateOffer = async (offerId: string, action: 'APPROVE' | 'REJECT') => {
    setActionLoading(offerId);
    try {
      // Simulate/call moderation API
      await new Promise((r) => setTimeout(r, 600));
      setPendingOffers((prev) => prev.filter((o) => o.id !== offerId));
      alert(`Offre ${action === 'APPROVE' ? 'validée et mise en ligne' : 'rejetée'} avec succès !`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyBusiness = async (bizId: string) => {
    setActionLoading(bizId);
    try {
      const res = await fetch(`/api/admin/businesses/${bizId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === bizId ? { ...b, isVerified: data.business.isVerified } : b))
        );
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Panneau d&apos;Administration & Modération</h1>
              <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 text-[10px] font-bold rounded-full uppercase">
                Claire Dubois (Super Admin)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supervision des commerces partenaires, validation des promotions avant publication et traitement des signalements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 font-mono">
            {pendingOffers.length} offre(s) en attente
          </span>
        </div>
      </div>

      {/* Pending Offers Review Queue */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              File de modération des nouvelles offres
            </h2>
            <p className="text-xs text-slate-500">
              Chaque offre créée par un commerçant doit être vérifiée pour garantir des prix sincères et des conditions conformes à la loi.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
            {pendingOffers.length} en attente
          </span>
        </div>

        {pendingOffers.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">Toutes les offres sont à jour !</p>
            <p className="text-[11px] text-slate-400">Aucune offre en attente de modération dans la file.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-5 bg-amber-50/40 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <strong className="text-slate-800">{offer.business?.name}</strong>
                    <span>• {offer.business?.city}</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded">
                      Soumis récemment
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{offer.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="font-bold text-emerald-700">
                      Price: {formatCurrency(offer.discountPriceCents || 0, offer.currency || 'USD')}{' '}
                      <span className="line-through text-slate-400">
                        {formatCurrency(offer.originalPriceCents || 0, offer.currency || 'USD')}
                      </span>
                    </span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      -{offer.discountPercentage}%
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Cap : {offer.redemptionLimit} coupons
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleModerateOffer(offer.id, 'REJECT')}
                    disabled={actionLoading === offer.id}
                    className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeter</span>
                  </button>
                  <button
                    onClick={() => handleModerateOffer(offer.id, 'APPROVE')}
                    disabled={actionLoading === offer.id}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                  >
                    {actionLoading === offer.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Valider & Publier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Business SIRET Verification Table */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            Vérification des commerces partenaires (SIRET / RCS)
          </h2>
          <p className="text-xs text-slate-500">
            Contrôlez l&apos;existence légale et l&apos;adresse des commerces avant de leur attribuer le badge certifié.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Commerce</th>
                <th className="py-3 px-4">Ville</th>
                <th className="py-3 px-4">N° SIRET</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Statut de vérification</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">{biz.name}</td>
                  <td className="py-4 px-4 text-slate-600">{biz.city}</td>
                  <td className="py-4 px-4 font-mono font-medium text-slate-700">
                    {biz.siret || 'En attente'}
                  </td>
                  <td className="py-4 px-4 text-slate-500">{biz.phone || '01 43 57 88 12'}</td>
                  <td className="py-4 px-4">
                    {biz.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        SIRET Validé
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium text-[11px]">
                        Non certifié
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleVerifyBusiness(biz.id)}
                      disabled={actionLoading === biz.id}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition"
                    >
                      {biz.isVerified ? 'Révoquer' : 'Certifier'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Reports Queue */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Signalements des résidents & Consommateurs
            </h2>
            <p className="text-xs text-slate-500">
              Traitement des litiges, réclamations sur les prix et horaires erronés
            </p>
          </div>
          <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
            {reports.length} signalement
          </span>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[10px]">
                    {rep.reason}
                  </span>
                  <strong className="text-slate-800">{rep.businessName}</strong>
                  <span className="text-slate-400">• {rep.date}</span>
                </div>
                <div className="font-semibold text-slate-900">{rep.offerTitle}</div>
                <p className="text-slate-600 italic">« {rep.details} »</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setReports((prev) => prev.filter((r) => r.id !== rep.id));
                    alert('Signalement classé comme résolu.');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Résoudre</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
