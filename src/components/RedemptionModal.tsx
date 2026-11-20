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
          setError(data.error || 'Failed to claim voucher');
        }
      } catch (err: any) {
        setError(err.message || 'Network error occurred');
      } finally {
        setLoading(false);
      }
    }

    claimVoucher();
  }, [offer.id]);

  const copyCode = () => {
    if (voucher?.code && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200/90 my-6 flex flex-col"
      >
        {/* Sticky Header with Explicit Close Button */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 truncate mr-3">
            <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Claimed Voucher</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>

        <div className="p-6 md:p-8 text-center">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">
                Generating your secure cryptographic voucher...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Claim Unsuccessful</h3>
              <p className="text-sm text-slate-600">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                ✕ Close Window
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
                  Voucher Ready &amp; Reserved
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
                    type="button"
                    onClick={copyCode}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm cursor-pointer"
                    title="Copy voucher code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Present this QR code or recite the code at the cash register
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

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Got it! Find in &quot;My Vouchers&quot;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
