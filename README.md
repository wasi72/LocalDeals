# 🌍 LocalDeals — Worldwide Local Commerce & Deals Discovery Platform

> **Production-Ready Multi-Region Local Commerce Marketplace**  
> Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and cryptographic HMAC voucher verification.  
> Architecture designed with 30-year engineering rigor: Modular monolith, zero-floating-point financial math, anti-fraud voucher validation, and global multi-currency support across North America, Europe, Asia, the Middle East, and Australia.

---

## 🌐 Live Public Demonstration
- **Live URL:** [https://newer-galaxy-doors-fuel.trycloudflare.com](https://newer-galaxy-doors-fuel.trycloudflare.com)
- **GitHub Repository:** [https://github.com/wasi72/LocalDeals](https://github.com/wasi72/LocalDeals)

---

## 🏛️ Executive Architecture & Design Rationale

LocalDeals connects customers and residents with genuine, verified promotions from independent neighborhood businesses worldwide (bakeries, ramen bars, craft pizzerias, grooming clubs, boutique gyms, day spas, and artisans).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LocalDeals Multi-Role UX                        │
├───────────────────────┬────────────────────────┬───────────────────────┤
│    Resident Portal    │   Merchant Dashboard   │   Admin Moderation    │
│  - Worldwide Feed     │  - KPI Analytics       │  - Offer Queue Audit  │
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

1. **Worldwide Cities & Coverage**:
   - 🌍 **Worldwide (All Cities)**: Shows all active offers globally.
   - 🇺🇸 **New York (USA)**: DUMBO Brooklyn, SoHo Manhattan
   - 🇬🇧 **London (UK)**: Covent Garden, Mayfair
   - 🇯🇵 **Tokyo (Japan)**: Shinjuku, Shibuya
   - 🇫🇷 **Paris (France)**: Oberkampf, Canal Saint-Martin
   - 🇩🇪 **Berlin (Germany)**: Kreuzberg, Mitte
   - 🇦🇺 **Sydney (Australia)**: Bondi Beach, Surry Hills
   - 🇦🇪 **Dubai (UAE)**: Downtown Dubai, Marina

2. **Integer-Cents Multi-Currency Math (`src/lib/discounts.ts`):**
   - Monetary amounts (`originalPriceCents`, `discountPriceCents`) are processed strictly as integer minor units to eliminate IEEE-754 floating-point inaccuracies.
   - Supports USD (`$`), EUR (`€`), GBP (`£`), JPY (`¥`), CAD (`CA$`), AUD (`A$`), and AED (`AED`).
   - Enforces price transparency regulations (EU Omnibus Directive & US FTC Truth in Advertising): Baseline prices must strictly exceed discount prices with honest declared prior prices.

3. **Tamper-Resistant Cryptographic Vouchers (`src/lib/redemptions.ts`):**
   - Vouchers feature a human-readable code (e.g., `LD-PARIS-8821`, `LD-NYC-4821`) and an **HMAC-SHA256 signed QR token**.
   - Cash counter terminal prevents duplicate claims, tracks remaining quotas, and validates against counterfeit tokens.

4. **Great-Circle Haversine Geolocation (`src/lib/geo.ts`):**
   - Calculates distance in kilometers/meters between the user's location and merchant premises anywhere on Earth without paid third-party API dependencies.

5. **Instant Persona Fast-Switcher (`src/components/Navbar.tsx`):**
   - Toggle instantly between:
     - 🏠 **Lucas Bernard** (*Resident / Customer*)
     - 🏬 **Sal Moretti** (*Merchant — NYC Brooklyn Pizza*)
     - 🛡️ **Claire Dubois** (*Global Admin & Moderator*)

---

## 🚀 Quickstart & Setup

### 1. Requirements
- Node.js 18+ (tested on Node 24)
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
npm run db:seed
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
| 🏬 **Merchant** | Sal Moretti | `MERCHANT` | Sal's Brooklyn Artisan Pizzeria (NYC): KPI analytics, cash counter validator (`LD-PARIS-8821`), publish deals |
| 🛡️ **Admin** | Claire Dubois | `ADMIN` | Global moderation queue, business certification badges, resident report management |

---

## 📁 Repository Structure

```
├── prisma/
│   ├── schema.prisma          # 9 Core models (User, Business, Offer, Redemption, etc.)
│   └── seed.js                # Worldwide seed script (NYC, London, Tokyo, Paris, Berlin, Sydney, Dubai)
├── src/
│   ├── app/
│   │   ├── admin/page.tsx     # Admin moderation & business certification dashboard
│   │   ├── commercant/page.tsx# Merchant dashboard, KPI analytics & voucher scanner
│   │   ├── mes-coupons/page.tsx# Claimed vouchers & favorite deals
│   │   ├── api/               # Validated REST API endpoints
│   │   ├── layout.tsx         # Root layout with responsive header & footer
│   │   └── page.tsx           # Global deals discovery feed (All Offers Worldwide)
│   ├── components/            # OfferCard, Modals, Navbar, Footer, CookieBanner
│   └── lib/                   # db, discounts, redemptions, geo, auth
├── test/
│   └── run-tests.js           # Automated domain, crypto & currency test suite
├── Dockerfile                 # Multi-stage production container
├── docker-compose.yml         # Container orchestration
└── vercel.json                # Vercel deployment configuration
```
