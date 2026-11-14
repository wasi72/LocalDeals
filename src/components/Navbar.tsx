'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Tag,
  Globe2,
  Store,
  ShieldAlert,
  Ticket,
  User,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentRole?: string;
  userName?: string;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export default function Navbar({
  currentRole = 'RESIDENT',
  userName = 'Lucas Bernard',
  selectedCity = 'all',
  onCityChange,
}: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const switchRole = async (targetRole: string, email: string) => {
    setIsSwitching(true);
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole, email }),
      });
      if (res.ok) {
        setRoleDropdownOpen(false);
        router.refresh();
        if (targetRole === 'MERCHANT') router.push('/commercant');
        else if (targetRole === 'ADMIN') router.push('/admin');
        else router.push('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwitching(false);
    }
  };

  const cities = [
    { label: '🌍 Worldwide (All Offers)', value: 'all' },
    { label: '🇺🇸 New York (USA)', value: 'New York' },
    { label: '🇬🇧 London (UK)', value: 'London' },
    { label: '🇯🇵 Tokyo (Japan)', value: 'Tokyo' },
    { label: '🇫🇷 Paris (France)', value: 'Paris' },
    { label: '🇩🇪 Berlin (Germany)', value: 'Berlin' },
    { label: '🇦🇺 Sydney (Australia)', value: 'Sydney' },
    { label: '🇦🇪 Dubai (UAE)', value: 'Dubai' },
    { label: '🇨🇦 Toronto (Canada)', value: 'Toronto' },
    { label: '🇸🇬 Singapore', value: 'Singapore' },
    { label: '🇮🇹 Rome (Italy)', value: 'Rome' },
    { label: '🇺🇸 Los Angeles (USA)', value: 'Los Angeles' },
    { label: '🇺🇸 Chicago (USA)', value: 'Chicago' },
    { label: '🇪🇸 Barcelona (Spain)', value: 'Barcelona' },
    { label: '🇵🇰 Lahore (Pakistan)', value: 'Lahore' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition">
                <Tag className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Local<span className="text-emerald-600">Deals</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Worldwide Local Savings
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-medium text-slate-700 transition">
              <Globe2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (onCityChange) {
                    onCityChange(val);
                  } else {
                    router.push(val === 'all' ? '/' : `/?city=${encodeURIComponent(val)}`);
                  }
                }}
                className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition"
            >
              Explore Worldwide
            </Link>

            <Link
              href="/mes-coupons"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition"
            >
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>My Vouchers</span>
            </Link>

            <Link
              href="/commercant"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Merchant Portal</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Moderation</span>
            </Link>

            {/* Persona Fast-Switcher Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 transition"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                  {currentRole.slice(0, 1)}
                </div>
                <div className="text-left">
                  <div className="font-semibold leading-tight">{userName}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{currentRole.toLowerCase()}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    disabled={isSwitching}
                    onClick={() => switchRole('RESIDENT', 'lucas.bernard@example.com')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition ${
                      currentRole === 'RESIDENT' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Lucas Bernard</div>
                      <div className="text-[11px] text-slate-500">Global Resident / Customer</div>
                    </div>
                    {currentRole === 'RESIDENT' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    disabled={isSwitching}
                    onClick={() => switchRole('MERCHANT', 'sal@brooklynpizza.com')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition ${
                      currentRole === 'MERCHANT' && userName.includes('Sal') ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Sal Moretti</div>
                      <div className="text-[11px] text-slate-500">Merchant (NYC - Brooklyn Pizza)</div>
                    </div>
                    {currentRole === 'MERCHANT' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    disabled={isSwitching}
                    onClick={() => switchRole('ADMIN', 'admin@localdeals.com')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition ${
                      currentRole === 'ADMIN' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Claire Dubois</div>
                      <div className="text-[11px] text-slate-500">Global Admin & Moderator</div>
                    </div>
                    {currentRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold"
            >
              {currentRole}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="pb-3 border-b border-slate-100">
            <label className="text-xs font-semibold text-slate-500 block mb-1">Select Location:</label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange && onCityChange(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium"
            >
              {cities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Explore Worldwide Deals
          </Link>
          <Link
            href="/mes-coupons"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            My Claimed Vouchers
          </Link>
          <Link
            href="/commercant"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Merchant Portal & Scanner
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Global Admin & Moderation
          </Link>
        </div>
      )}
    </header>
  );
}
