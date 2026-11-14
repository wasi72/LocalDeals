# LocalDeals: Architecture & Business Blueprint

This document contains the foundational product blueprint extracted from the strategy conversation.
The entire codebase implements these technical specifications, database schema, redemption logic, and legal frameworks.

See the production implementation:
- Database Schema: `prisma/schema.prisma`
- Financial Engine & Omnibus Math: `src/lib/discounts.ts`
- Cryptographic Voucher Redemption: `src/lib/redemptions.ts`
- Geolocation Proximity: `src/lib/geo.ts`
- Resident Portal: `src/app/page.tsx`
- Merchant Dashboard & Counter Validator: `src/app/commercant/page.tsx`
- Admin Moderation & SIRET Verification: `src/app/admin/page.tsx`
- Legal & Compliance (LCEN, RGPD, Omnibus): `src/app/mentions-legales`, `src/app/politique-de-confidentialite`, `src/app/conditions-generales`

---

# LocalDeals: Complete A–Z Business and Software Development Blueprint

<text color="secondary" size="sm">Product strategy · UX/UI · Software architecture · Business model · Launch plan · Growth</text>

My recommendation is to build **LocalDeals as a mobile-first local savings platform for France**, starting with one town or neighbourhood and expanding only after you prove that residents use it and local businesses are willing to pay.

The biggest mistake would be to build a huge app with hundreds of features before you have any real offers. The professional approach is to solve one simple problem exceptionally well:

> “Show me the best genuine deals near me, tell me exactly how to use them, and help me save money today.”

The platform should make life easier for two groups:

- **Residents:** Find useful discounts without searching dozens of websites or social media pages.
- **Local businesses:** Attract nearby customers without needing marketing expertise or a large advertising budget.

I'll treat this as a real business that you could build, test, launch, and potentially grow—not just a programming project.

<box gap={2}>
  <AsyncImage query="premium modern local deals discovery mobile app UI design French neighborhood cafe bakery barber discounts map clean white interface green accents" aspectRatio="16:9" width="100%" radius="xl" />
  <grid columns={2} gap={2}>
    <grid-item>
      <box border radius="lg" padding={3} gap={1}>
        <icon name="users" size="xl" />
        <title size="lg">For residents</title>
        <text color="secondary" size="sm">Discover nearby offers, save favourites, and redeem deals.</text>
      </box>
    </grid-item>
    <grid-item>
      <box border radius="lg" padding={3} gap={1}>
        <icon name="store" size="xl" />
        <title size="lg">For businesses</title>
        <text color="secondary" size="sm">Publish promotions and measure customer interest.</text>
      </box>
    </grid-item>
  </grid>
</box>

## 1. Define the business properly

**Working name:** LocalDeals

**Product type:** Local offers marketplace and discovery platform.

**Initial format:** Responsive website / Progressive Web App (PWA). Users can open it in their mobile browser and optionally install it on their home screen. You don't need native iOS and Android apps on day one.

**Initial market:** One compact area in France, such as Argenteuil and selected nearby neighbourhoods, if that is the area you want to target.

**Initial categories:**

- Restaurants, cafés and bakeries
- Barbers, hairdressers and beauty salons
- Fitness, sports and leisure
- Tutoring and local classes
- Repair services and other neighbourhood businesses

Start with two or three categories where you can personally recruit businesses and verify their offers. You can expand later.

### The business proposition

| Audience | Main problem | LocalDeals solution |
|---|---|---|
| Residents | Offers are scattered across social media, flyers and websites | One searchable local directory |
| Shop owners | Advertising is expensive or difficult to manage | Simple promotion publishing and local visibility |
| Platform owner | Needs revenue without charging every visitor | Business subscriptions and optional promoted placements |

**Your competitive advantage should not be “we have discounts.”** Other services already offer promotions. Your advantage should be *verified offers from genuinely nearby independent businesses, presented in a simpler and more useful way*.

Don't promise that every offer is the cheapest in town unless you can substantiate it.

---

## 2. Design the user journey before coding

A professional product begins with the user experience, not the database.

<box border radius="xl" padding={3} gap={3}>
  <title size="lg">Resident journey</title>
  <list connector="solid" marker="number" gap={2}>
    <list-item>**Open LocalDeals**

      No forced account creation. Show relevant offers immediately.
    </list-item>
    <list-item>**Choose an area**

      Search by town or postcode, or allow location access with permission.
    </list-item>
    <list-item>**Discover offers**

      Browse nearby deals, categories, expiry dates, and useful filters.
    </list-item>
    <list-item>**Open a deal**

      See the normal price, deal price, terms, validity, address and redemption method.
    </list-item>
    <list-item>**Redeem the offer**

      Show a code, coupon, or clearly worded instructions to present at the shop.
    </list-item>
    <list-item>**Return and save**

      Save favourite businesses, share offers, and opt into relevant alerts.
    </list-item>
  </list>
  <divider color="subtle" />
  <title size="lg">Business journey</title>
  <list connector="solid" marker="number" gap={2}>
    <list-item>Register a business and verify contact details.</list-item>
    <list-item>Create an offer with price, dates, terms and a photo.</list-item>
    <list-item>Submit it for review or verification.</list-item>
    <list-item>Publish after approval.</list-item>
    <list-item>Track views, saves, clicks and redemptions where measurable.</list-item>
  </list>
