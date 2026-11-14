'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Ticket,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/discounts';

interface RedemptionModalProps {
  offer: any;
  onClose: () => void;
}

export default function RedemptionModal({ offer, onClose }: RedemptionModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voucher, setVoucher] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function claimVoucher() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/offers/${offer.id}/redeem`, {
          method: 'POST',
        });
        const data = await res.json();
        if (data.success) {
          setVoucher(data.voucher);
          setQrCodeUrl(data.qrCodeUrl);
        } else {
          setError(data.error || 'Impossible de réclamer le coupon');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    }

    claimVoucher();
  }, [offer.id]);

  const copyCode = () => {
    if (voucher?.code && navigator.clipboard) {
      navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200/80 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 text-center">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">
                Génération de votre coupon sécurisé...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Échec de réclamation</h3>
              <p className="text-sm text-slate-600">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Badge */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <Ticket className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Coupon Prêt & Réservé
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {offer.business?.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {offer.title}
                </p>
              </div>

              {/* QR Code Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
                {qrCodeUrl && (
                  <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200">
                    <Image
                      src={qrCodeUrl}
                      alt="Voucher QR Code"
                      width={180}
                      height={180}
                      className="rounded-lg"
                    />
                  </div>
                )}

                {/* Code Pill */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-mono text-lg font-extrabold text-slate-900 tracking-wider bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-inner">
                    {voucher?.code}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
                    title="Copier le code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Présentez ce QR code ou dictez le code en caisse
                </span>
              </div>

              {/* Info & Location */}
              <div className="space-y-2 text-left bg-emerald-50/60 p-3.5 rounded-xl text-xs text-slate-700 border border-emerald-100">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-emerald-900">Discounted Price to Pay:</span>
                  <span className="text-emerald-700 text-sm font-bold">
                    {formatCurrency(offer.discountPriceCents || 0, offer.currency || 'USD')}
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-emerald-200/50">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{offer.business?.name}</span>
                    <div className="text-[11px] text-slate-600">
                      {offer.business?.address}, {offer.business?.city}, {offer.business?.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/50 text-[11px] text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Valid until{' '}
                    {new Date(voucher?.expiresAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Security signature note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Single-use voucher secured with cryptographic HMAC signature</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Got it! Find in &quot;My Vouchers&quot;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
