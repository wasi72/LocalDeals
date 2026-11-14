'use client';

import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ReportModalProps {
  offer: any;
  onClose: () => void;
}

export default function ReportModal({ offer, onClose }: ReportModalProps) {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('PRIX_TROMPEUR');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/offers/${offer.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterEmail: email,
          reason,
          details,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Erreur lors du signalement');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200/80 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Signalement enregistré</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Merci pour votre vigilance citoyenne. Notre équipe de modération va examiner cette offre sous 24h ouvrées conformément à nos règles de transparence.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900">Signaler cette offre</h3>
            </div>
            <p className="text-xs text-slate-500">
              Offre concernée : <strong className="text-slate-700">{offer.title}</strong> ({offer.business?.name})
            </p>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Votre adresse email :</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motif du signalement :</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="PRIX_TROMPEUR">Prix barré ou remise trompeuse (Directive Omnibus)</option>
                <option value="REFUS_COMMERCANT">Le commerçant a refusé d&apos;appliquer la remise</option>
                <option value="HORAIRES_MODIFIES">Commerce fermé ou introuvable</option>
                <option value="CONTENU_INAPPROPRIE">Contenu trompeur ou inapproprié</option>
                <option value="AUTRE">Autre anomalie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Précisions (obligatoire) :</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Décrivez précisément ce qui ne correspond pas..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Envoyer le signalement</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