</box>

### Golden UX rule

A resident should be able to find a relevant deal and understand how to redeem it in under 30 seconds. Avoid pop-ups, mandatory sign-ups, confusing coupon rules, and fake countdown timers.

## 3. Plan the website screens

You need three experiences: the resident website, the business dashboard, and the administrator dashboard.

<box gap={3}>
  <row align="start" gap={3}>
    <AsyncImage query="modern mobile ecommerce deals discovery homepage UI mockup nearby offers search categories discount cards white background green accent mobile app" aspectRatio="3:4" maxWidth="145px" />
    <box flex="1" gap={1}>
      **Screen 1 — Home / Discover**

      - Search: “What are you looking for?”
      - Location selector
      - Categories displayed as icons
      - “Near you” and “Ending soon” sections
      - Offer cards with real prices and clear savings
      - Bottom navigation: Explore, Map, Saved, Profile
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <AsyncImage query="mobile app discount coupon detail screen UI product photo original price sale price redeem offer button address opening hours terms and conditions clean modern design" aspectRatio="3:4" maxWidth="145px" />
    <box flex="1" gap={1}>
      **Screen 2 — Offer details**

      Every deal needs:
      - Offer title and business name
      - Normal price and offer price
      - Discount percentage or savings amount
      - Expiry date and applicable hours
      - Exact conditions and exclusions
      - Address, directions and redemption instructions
      - A clear “Redeem offer” action
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <AsyncImage query="modern desktop SaaS merchant dashboard UI analytics offer management create promotion form clean white sidebar green accent" aspectRatio="4:3" maxWidth="145px" />
    <box flex="1" gap={1}>
      **Screen 3 — Business dashboard**

      Business owners should be able to:
      - Create, edit and pause offers
      - Upload a logo and photos
      - Set start/end dates and redemption limits
      - View offer performance
      - Manage business details
      - Upgrade or cancel a subscription
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <AsyncImage query="admin moderation dashboard web app table pending business offers approve reject status management interface" aspectRatio="4:3" maxWidth="145px" />
    <box flex="1" gap={1}>
      **Screen 4 — Admin dashboard**

      Only authorized administrators can:
      - Verify businesses
      - Approve, reject or remove offers
      - Review user reports
      - Suspend abusive accounts
      - View subscriptions and platform statistics
      - Record moderation decisions
    </box>
  </row>
</box>

## 4. Make it genuinely user-friendly

Use these as design requirements rather than optional polish.

| Area | Professional requirement |
|---|---|
| Navigation | Keep the main navigation short and consistent |
| Search | Support business name, category, town and postcode |
| Filters | Distance, category, discount, expiry and availability |
| Offer cards | Use readable text, real photos and visible validity dates |
| Accessibility | Keyboard support, screen-reader labels, strong contrast and scalable text |
| Speed | Compress images, lazy-load below-the-fold content and avoid excessive scripts |
| Mobile | Design for small screens first, then adapt to desktop |
| Trust | Display verification status, full conditions and reporting options |
| Empty states | If no offers exist, suggest another category or a wider search area |
| Errors | Explain what went wrong and how to recover |
| Privacy | Don't request precise location or an account unless the feature needs it |

### Suggested offer card

<box border radius="xl" padding={3} gap={2}>
  <row align="start" gap={3}>
    <AsyncImage query="fresh croissant and cappuccino on a cafe table French bakery cafe photography" aspectRatio="4:5" maxWidth="120px" radius="lg" />
    <box flex="1" gap={1}>
      <badge color="success">Illustrative example</badge>
      <title size="lg">Coffee + croissant</title>
      <text color="secondary" size="sm">Example local café · 0.8 km away</text>
      <row align="center" gap={2}>
        <title size="xl" color="success">€4.00</title>
        <text color="secondary"><strikethrough>€5.50</strikethrough></text>
      </row>
      <text weight="medium">Save €1.50 · 27% off</text>
      <text size="sm">Valid weekdays until 11:00, while available.</text>
      <box background="surface-secondary" radius="md" padding={2} align="center">
        <text weight="medium" size="sm">View offer</text>
      </box>
    </box>
  </row>
  <text color="secondary" size="xs">Illustrative offer only—not a real participating business or live discount.</text>
</box>

**Important:** The normal price, offer price, savings and discount percentage must be calculated consistently. If the original price is €5.50 and the offer is €4.00, the saving is €1.50 and the discount is approximately 27.3%. Never let business owners enter contradictory figures without validation.

## 5. Decide the features: MVP versus later

The MVP is the smallest version that can prove that customers want the service and businesses will pay.

