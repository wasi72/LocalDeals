import Link from 'next/link';
import { Tag, Shield, FileText, Scale, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <Tag className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Local<span className="text-emerald-400">Deals</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The ethical local commerce discovery network. Discover genuine, verified promotional discounts from trusted local merchants, artisans, and studios in your city.
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> to empower vibrant local economies worldwide
            </p>
          </div>

          {/* Resident Discover */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Explore Deals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  All Authentic Deals Near You
                </Link>
              </li>
              <li>
                <Link href="/?endingSoon=true" className="hover:text-emerald-400 transition">
                  Offers Ending Soon
                </Link>
              </li>
              <li>
                <Link href="/mes-coupons" className="hover:text-emerald-400 transition">
                  My Active Vouchers &amp; Favorites
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-emerald-400 transition">
                  Bakeries, Spas, Dining &amp; Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Pilots */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Merchants &amp; Artisans
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/commercant" className="hover:text-emerald-400 transition">
                  Merchant Dashboard
                </Link>
              </li>
              <li>
                <Link href="/commercant#scanner" className="hover:text-emerald-400 transition">
                  Scan &amp; Validate Voucher
                </Link>
              </li>
              <li>
                <Link href="/commercant#nouvelle-offre" className="hover:text-emerald-400 transition">
                  Publish Welcome Promotion
                </Link>
              </li>
              <li>
                <span className="inline-block px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-semibold mt-1">
                  Free Pilot — No Commitment
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (EU / Global regulations) */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Compliance &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mentions-legales" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Privacy Policy (GDPR)
                </Link>
              </li>
              <li>
                <Link href="/conditions-generales" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                Compliant with the <strong>EU Omnibus Directive</strong> on authentic pricing and genuine discount transparency.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LocalDeals Worldwide. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">SSL Encrypted &amp; HMAC Cryptographic Signatures</span>
            <span className="text-[11px] text-emerald-400 font-medium">● 100% Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
