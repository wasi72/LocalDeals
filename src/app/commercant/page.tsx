'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  QrCode,
  PlusCircle,
  Eye,
  Ticket,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  BadgeCheck,
  Building,
  Loader2,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { formatCurrency, calculateDiscount } from '@/lib/discounts';

export default function MerchantDashboard() {
  const [business, setBusiness] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Voucher Scanner & Validator State
  const [voucherInput, setVoucherInput] = useState('');
  const [scannerLoading, setScannerLoading] = useState(false);
  const [scannerResult, setScannerResult] = useState<any>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  // Create Offer Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    terms: '',
    categoryId: '',
    currency: 'USD',
    originalEuros: '',
    discountEuros: '',
    redemptionLimit: '50',
    durationDays: '30',
    imageUrl: '',
  });

  // Calculate live preview math
  const origCents = Math.round(parseFloat(formData.originalEuros || '0') * 100);
  const discCents = Math.round(parseFloat(formData.discountEuros || '0') * 100);
  const mathPreview = calculateDiscount(origCents, discCents, formData.currency);

  useEffect(() => {
    async function loadMerchantData() {
      try {
        setLoading(true);
        // Load offers and categories
        const resOffers = await fetch('/api/offers');
        const dataOffers = await resOffers.json();

        // Also fetch user/business info
        // In our seed, Marc Fontaine owns Boulangerie Fontaine
        if (dataOffers.offers && dataOffers.offers.length > 0) {
          const fontaineOffer = dataOffers.offers.find((o: any) => o.business?.name.includes('Fontaine')) || dataOffers.offers[0];
          setBusiness(fontaineOffer.business);
          // Filter offers belonging to this business
          const bizOffers = dataOffers.offers.filter((o: any) => o.businessId === fontaineOffer.businessId);
          setOffers(bizOffers);
        }

        // Get unique categories
        const catMap = new Map();
        dataOffers.offers?.forEach((o: any) => {
          if (o.category) catMap.set(o.category.id, o.category);
        });
        setCategories(Array.from(catMap.values()));
        if (catMap.size > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: Array.from(catMap.values())[0].id }));
        }
      } catch (err) {
        console.error('Failed to load merchant data', err);
      } finally {
        setLoading(false);
      }
    }

    loadMerchantData();
  }, []);

  // Voucher Scanner Actions
  const handleCheckVoucher = async () => {
    if (!voucherInput.trim()) return;
    setScannerLoading(true);
    setScannerError(null);
    setScannerResult(null);

    try {
      const res = await fetch('/api/merchants/validate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: voucherInput, action: 'CHECK' }),
      });
      const data = await res.json();
      if (data.success) {
        setScannerResult(data.redemption);
      } else {
        setScannerError(data.error || 'Coupon invalide');
      }
    } catch (err: any) {
      setScannerError(err.message || 'Erreur réseau');
    } finally {
      setScannerLoading(false);
    }
  };

  const handleRedeemVoucher = async () => {
    if (!voucherInput.trim()) return;
    setScannerLoading(true);
    setScannerError(null);

    try {
      const res = await fetch('/api/merchants/validate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: voucherInput, action: 'REDEEM' }),
      });
      const data = await res.json();
      if (data.success) {
        setScannerResult(data.redemption);
      } else {
        setScannerError(data.error || 'Erreur lors de la validation');
      }
    } catch (err: any) {
      setScannerError(err.message || 'Erreur réseau');
    } finally {
      setScannerLoading(false);
    }
  };

  // Create Offer Submit
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    if (!mathPreview.isValid) {
      alert(mathPreview.validationError || 'Erreur de calcul sur le prix');
      return;
    }

    setCreateLoading(true);
    setCreateSuccess(null);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          categoryId: formData.categoryId,
          title: formData.title,
          description: formData.description,
          terms: formData.terms,
          discountType: 'FIXED_AMOUNT',
          originalPriceCents: origCents,
          discountPriceCents: discCents,
          currency: formData.currency || 'USD',
          redemptionLimit: formData.redemptionLimit ? parseInt(formData.redemptionLimit, 10) : null,
          durationDays: parseInt(formData.durationDays, 10) || 30,
          imageUrl: formData.imageUrl || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateSuccess(data.message);
        setOffers((prev) => [data.offer, ...prev]);
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess(null);
        }, 2000);
      } else {
        alert(data.error || 'Erreur lors de la création');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    } finally {
      setCreateLoading(false);
    }
  };

  // Aggregated KPIs
  const totalViews = offers.reduce((acc, o) => acc + (o.viewsCount || 0), 0);
  const totalClaims = offers.reduce((acc, o) => acc + (o.redemptionCount || 0), 0);
  const totalSavingsGenerated = offers.reduce((acc, o) => {
    const savings = ((o.originalPriceCents || 0) - (o.discountPriceCents || 0)) * (o.redemptionCount || 0);
    return acc + savings;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <Store className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {business?.name || 'Tableau de bord commerçant'}
              </h1>
              {business?.isVerified && (
                <span title="Commerce vérifié">
                  <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{business?.address}, {business?.postcode} {business?.city}</span>
              {business?.siret && <span>• SIRET : {business.siret}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            Programme Pilote Gratuit
          </span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une offre</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Offres actives</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{offers.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium">En ligne dans votre quartier</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Vues par les résidents</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalViews}</div>
          <div className="text-[11px] text-slate-500">Impressions sur la plateforme</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Coupons réclamés</span>
            <Ticket className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{totalClaims}</div>
          <div className="text-[11px] text-slate-500">Clients potentiels en boutique</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pouvoir d&apos;achat généré</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(totalSavingsGenerated)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Économies apportées aux voisins</div>
        </div>
      </div>

      {/* Voucher Scanner & Counter Validator Terminal */}
      <section id="scanner" className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              Terminal de Caisse Anti-Fraude
            </div>
            <h2 className="text-xl font-bold">Scanner ou Valider un coupon client</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Entrez le code alphanumérique (ex: <code className="text-emerald-300 font-bold">LD-PARIS-8821</code>) ou collez le token QR pour contrôler la validité en temps réel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Scanner Input Form */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-300">
              Code du coupon ou Token QR :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                placeholder="Ex: LD-PARIS-8821"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
              />
              <button
                onClick={handleCheckVoucher}
                disabled={scannerLoading || !voucherInput.trim()}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
              >
                {scannerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Vérifier</span>
              </button>
            </div>

            {/* Quick test buttons for demo */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Tester un code valide du seed :</span>
              <button
                onClick={() => setVoucherInput('LD-PARIS-8821')}
                className="text-emerald-400 hover:underline font-mono font-bold"
              >
                LD-PARIS-8821
              </button>
            </div>

            {scannerError && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-2xl text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{scannerError}</span>
              </div>
            )}
          </div>

          {/* Validation Status Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 min-h-[160px] flex flex-col justify-between">
            {scannerResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Coupon Trouvé</span>
                    <div className="font-mono text-base font-extrabold text-emerald-400">
                      {scannerResult.code}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      scannerResult.status === 'USED'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {scannerResult.status === 'USED' ? 'DÉJÀ CONSOMMÉ' : 'VALIDE & ACTIF'}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">Offre : </span>
                    <strong className="text-white">{scannerResult.offer?.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Prix à encaisser : </span>
                    <strong className="text-emerald-400 text-sm">
                      {formatCurrency(scannerResult.offer?.discountPriceCents || 0)}
                    </strong>
                    {scannerResult.offer?.originalPriceCents && (
                      <span className="text-slate-400 line-through ml-2">
                        {formatCurrency(scannerResult.offer?.originalPriceCents)}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400">Client titulaire : </span>
                    <span>{scannerResult.user?.name || scannerResult.guestEmail || 'Résident LocalDeals'}</span>
                  </div>
                </div>

                {scannerResult.status !== 'USED' && (
                  <button
                    onClick={handleRedeemVoucher}
                    disabled={scannerLoading}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Appliquer la réduction & Encaisser le client</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 space-y-2 my-auto">
                <QrCode className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Entrez un code ci-contre pour afficher les informations du bon et vérifier les droits de réduction.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers Management Table */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Vos promotions en cours</h2>
            <p className="text-xs text-slate-500">
              Gérez la visibilité, les stocks de coupons et la durée de vos offres
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter une promotion</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Titre de l&apos;offre</th>
                <th className="py-3 px-4">Prix remisé</th>
                <th className="py-3 px-4">Remise</th>
                <th className="py-3 px-4">Coupons réclamés</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Fin de validité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {offer.title}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-600">
                    {formatCurrency(offer.discountPriceCents || 0)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[11px]">
                      -{offer.discountPercentage}%
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {offer.redemptionCount} {offer.redemptionLimit ? `/ ${offer.redemptionLimit}` : ''}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        offer.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {offer.status === 'APPROVED' ? 'En ligne' : offer.status === 'PENDING_REVIEW' ? 'En modération' : offer.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    {new Date(offer.endsAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                Publier une nouvelle offre
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            {createSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{createSuccess}</h4>
                <p className="text-xs text-slate-500">Mise à jour de votre tableau de bord...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Titre de la promotion :</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Formule Déjeuner Gourmande à -30%"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie :</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Currency:</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (CA$)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="AED">AED (AED)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Regular Price:</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.originalEuros}
                      onChange={(e) => setFormData({ ...formData, originalEuros: e.target.value })}
                      placeholder="25.00"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Discount Price:</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.discountEuros}
                      onChange={(e) => setFormData({ ...formData, discountEuros: e.target.value })}
                      placeholder="15.00"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Live Discount Calculator Preview */}
                {mathPreview.isValid && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-900 font-medium">Calcul automatique (Directive Omnibus) :</span>
                    <span className="font-extrabold text-emerald-700">
                      -{mathPreview.discountPercentage}% (Économie : {mathPreview.formattedSavings})
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description détaillée :</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Précisez ce qui est inclus dans cette offre..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Conditions d&apos;utilisation :</label>
                  <input
                    type="text"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    placeholder="Ex: Valable du mardi au jeudi de 12h à 14h. Non cumulable."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre max de coupons :</label>
                    <input
                      type="number"
                      value={formData.redemptionLimit}
                      onChange={(e) => setFormData({ ...formData, redemptionLimit: e.target.value })}
                      placeholder="50"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Durée (jours) :</label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      placeholder="30"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {createLoading ? 'Publication...' : 'Soumettre pour modération'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