<box border radius="xl" padding={3} gap={3}>
  <row align="start" gap={2}>
    <icon name="check-circle" color="success" size="xl" />
    <box flex="1" gap={1}>
      **Phase 1 — Must launch with these**

      <text color="secondary" size="sm">Build first</text>
      - Homepage and offer listings
      - Search by location and category
      - Offer detail pages
      - Business registration and offer submission
      - Admin approval workflow
      - Business contact/address and directions
      - Basic analytics
      - Responsive mobile design
      - Privacy notice, terms and report-offer function
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={2}>
    <icon name="trending-up" size="xl" />
    <box flex="1" gap={1}>
      **Phase 2 — Add after real usage**

      - Saved offers and favourite businesses
      - Email alerts and optional newsletters
      - Redemption codes or QR codes
      - Paid business plans
      - Business performance dashboard
      - Offer sharing and referral tracking
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={2}>
    <icon name="rocket" size="xl" />
    <box flex="1" gap={1}>
      **Phase 3 — Scale when justified**

      - Map-based exploration
      - Personalized recommendations
      - Automated expiry notifications
      - Multiple locations per business
      - Native mobile apps if users need them
      - More advanced fraud detection and analytics
    </box>
  </row>
</box>

Avoid launching with an AI chatbot, complex loyalty points, cryptocurrency, a large social network, or a native app unless user testing demonstrates a real need. These features add cost without proving the core business.

---

## 6. Choose a professional technology stack

For a solo developer with a software engineering background, I recommend a modern TypeScript stack. It is suitable for a responsive marketplace and leaves room to grow.

<box border radius="xl" padding={3} gap={3}>
  <row align="center" gap={3}>
    <AsyncImage query="Next.js framework logo" aspectRatio="1:1" maxWidth="52px" />
    <box flex="1" gap={1}>
      **Frontend and server logic — Next.js + TypeScript**

      <text color="secondary" size="sm">Website pages, reusable UI, server-rendered offer pages, API endpoints and search-friendly URLs.</text>
      <text size="sm"><Link url="https://nextjs.org/docs" title="Official Next.js documentation" /></text>
    </box>
  </row>
  <divider color="subtle" />
  <row align="center" gap={3}>
    <AsyncImage query="Supabase logo" aspectRatio="1:1" maxWidth="52px" />
    <box flex="1" gap={1}>
      **Database, authentication and image storage — Supabase**

      <text color="secondary" size="sm">PostgreSQL, business accounts, secure sessions, offer data and uploaded images.</text>
      <text size="sm"><Link url="https://supabase.com/docs" title="Official Supabase documentation" /></text>
    </box>
  </row>
  <divider color="subtle" />
  <row align="center" gap={3}>
    <AsyncImage query="Tailwind CSS logo" aspectRatio="1:1" maxWidth="52px" />
    <box flex="1" gap={1}>
      **Styling — Tailwind CSS**

      <text color="secondary" size="sm">Consistent spacing, typography, responsive layouts and reusable design patterns.</text>
      <text size="sm"><Link url="https://tailwindcss.com/docs" title="Official Tailwind CSS documentation" /></text>
    </box>
  </row>
  <divider color="subtle" />
  <row align="center" gap={3}>
    <AsyncImage query="Stripe payments logo" aspectRatio="1:1" maxWidth="52px" />
    <box flex="1" gap={1}>
      **Payments — Stripe or another suitable payment provider**

      <text color="secondary" size="sm">Business subscriptions once you validate pricing and confirm that your business and account qualify.</text>
      <text size="sm"><Link url="https://docs.stripe.com/" title="Official Stripe documentation" /></text>
    </box>
  </row>
</box>

Additional tools:

- **GitHub:** source control and issue tracking.
- **Vercel or another compatible host:** website deployment.
- **Playwright:** browser-based end-to-end tests.
- **Zod:** validation of forms and API input.
- **Resend or a similar email service:** transactional email, after configuring a verified sender domain.
- **PostHog or privacy-conscious analytics:** product usage measurements, with an appropriate privacy setup.

You do not need every tool on the first day. Start with the website, database, authentication and hosting; add payments and email automation only when needed.

### Recommended architecture

<box border radius="lg" padding={3} align="center" gap={1}>
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **Resident website + business dashboard + admin dashboard**
  </box>
  <icon name="arrow-down" size="lg" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Next.js server / validated API endpoints**
  </box>
  <icon name="arrow-down" size="lg" />
  <grid columns={2} gap={2}>
    <grid-item>
      <box background="surface" border radius="md" padding={2} align="center">
        <icon name="database" size="lg" />
        <text weight="medium" textAlign="center">PostgreSQL database</text>
      </box>
    </grid-item>
    <grid-item>
      <box background="surface" border radius="md" padding={2} align="center">
        <icon name="image" size="lg" />
        <text weight="medium" textAlign="center">Image storage</text>
      </box>
    </grid-item>
    <grid-item>
      <box background="surface" border radius="md" padding={2} align="center">
        <icon name="shield-check" size="lg" />
        <text weight="medium" textAlign="center">Authentication and permissions</text>
      </box>
    </grid-item>
    <grid-item>
      <box background="surface" border radius="md" padding={2} align="center">
        <icon name="bar-chart-3" size="lg" />
        <text weight="medium" textAlign="center">Analytics and reporting</text>
      </box>
    </grid-item>
  </grid>
</box>

For an initial release, use a **modular monolith**, not a microservices architecture. It is easier to build, debug and deploy, and can serve a substantial early user base.

## 7. Design the database correctly

