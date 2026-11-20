'use client';

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const consent = window.localStorage.getItem('ld_cookie_consent');
        if (!consent) {
          setShow(true);
        }
      }
    } catch {
      // Storage access may be restricted in private/sandbox mode
    }
  }, []);

  const handleAccept = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('ld_cookie_consent', 'accepted');
      }
    } catch {}
    setShow(false);
  };

  const handleRefuse = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('ld_cookie_consent', 'essential_only');
      }
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Privacy &amp; Data Protection</p>
            <p className="mt-0.5">
              LocalDeals uses essential cookies to remember your selected city, saved vouchers, and preferences. 
              No third-party advertising trackers are used without your consent.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handleRefuse}
            className="flex-1 md:flex-initial px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 md:flex-initial px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
