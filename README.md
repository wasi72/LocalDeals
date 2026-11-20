# 🌍 LocalDeals — Worldwide Local Commerce & Deals Discovery Platform

> **Production-Ready Multi-Region Local Commerce Marketplace**  
> Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and cryptographic HMAC voucher verification.  
> Architecture designed with 30-year engineering rigor: Modular monolith, zero-floating-point financial math, anti-fraud voucher validation, and global multi-currency support across North America, Europe, Asia, the Middle East, and Australia.

---

## 🌐 Live Public Demonstration
- **Live Deployment URL:** [https://normal-tells-publicity-secrets.trycloudflare.com](https://normal-tells-publicity-secrets.trycloudflare.com)
- **GitHub Repository:** [https://github.com/wasi72/LocalDeals](https://github.com/wasi72/LocalDeals)
- **CI/CD Pipeline:** Fully automated GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## 🏛️ Executive Architecture & Design Rationale

LocalDeals connects customers and residents with genuine, verified promotions from independent neighborhood businesses worldwide (bakeries, ramen bars, craft pizzerias, grooming clubs, boutique gyms, day spas, and artisans).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LocalDeals Multi-Role UX                        │
├───────────────────────┬────────────────────────┬───────────────────────┤
│    Resident Portal    │   Merchant Dashboard   │   Admin Moderation    │
│  - 13,000+ Global Feed│  - KPI Analytics       │  - Offer Queue Audit  │
│  - City & Radius Geo  │  - Counter Validator   │  - Business Badging   │
│  - 1-Click Voucher    │  - Multi-Currency Deal │  - User Reports       │
│  - QR Code Generation │  - Live Math Preview   │  - Security Logs      │
└───────────┬───────────┴───────────┬────────────┴───────────┬───────────┘
            │                       │                        │
            ▼                       ▼                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Next.js 15 Server & API Layer                     │
│  - Zod Input Validation    - Anti-Tamper HMAC Signer    - Geo Engine   │
│  - Multi-Currency Math     - Role-Based Auth Guards     - Rate Guards  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Prisma ORM Persistence                          │
│  - Default: Zero-config SQLite (Instant local testing & review)        │
│  - Production: PostgreSQL / Supabase / Neon (1-line toggle)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 Worldwide Features & Engineering Choices

1. **Massive Worldwide Coverage (13,000+ Deals across 5,645 Businesses)**:
   - 🇯🇵 **Tokyo (Japan)**: 1,082 deals across Shinjuku, Shibuya, Ginza (¥ JPY)
   - 🇺🇸 **New York (USA)**: 1,083 deals across DUMBO Brooklyn, SoHo, Manhattan ($ USD)
   - 🇵🇰 **Lahore (Pakistan)**: 1,082 deals across Gulberg, DHA, Johar Town (Rs PKR)
   - 🇬🇧 **London (UK)**: 1,082 deals across Covent Garden, Mayfair, Shoreditch (£ GBP)
   - 🇫🇷 **Paris (France)**: 1,083 deals across Oberkampf, Canal Saint-Martin, Le Marais (€ EUR)
   - 🇦🇪 **Dubai (UAE)**: 1,081 deals across Downtown, Marina, JBR (د.إ AED)
   - 🇦🇺 **Sydney (Australia)**: 551 deals across Bondi Beach, Surry Hills ($ AUD)
   - 🇮🇹 **Rome (Italy)**: 558 deals across Trastevere, Centro Storico (€ EUR)
   - 🇵🇰 **Karachi (Pakistan)**: 1,081 deals across Clifton, Defence (Rs PKR)
   - 🇵🇰 **Burewala (Pakistan)**: 1,076 deals across Model Town, Grain Market (Rs PKR)
   - 🇵🇰 **Chichawatni (Pakistan)**: 1,075 deals across Main Bazaar, Railway Road (Rs PKR)

2. **Rich, Real-Time Offer Cards (`src/components/OfferCard.tsx`)**:
   - **Full Street Address**: Exact merchant address with MapPin icon.
   - **Dynamic "Open Now" / "Closed" Status**: Real-time evaluation against store opening hours with pulsing indicator.
   - **Real-Time Demand Counters**: Live social proof (`XX claimed`, `XX viewing now`).
   - **Urgency Expiry Countdown**: Dynamic pill (`Ends Tomorrow!`, `6 days left`).
   - **Direct Actions**: Quick Call button (`tel:`) and Google Maps direct navigation button.

3. **Multi-Point Modal Dismissal & Redundant Close Controls (`src/components/OfferModal.tsx`)**:
   - **Persistent Sticky Header `✕ Close` Button**: Always visible regardless of scroll depth.
   - **In-Description `✕ Close Description` Button**: Directly above the deal details.
   - **Sticky Footer `✕ Close Window` Button**: Positioned in the bottom action bar.
   - **Escape Key & Backdrop Dismissal**: Consistent across all modals.

4. **Integer-Cents Multi-Currency Math (`src/lib/discounts.ts`)**:
   - Monetary amounts (`originalPriceCents`, `discountPriceCents`) are processed strictly as integer minor units to eliminate IEEE-754 floating-point inaccuracies.
   - Supports USD (`$`), EUR (`€`), GBP (`£`), JPY (`¥`), CAD (`CA$`), AUD (`A$`), AED (`AED`), and PKR (`Rs`).
   - Enforces price transparency regulations (EU Omnibus Directive & US FTC Truth in Advertising).

5. **Tamper-Resistant Cryptographic Vouchers (`src/lib/redemptions.ts`)**:
   - Vouchers feature a human-readable code and an **HMAC-SHA256 signed QR token**.
   - Cash counter terminal prevents duplicate claims, tracks remaining quotas, and validates against counterfeit tokens.

6. **Natural English URL Routing Aliases (`next.config.mjs`)**:
   - `/my-vouchers` ➔ `/mes-coupons`
   - `/merchant` ➔ `/commercant`
   - `/terms` ➔ `/conditions-generales`
   - `/privacy` ➔ `/politique-de-confidentialite`
   - `/legal` ➔ `/mentions-legales`

---

## 🚀 Quickstart & Setup

### 1. Requirements
- Node.js 18+ (tested on Node 20 & 24)
- npm 9+

### 2. Setup & Database Sync
```bash
# Clone the repository
git clone https://github.com/wasi72/LocalDeals.git
cd LocalDeals

# Install dependencies
npm install

# Push schema to database
npm run db:push

# Seed with worldwide businesses & deals
node prisma/seed_worldwide.js
```

### 3. Run Automated Test Suite
```bash
npm test
```

### 4. Start Development / Production Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing Personas (Pre-seeded)

Use the top-right persona switcher in the navigation bar to test the three experiences:

| Persona | Name | Role | Access / Capabilities |
|---|---|---|---|
| 🏠 **Resident** | Lucas Bernard | `RESIDENT` | Browse worldwide deals, filter by city/discount, claim coupons, view QR vouchers in **My Vouchers** |
| 🏬 **Merchant** | Sal Moretti | `MERCHANT` | Sal's Brooklyn Artisan Pizzeria (NYC): KPI analytics, cash counter validator, publish deals |
| 🛡️ **Admin** | Claire Dubois | `ADMIN` | Global moderation queue, business certification badges, resident report management |

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/deploy.yml   # GitHub Actions automated build, test & DB migration pipeline
├── prisma/
│   ├── schema.prisma          # Core models (User, Business, Offer, Voucher, Report, etc.)
│   └── seed_worldwide.js      # Global multi-region database seed (13,000+ deals, 5,645 stores)
├── src/
│   ├── app/
│   │   ├── admin/page.tsx     # Admin moderation & business certification dashboard
│   │   ├── commercant/page.tsx# Merchant dashboard, KPI analytics & voucher scanner
│   │   ├── mes-coupons/page.tsx# Claimed vouchers & favorite deals
│   │   ├── api/               # Validated REST API endpoints
│   │   ├── layout.tsx         # Root layout with responsive header & footer
│   │   └── page.tsx           # Global deals discovery feed (All Offers Worldwide)
│   ├── components/            # OfferCard, OfferModal, RedemptionModal, ReportModal, Navbar, Footer
│   └── lib/                   # db, discounts, redemptions, geo, auth, cityUtils
├── test/
│   └── run-tests.js           # Automated domain, crypto & currency test suite
├── Dockerfile                 # Multi-stage production container
├── docker-compose.yml         # Container orchestration
└── next.config.mjs            # Production Next.js configuration with URL rewrites
```