A marketplace becomes difficult to maintain when its data model is improvised. Establish the core entities before writing lots of application code.

### Core database tables

| Table | Purpose | Key fields |
|---|---|---|
| `profiles` | User information | `id`, `name`, `role`, `created_at` |
| `businesses` | Business listings | `id`, `owner_id`, `name`, `slug`, `address`, `postcode`, `status` |
| `categories` | Offer categories | `id`, `name`, `slug`, `is_active` |
| `offers` | Discounts and promotions | `id`, `business_id`, `category_id`, `title`, `description`, `status` |
| `offer_prices` | Price and discount details | `offer_id`, `original_price`, `discount_price`, `currency` |
| `offer_validity` | Validity period and conditions | `offer_id`, `starts_at`, `ends_at`, `terms` |
| `favorites` | Saved deals | `user_id`, `offer_id` |
| `redemptions` | Recorded offer uses | `id`, `offer_id`, `user_id`, `code`, `redeemed_at` |
| `subscriptions` | Paid business plans | `business_id`, `provider_subscription_id`, `status`, `plan` |
| `reports` | User-reported issues | `id`, `offer_id`, `reason`, `status` |
| `audit_logs` | Important admin actions | `actor_id`, `action`, `target_id`, `created_at` |

This is a starting schema, not a complete migration. For example, offers without fixed prices—such as a percentage off a haircut—need a supported discount type instead of requiring every offer to have a numeric sale price.

### Data rules you should implement

- Every offer belongs to a business and a category.
- The business owner can only edit businesses and offers they are authorized to manage.
- Public visitors see only active, approved, currently valid offers.
- An offer's expiry is enforced by the backend, not merely hidden by the frontend.
- An offer cannot be redeemed beyond its limits if it has a redemption cap.
- A business cannot make itself verified or approve its own pending offers.
- A subscription payment webhook must be validated before changing paid-plan access.
- Duplicate favourites and duplicate redemptions should be prevented where appropriate.

Use database migrations to track changes, and create development, staging and production environments. Never test destructive changes on your live database.

## 8. Build the core functions carefully

### Search and location

Allow users to browse by town or postcode without sharing precise GPS coordinates. If they choose to share location, request permission at the moment it becomes useful.

For the first version, postcode and town filtering may be sufficient. If you later add distance-based results, store valid geographic coordinates and use a geographic search approach such as PostGIS or an equivalent supported feature.

Never display a business's private address if it operates from a home and has not consented to publishing it.

### Discount calculations

For an offer with an original price and a discounted price:

\[
\text{Savings}=\text{Original price}-\text{Discount price}
\]

\[
\text{Discount \%}=
\frac{\text{Savings}}{\text{Original price}}\times100
\]

Validate that prices are non-negative and the original price is greater than zero. For fixed-price offers, check that the discount price is not greater than the original price unless you explicitly support a different type of promotion.

Store money as integer cents or a suitable fixed-precision decimal type—not floating-point values.

### Offer redemption

Start with one of two methods:

1. **Show this offer:** The user displays the offer screen at the business. The business applies the discount according to the stated terms.
2. **Unique coupon code:** The user receives a code that the business validates.

A QR code is not automatically secure. If you implement one, its redemption token should be unpredictable, validated server-side, and protected against repeated use where the offer is single-use. Avoid placing personal data directly in QR codes.

### Business verification

A professional verification process could include:

1. Verify the owner's email address.
2. Verify a contact method.
3. Check that the business name and address are plausible.
4. Ask for evidence if needed, using a proportionate and privacy-conscious process.
5. Mark the business as verified only after an authorized review.
6. Provide a way to report incorrect information.

Do not label a business “verified” just because someone created an account.

---

## 9. Security, privacy and legal readiness

Because LocalDeals would operate in France, design for privacy and consumer trust from the beginning. This is product-planning guidance, not a substitute for legal advice.

<box gap={2}>
  <row align="start" gap={2}>
    <icon name="shield-check" size="xl" color="success" />
    <box flex="1" gap={1}>
      **Authentication and permissions**

      Use established authentication rather than building your own password system. Enforce role-based permissions and database-level access controls. Test that a business owner cannot access another business's private data.
    </box>
  </row>
  <row align="start" gap={2}>
    <icon name="lock-keyhole" size="xl" color="success" />
    <box flex="1" gap={1}>
      **Data protection**

      Collect only what you need. Use HTTPS, secure sessions, secret management, database backups and access logging. Never put server secrets in frontend code or a public repository.
    </box>
  </row>
  <row align="start" gap={2}>
    <icon name="mail" size="xl" color="success" />
    <box flex="1" gap={1}>
      **Marketing consent**

      Make promotional emails optional, explain their purpose, and provide an easy unsubscribe mechanism. Do not automatically subscribe every registered user to marketing messages.
    </box>
  </row>
  <row align="start" gap={2}>
    <icon name="file-check" size="xl" color="success" />
    <box flex="1" gap={1}>
      **French and EU compliance**

      Review applicable GDPR and CNIL guidance, cookie/analytics requirements, consumer-information rules, business terms, legal notices, and any applicable marketplace or online-platform obligations.
    </box>
  </row>
  <row align="start" gap={2}>
    <icon name="badge-check" size="xl" color="success" />
    <box flex="1" gap={1}>
      **Honest promotions**

      Make it clear who provides the offer, what the conditions are, when it expires, and whether any purchase is required. Do not publish fabricated reviews, misleading discounts, fake scarcity or unverifiable claims.
    </box>
  </row>
</box>

### Before accepting payments

You should have a clear business identity, appropriate business terms, a privacy notice, a refund/cancellation policy for business subscriptions, a process for complaints and offer disputes, and a payment provider account that permits your intended activity.

You should also check the French registration, tax and invoicing requirements that apply to your chosen legal structure. **Your French student residence status may restrict self-employment or business operation**, so confirm your authorization before operating the paid service. Creating a website and receiving money are not necessarily treated the same way.

Useful starting points:

- <Link url="https://www.cnil.fr/" title="CNIL — French data protection authority" />
- <Link url="https://entreprendre.service-public.fr/" title="Entreprendre.Service-Public.fr — French business procedures" />
- <Link url="https://www.economie.gouv.fr/dgccrf" title="DGCCRF — French consumer protection information" />

## 10. Create a business model that makes sense

Don't charge residents simply to browse local offers at the beginning. Your initial monetization should focus on businesses that can see a clear benefit from additional customers.

### Example pricing

These are proposed test prices, not established market rates.

<box border radius="xl" padding={3} gap={3}>
  <box gap={1}>
    <row align="center" justify="between">
      <title size="lg">Free listing</title>
      <title size="lg">€0</title>
    </row>
    <text color="secondary" size="sm">For onboarding the first businesses and building a useful directory.</text>
    - Basic business profile
    - One active offer
    - Basic views and clicks
  </box>
  <divider color="subtle" />
  <box gap={1}>
    <row align="center" justify="between">
      <title size="lg">Local Plus</title>
      <title size="lg">€19/month</title>
    </row>
    <text color="secondary" size="sm">An initial paid plan to test willingness to pay.</text>
    - Several active offers
    - Business dashboard
    - Basic engagement statistics
    - Ability to update promotions
  </box>
  <divider color="subtle" />
  <box gap={1}>
    <row align="center" justify="between">
      <title size="lg">Local Featured</title>
      <title size="lg">€39/month</title>
    </row>
    <text color="secondary" size="sm">For businesses wanting more visibility.</text>
    - Features from Local Plus
    - Eligible featured placement
    - Expanded performance reporting
    - Promotion scheduling
  </box>
</box>

Paid placement must be clearly labelled as sponsored or featured. Don't guarantee sales, rankings or customer numbers that you cannot substantiate.

### What might the revenue look like?

Here is a simple illustrative model using €19 per paying business per month.

<Chart content={{"chartType":"bar","meta":{"title":"Illustrative monthly subscription revenue","description":"Gross revenue before hosting, payment processing, taxes, refunds, marketing and other costs."},"xKey":"businesses","series":[{"dataKey":"revenue","label":"Monthly revenue","valuePrefix":"€","valueFormat":"integer"}],"yAxisMin":0,"data":[{"businesses":"10 businesses","revenue":190},{"businesses":"25 businesses","revenue":475},{"businesses":"50 businesses","revenue":950},{"businesses":"100 businesses","revenue":1900}]}} />

This shows why the challenge is not only coding: it is acquiring and retaining paying businesses. Ten paying businesses would generate €190 per month at that price, but there is no guarantee you will obtain ten customers—or that they will continue paying.

### What should you charge first?

For the first pilot, consider onboarding a small number of businesses free for 30 days in exchange for feedback and permission to measure results. Before the trial ends, show each business its actual performance and ask whether it would pay for continued access.

If the product generates no measurable interest, investigate the problem before adding more subscription features.

## 11. Validate demand before spending weeks coding

This is one of the most important parts of the plan.

A beautiful product can still fail if residents don't open it and businesses don't pay. Your first goal is to prove three things:

1. Local businesses are willing to provide genuine offers.
2. Residents are interested in those offers.
3. Businesses see enough value to pay for continued visibility.

### First 7 days: test the idea manually

<box border radius="xl" padding={3} gap={3}>
  <title size="lg">Your validation checklist</title>
  {@body const tasks = [
    "Choose one town and two initial categories.",
    "Create a one-page description of LocalDeals.",
    "List 30 suitable local businesses using public business information.",
    "Contact 10 businesses and ask about their current promotion methods.",
    "Speak with 15–20 local residents about how they find discounts.",
    "Ask 5 businesses whether they would trial a listing.",
    "Collect at least 10 genuine offers with clear terms and validity dates.",
    "Show a simple prototype to residents and observe whether they can find an offer."
  ]}
  {@body const [done,setDone] = DIL.useState([])}
  <row align="center" justify="between">
    <text color="secondary" size="sm">{done.length} of {tasks.length} completed</text>
    <button variant="ghost" size="sm" onClick={() => setDone([])}>Reset</button>
  </row>
  <box background="surface-tertiary" radius="full" height="6px" clip>
    <box background="surface-inverted" radius="full" height="6px" width={`${done.length/tasks.length*100}%`} />
  </box>
  {#each tasks as task,i}
    <checkbox key={task} checked={done.includes(i)} onChange={v=>setDone(old=>v?[...old,i]:old.filter(x=>x!==i))}>{task}</checkbox>
  {/each}
</box>

### Questions to ask local businesses

Don't start by asking, “Would you use my app?” People often say yes to be polite. Ask about their actual behaviour.

- How do you currently attract new customers?
- Which promotion methods have worked for you?
- Do you offer discounts during quiet periods?
- How do customers usually learn about your offers?
- How do you measure whether a promotion worked?
- Would you test a new local platform if it brought relevant customers?
- What evidence would you need before paying €19 per month?

### Questions to ask residents

- Where do you currently discover local discounts?
- Which types of local businesses would you like offers from?
- What makes you distrust a discount?
- Would you rather browse by category, map or distance?
- Would you save offers, share them, or show them at the shop?
- What would make you return to the website every week?

Record the answers. Use what people actually do and say to decide what to build.

---

## 12. A practical 30-day build and launch roadmap

This schedule assumes you can dedicate substantial time to the project and use existing libraries and services. If you are new to the chosen stack, allow extra time.

<box gap={3}>
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} minWidth="82px" align="center">
      <title size="lg">Days 1–3</title>
      <text size="xs" color="secondary">Research</text>
    </box>
    <box flex="1" gap={1}>
      **Phase 1 — Research and product definition**

      - Choose the first area and target categories.
      - Interview residents and business owners.
      - Identify local competitors and existing alternatives.
      - Write the MVP requirements.
      - Sketch the four primary screens.
      - Create the initial offer-verification rules.

      **Deliverable:** Validated problem statement, user flows and wireframes.
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} minWidth="82px" align="center">
      <title size="lg">Days 4–7</title>
      <text size="xs" color="secondary">Foundation</text>
    </box>
    <box flex="1" gap={1}>
      **Phase 2 — Set up the project**

      - Create the repository and development environment.
      - Configure Next.js, TypeScript and styling.
      - Set up the database and authentication.
      - Create migrations and seed test data.
      - Build shared components, navigation and responsive layouts.

      **Deliverable:** Working project with a database and consistent UI foundation.
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} minWidth="82px" align="center">
      <title size="lg">Days 8–14</title>
      <text size="xs" color="secondary">Core product</text>
    </box>
    <box flex="1" gap={1}>
      **Phase 3 — Build discovery and offer management**

      - Build the homepage and category listings.
      - Implement search and filters.
      - Build offer details and expiry handling.
      - Build business registration and offer submission.
      - Add the admin approval workflow.
      - Enforce permissions on the server and database.

      **Deliverable:** Residents can browse offers, and businesses can submit them for review.
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} minWidth="82px" align="center">
      <title size="lg">Days 15–21</title>
      <text size="xs" color="secondary">Trust and testing</text>
    </box>
    <box flex="1" gap={1}>
      **Phase 4 — Prepare for real users**

      - Add favourite offers if time permits.
      - Add analytics and basic error monitoring.
      - Test mobile layouts and accessibility.
      - Test permissions, expiry dates and form validation.
      - Add privacy and business information pages.
      - Recruit pilot businesses and verify offers.

      **Deliverable:** A testable pilot with real, approved offers.
    </box>
  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} minWidth="82px" align="center">
      <title size="lg">Days 22–30</title>
      <text size="xs" color="secondary">Launch</text>
    </box>
    <box flex="1" gap={1}>
      **Phase 5 — Launch locally and learn**

      - Publish the website and connect a custom domain.
      - Recruit the first residents through local communities.
      - Help businesses publish their offers.
      - Collect feedback and fix confusing workflows.
      - Measure visits, offer views and redemption activity.
      - Decide whether to improve, pivot or expand.

      **Deliverable:** A local pilot with measurable results and feedback.
    </box>
  </row>
</box>

## 13. Make LocalDeals discoverable on Google

Local search can become a valuable source of free traffic over time. Since local offers have a town and category, you can build useful landing pages instead of relying only on the homepage.

### SEO structure

Examples of URL patterns:

- `/deals/argenteuil`
- `/deals/argenteuil/restaurants`
- `/deals/argenteuil/beauty`
- `/businesses/example-cafe`
- `/offers/example-coffee-deal`

Each page should have a meaningful title, useful content, valid business information, and links to relevant categories and offers. Don't generate hundreds of empty town pages or duplicate the same text with only the city name changed.

### Local SEO checklist

- Set up a verified website domain and search-engine ownership.
- Generate an XML sitemap.
- Use descriptive page titles and meta descriptions.
- Add canonical URLs where necessary.
- Make offer pages indexable only when appropriate.
- Include accurate business name, address and contact details.
- Compress images and provide useful alternative text.
- Track search impressions, clicks and popular categories.
- Encourage genuine feedback without buying reviews or manipulating ratings.

You can use the <Link url="https://developers.google.com/search/docs" title="Google Search Central documentation" /> as your technical SEO reference.

Remember: a local offer website needs real offers, useful pages and genuine user activity. SEO cannot compensate for an empty directory.

## 14. Testing: what must work before launch?

Don't rely on the fact that a page opens successfully. Test complete user journeys and security boundaries.

| Test | Expected result |
|---|---|
| Resident searches for a town | Relevant active offers appear |
| Offer reaches its end date | It is no longer redeemable |
| Business submits an offer | It remains pending until approved |
| Unauthorized user edits an offer | Server rejects the request |
| Business owner accesses another business | Access is denied |
| Original price is zero | Discount calculation is rejected or handled safely |
| Required fields are missing | Clear validation messages appear |
| Mobile screen is narrow | Content remains readable and usable |
| User requests account deletion | Documented deletion process works, subject to applicable retention obligations |
| Email marketing is declined | User is not subscribed to promotional emails |
| Subscription payment fails | Paid access is not incorrectly granted or extended |
| Admin removes a misleading offer | The offer disappears from public listings |

Also test slow connections, missing images, expired sessions, repeated form submissions and database failures.

Use automated tests for critical calculations and permissions, and manually test the site on an actual phone before launch.

## 15. Deployment and operating costs

You can start with a very lean setup. Exact prices depend on current provider plans, traffic, storage and usage, so treat the following as planning estimates rather than quotes.

| Item | Initial planning budget |
|---|---:|
| Domain name | €10–€25/year |
| Hosting | €0–€25/month |
| Database and authentication | €0–€25/month |
| Email service | €0–€15/month |
| Basic analytics | €0 initially |
| Design assets | €0 using free resources |
| Initial outreach | €0–€50 |
| **Lean initial target** | **About €20–€100** |

This assumes free tiers are suitable for your usage and you do most development yourself. It excludes legal/accounting expenses, any required business registration costs, paid advertising, and your time. Check current provider pricing and limits before committing.

### Deployment checklist

1. Create separate development and production configurations.
2. Store secrets in environment variables.
3. Configure a custom domain and HTTPS.
4. Apply production database migrations.
5. Enable access controls and review database policies.
6. Set up backups and test restoration.
7. Add basic uptime and error monitoring.
8. Configure a verified email sender domain if sending transactional emails.
9. Test the production site on mobile.
10. Keep a rollback plan for failed deployments.

Do not store API secrets, database service-role keys, private user data or payment secrets in frontend code or public GitHub repositories.

## 16. Your first customer acquisition strategy

A local marketplace has a classic challenge: residents want useful offers, while businesses want an audience. You need to solve both sides together.

### Start with supply

Before advertising heavily to residents, recruit enough businesses to make the site worth visiting.

Your first target could be:

- 5 cafés or bakeries
- 5 barbers or beauty businesses
- 5 other suitable local businesses

These are targets, not guaranteed sign-ups. Prioritize genuine, current offers over the number of listings.

### Then attract residents

- Share useful offers in local community groups where promotion is allowed.
- Create short videos featuring real participating businesses, with their permission.
- Ask businesses to display a QR code linking to their LocalDeals page.
- Create town-and-category landing pages for search traffic.
- Invite early users to submit feedback.
- Ask businesses to share their own offer pages.
- Run a small promotional campaign only after tracking how many visitors actually redeem offers.

Avoid mass messaging, scraping private contact details, spam or publishing a business's branding without appropriate permission.

### A sample outreach message

<WritingBlock id="58317" variant="chat_message">Hello! I'm developing LocalDeals, a local platform designed to help people discover genuine offers from businesses in their area.

I'm inviting a small group of local businesses to test it during the pilot. You would be able to showcase a promotion, attract nearby customers and see how people interact with your offer.

The initial pilot is free, with no obligation to continue. Would you be interested in a short conversation about whether it could be useful for your business?</WritingBlock>

Personalize the message for each business. A face-to-face conversation can be more effective than sending the same message to hundreds of shops.

## 17. Measure the right things

Downloads and website visits alone do not prove the business is working.

Track these metrics from the beginning:

<box gap={2}>
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} align="center" minWidth="72px">
      <icon name="store" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Business activation**

      <text color="secondary" size="sm">How many recruited businesses publish at least one approved offer?</text>
    </box>
  </row>
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} align="center" minWidth="72px">
      <icon name="eye" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Offer engagement**

      <text color="secondary" size="sm">How many people open offers, save them, or click for directions?</text>
    </box>
  </row>
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} align="center" minWidth="72px">
      <icon name="ticket" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Redemption rate**

      <text color="secondary" size="sm">Of users who view an offer, how many actually redeem it? Use reliable redemption tracking rather than assuming a click equals a sale.</text>
    </box>
  </row>
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} align="center" minWidth="72px">
      <icon name="repeat" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Repeat usage and retention**

      <text color="secondary" size="sm">Do residents return, and do businesses renew their paid plans?</text>
    </box>
  </row>
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" padding={2} align="center" minWidth="72px">
      <icon name="wallet" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Revenue and acquisition cost**

      <text color="secondary" size="sm">How much recurring revenue do you earn, and how much time or money does each paying business cost to acquire?</text>
    </box>
  </row>
</box>

For the first month, your most useful question is: **Can you repeatedly help local businesses attract customers and demonstrate that value?**

Set numerical targets after you have baseline data. Don't invent success benchmarks and treat them as industry facts.

## 18. The biggest risks—and how to reduce them

| Risk | What to do |
|---|---|
| Not enough offers | Recruit businesses before a public launch |
| Residents don't return | Focus on genuinely useful, fresh offers |
| Businesses refuse to pay | Demonstrate real results and test pricing |
| Fake or expired deals | Require validity dates, moderation and reporting |
| Existing competitors | Differentiate through local coverage, trust and service |
| Too much development | Keep the MVP small and use managed services |
| Low search traffic | Build useful pages and distribute offers directly |
| Misleading discounts | Validate prices and clearly disclose conditions |
| Legal or tax problems | Check French business and residence-status requirements before monetizing |

One particularly important decision: **do not try to cover all of France on day one.** Ten reliable offers in one area are often more useful than 500 stale offers scattered across the country.

## 19. A professional project structure

A reasonable initial structure for Next.js could look like this:

```text
localdeals/
├── app/
│   ├── page.tsx
│   ├── deals/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── businesses/
│   │   └── [slug]/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── offers/page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── api/
├── components/
│   ├── offers/
│   ├── business/
│   ├── navigation/
│   └── ui/
├── lib/
│   ├── auth/
│   ├── database/
│   ├── validation/
│   └── permissions/
├── types/
├── tests/
├── supabase/
│   └── migrations/
└── public/
```

Keep authorization and business rules in server-side code and database policies—not merely in the visual components. Add the files gradually as the project grows.

## 20. Your final implementation priorities

If I were leading this project, I would use this order:

<list marker="number" gap={2}>
  <list-item>**Validate the business.** Talk to local residents and businesses before committing to the full build.</list-item>
  <list-item>**Design the resident experience.** Make discovery, offer details and redemption exceptionally clear.</list-item>
  <list-item>**Build the data foundation.** Create the business, offer, category and user models with appropriate permissions.</list-item>
  <list-item>**Build the core marketplace.** Search, offer pages, business submission and admin approval come first.</list-item>
  <list-item>**Recruit genuine offers.** Manually verify the first listings and keep them updated.</list-item>
  <list-item>**Launch a small pilot.** Test the complete journey with real residents and businesses.</list-item>
  <list-item>**Monetize after demonstrating value.** Introduce subscriptions and measure renewals before investing in advanced features.</list-item>
</list>

## Let's tailor the build to your situation

I can take you through the actual development process, including project setup, database SQL, authentication, UI components, security policies, deployment and launch. Before I generate the implementation, choose the setup you prefer.

{@body const [experience,setExperience] = DIL.useState("intermediate")}
{@body const [platform,setPlatform] = DIL.useState("pwa")}
{@body const [budget,setBudget] = DIL.useState("under100")}
{@body const [priority,setPriority] = DIL.useState("both")}
<box border radius="xl" padding={4} gap={4}>
  <title size="lg">LocalDeals build configuration</title>
  <text color="secondary" size="sm">Choose what fits you. You can submit partial answers too.</text>
  <form gap={4} onSubmit={() => GenUI.issueNewTurn("Create the step-by-step LocalDeals implementation plan based on these preferences. Developer experience: "+experience+". Initial product: "+platform+". Budget: "+budget+". Main priority: "+priority+". Include exact setup commands, complete code, database schema and security policies, testing and deployment steps appropriate to the choices.")}>
    <text weight="medium">1. Your current development level</text>
    <radio-group value={experience} onChange={setExperience} direction="col">
      <radio value="beginner">Beginner — explain every command</radio>
      <radio value="intermediate">Intermediate — I can build websites and work with APIs</radio>
      <radio value="advanced">Advanced — focus on architecture and production quality</radio>
    </radio-group>
    <divider color="subtle" />
    <text weight="medium">2. What should we build first?</text>
    <radio-group value={platform} onChange={setPlatform} direction="col">
      <radio value="pwa">Mobile-first website / installable PWA (recommended)</radio>
      <radio value="website">Responsive website only</radio>
      <radio value="native">Native Android and iOS app</radio>
    </radio-group>
    <divider color="subtle" />
    <text weight="medium">3. Initial budget</text>
    <radio-group value={budget} onChange={setBudget} direction="col">
      <radio value="zero">As close to €0 as possible</radio>
      <radio value="under100">Under €100</radio>
      <radio value="100to500">€100–€500</radio>
    </radio-group>
    <divider color="subtle" />
    <text weight="medium">4. Your main priority</text>
    <radio-group value={priority} onChange={setPriority} direction="col">
      <radio value="fast">Launch the simplest working MVP quickly</radio>
      <radio value="production">Build it with production-grade foundations</radio>
      <radio value="both">Balance a quick launch with good engineering (recommended)</radio>
    </radio-group>
    <button block submit>Generate my implementation plan</button>
  </form>
</box>

My recommendation is to build the **PWA with Next.js, TypeScript and Supabase**, validate it with a small group of local businesses, and only add advanced functionality when the first users show you what they need.

---

If you want, I can:

- Outline next steps for building the MVP
- Design initial user onboarding flows
- Develop a marketing launch plan