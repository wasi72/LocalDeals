const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LocalDeals Worldwide Global Platform...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.redemption.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.category.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Users & International Merchants
  const admin = await prisma.user.create({
    data: {
      email: 'admin@localdeals.com',
      name: 'Claire Dubois (Global Admin)',
      role: 'ADMIN',
      city: 'Paris',
      postcode: '75011',
    },
  });

  const merchantNYC = await prisma.user.create({
    data: {
      email: 'sal@brooklynpizza.com',
      name: 'Sal Moretti',
      role: 'MERCHANT',
      phone: '+1 718-555-0192',
      city: 'New York',
      postcode: '11201',
    },
  });

  const merchantLondon = await prisma.user.create({
    data: {
      email: 'oliver@crownandanchor.co.uk',
      name: 'Oliver Sterling',
      role: 'MERCHANT',
      phone: '+44 20 7946 0912',
      city: 'London',
      postcode: 'WC2E 9HA',
    },
  });

  const merchantTokyo = await prisma.user.create({
    data: {
      email: 'kenji@menyamusashi.jp',
      name: 'Kenji Takahashi',
      role: 'MERCHANT',
      phone: '+81 3-5321-9876',
      city: 'Tokyo',
      postcode: '160-0023',
    },
  });

  const merchantParis = await prisma.user.create({
    data: {
      email: 'marc@boulangeriefontaine.fr',
      name: 'Marc Fontaine',
      role: 'MERCHANT',
      phone: '+33 1 43 57 88 12',
      city: 'Paris',
      postcode: '75011',
    },
  });

  const merchantBerlin = await prisma.user.create({
    data: {
      email: 'hanna@kreuzbergmovement.de',
      name: 'Hanna Weber',
      role: 'MERCHANT',
      phone: '+49 30 2593 1100',
      city: 'Berlin',
      postcode: '10997',
    },
  });

  const merchantSydney = await prisma.user.create({
    data: {
      email: 'chloe@bondipilates.com.au',
      name: 'Chloe Evans',
      role: 'MERCHANT',
      phone: '+61 2 9300 4589',
      city: 'Sydney',
      postcode: '2026',
    },
  });

  const merchantDubai = await prisma.user.create({
    data: {
      email: 'tariq@alfanardubai.ae',
      name: 'Tariq Al-Maktoum',
      role: 'MERCHANT',
      phone: '+971 4 345 6789',
      city: 'Dubai',
      postcode: '00000',
    },
  });

  const residentLucas = await prisma.user.create({
    data: {
      email: 'lucas.bernard@example.com',
      name: 'Lucas Bernard',
      role: 'RESIDENT',
      city: 'Paris',
      postcode: '75011',
    },
  });

  // 2. Global Categories
  const catFood = await prisma.category.create({
    data: {
      name: 'Dining, Food & Cafes',
      slug: 'dining-food-cafes',
      icon: 'Utensils',
      description: 'Artisanal bakeries, pizzerias, ramen bars, bistros, and specialty cafes',
      displayOrder: 1,
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: 'Beauty, Spas & Wellness',
      slug: 'beauty-spa-wellness',
      icon: 'Sparkles',
      description: 'Facial treatments, organic day spas, deep relaxation, and holistic therapies',
      displayOrder: 2,
    },
  });

  const catBarber = await prisma.category.create({
    data: {
      name: 'Hair Salons & Barbershops',
      slug: 'hair-salons-barbershops',
      icon: 'Scissors',
      description: 'Traditional master barbers, styling, grooming clubs, and head spas',
      displayOrder: 3,
    },
  });

  const catSport = await prisma.category.create({
    data: {
      name: 'Fitness, Yoga & Movement',
      slug: 'fitness-yoga-movement',
      icon: 'Dumbbell',
      description: 'Reformer pilates, boutique HIIT gyms, functional training, and yoga studios',
      displayOrder: 4,
    },
  });

  const catShopping = await prisma.category.create({
    data: {
      name: 'Boutiques & Specialty Shops',
      slug: 'boutiques-specialty-shops',
      icon: 'ShoppingBag',
      description: 'Independent fashion, matcha tea boutiques, vinyl stores, and homeware',
      displayOrder: 5,
    },
  });

  const catServices = await prisma.category.create({
    data: {
      name: 'Local Services & Artisans',
      slug: 'services-artisans',
      icon: 'Wrench',
      description: 'Bicycle repair, custom tailoring, leather crafting, and tech workshops',
      displayOrder: 6,
    },
  });

  // 3. Worldwide Businesses
  // 3.1 New York City (USA)
  const bizNYC = await prisma.business.create({
    data: {
      ownerId: merchantNYC.id,
      name: "Sal's Brooklyn Artisan Pizzeria & Trattoria",
      slug: 'sals-brooklyn-artisan-pizzeria',
      description: 'Family-owned Neapolitan sourdough pizza wood-fired at 900 degrees with San Marzano tomatoes, fresh buffalo mozzarella, and aged hot honey.',
      siret: 'EIN: 12-3456789',
      address: '68 Jay Street, DUMBO',
      city: 'New York',
      postcode: '11201',
      country: 'United States',
      phone: '+1 718-555-0192',
      email: 'sal@brooklynpizza.com',
      website: 'https://salsbrooklynpizza.com',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 40.7033,
      longitude: -73.9892,
      coverUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      openingHours: JSON.stringify({
        mon: '11:30 - 22:00',
        tue: '11:30 - 22:00',
        wed: '11:30 - 22:00',
        thu: '11:30 - 23:00',
        fri: '11:30 - 00:00',
        sat: '12:00 - 00:00',
        sun: '12:00 - 21:30',
      }),
    },
  });

  // 3.2 London (UK)
  const bizLondon = await prisma.business.create({
    data: {
      ownerId: merchantLondon.id,
      name: 'The Crown & Anchor Craft GastroPub',
      slug: 'the-crown-and-anchor-london',
      description: 'Historic Covent Garden pub serving locally sourced British heritage meats, award-winning Sunday roasts, cask ales, and seasonal pies.',
      siret: 'CRN: 09876543',
      address: '22 Neal Street, Covent Garden',
      city: 'London',
      postcode: 'WC2H 9PS',
      country: 'United Kingdom',
      phone: '+44 20 7946 0912',
      email: 'oliver@crownandanchor.co.uk',
      website: 'https://crownandanchorlondon.co.uk',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 51.5138,
      longitude: -0.1265,
      coverUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=200&q=80',
      openingHours: JSON.stringify({
        mon: '12:00 - 23:00',
        tue: '12:00 - 23:00',
        wed: '12:00 - 23:00',
        thu: '12:00 - 00:00',
        fri: '12:00 - 01:00',
        sat: '11:00 - 01:00',
        sun: '12:00 - 22:30',
      }),
    },
  });

  // 3.3 Tokyo (Japan)
  const bizTokyo = await prisma.business.create({
    data: {
      ownerId: merchantTokyo.id,
      name: 'Menya Musashi Premium Ramen Bar',
      slug: 'menya-musashi-shinjuku',
      description: 'Renowned Shinjuku ramen master crafting 16-hour simmered double-soup broth (tonkotsu & bonito dashi) with hand-pulled thick noodles and flame-torched chashu.',
      siret: 'JPN: 4010001099882',
      address: '7-2-6 Nishi-Shinjuku, K-1 Bldg 1F',
      city: 'Tokyo',
      postcode: '160-0023',
      country: 'Japan',
      phone: '+81 3-5321-9876',
      email: 'kenji@menyamusashi.jp',
      website: 'https://menyamusashi-shinjuku.jp',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 35.6946,
      longitude: 139.6983,
      coverUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=200&q=80',
      openingHours: JSON.stringify({
        mon: '11:00 - 22:30',
        tue: '11:00 - 22:30',
        wed: '11:00 - 22:30',
        thu: '11:00 - 22:30',
        fri: '11:00 - 23:00',
        sat: '11:00 - 23:00',
        sun: '11:00 - 22:00',
      }),
    },
  });

  // 3.4 Paris (France)
  const bizParis = await prisma.business.create({
    data: {
      ownerId: merchantParis.id,
      name: 'Boulangerie & Pâtisserie Fontaine',
      slug: 'boulangerie-patisserie-fontaine',
      description: 'Organic sourdough hearth loaves, PDO Charentes-Poitou butter croissants, and exquisite artisanal pastries handmade every morning.',
      siret: '84920194800019',
      address: '74 Rue Oberkampf',
      city: 'Paris',
      postcode: '75011',
      country: 'France',
      phone: '+33 1 43 57 88 12',
      email: 'contact@boulangeriefontaine.fr',
      website: 'https://boulangeriefontaine.fr',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 48.8654,
      longitude: 2.3732,
      coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      openingHours: JSON.stringify({
        mon: '07:00 - 20:00',
        tue: '07:00 - 20:00',
        wed: '07:00 - 20:00',
        thu: '07:00 - 20:00',
        fri: '07:00 - 20:00',
        sat: '07:30 - 19:30',
        sun: 'Closed',
      }),
    },
  });

  // 3.5 Berlin (Germany)
  const bizBerlin = await prisma.business.create({
    data: {
      ownerId: merchantBerlin.id,
      name: 'Kreuzberg Movement & HIIT Lab',
      slug: 'kreuzberg-movement-hiit-lab',
      description: 'Urban boutique functional training sanctuary in a converted industrial loft. Science-backed HIIT, breathwork sessions, and Finnish sauna.',
      siret: 'DE 312 948 102',
      address: 'Oranienstraße 185',
      city: 'Berlin',
      postcode: '10997',
      country: 'Germany',
      phone: '+49 30 2593 1100',
      email: 'hanna@kreuzbergmovement.de',
      website: 'https://kreuzbergmovement.de',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 52.5015,
      longitude: 13.4187,
      coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
      openingHours: JSON.stringify({
        mon: '06:30 - 21:30',
        tue: '06:30 - 21:30',
        wed: '06:30 - 21:30',
        thu: '06:30 - 21:30',
        fri: '06:30 - 21:00',
        sat: '08:30 - 19:00',
        sun: '09:00 - 18:00',
      }),
    },
  });

  // 3.6 Sydney (Australia)
  const bizSydney = await prisma.business.create({
    data: {
      ownerId: merchantSydney.id,
      name: 'Bondi Oceanfront Surf & Pilates Sanctuary',
      slug: 'bondi-oceanfront-pilates-sanctuary',
      description: 'Reformer pilates, restorative yoga, and coastal conditioning overlooking Bondi Beach. Includes cold plunge baths and recovery juice bar.',
      siret: 'ABN: 48 123 456 789',
      address: '142 Campbell Parade, Bondi Beach',
      city: 'Sydney',
      postcode: '2026',
      country: 'Australia',
      phone: '+61 2 9300 4589',
      email: 'chloe@bondipilates.com.au',
      website: 'https://bondipilates.com.au',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: -33.8915,
      longitude: 151.2767,
      coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 3.7 Dubai (UAE)
  const bizDubai = await prisma.business.create({
    data: {
      ownerId: merchantDubai.id,
      name: 'Al-Fanar Gourmet Dining & Marina Terrace',
      slug: 'al-fanar-gourmet-dubai',
      description: 'Authentic Emirati royal dining featuring slow-cooked lamb machboos, tiger prawn saloona, freshly baked khobz ragag, and fragrant saffron tea.',
      siret: 'TRN: 100293847500003',
      address: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
      city: 'Dubai',
      postcode: '00000',
      country: 'United Arab Emirates',
      phone: '+971 4 345 6789',
      email: 'tariq@alfanardubai.ae',
      website: 'https://alfanardubai.ae',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 25.1972,
      longitude: 55.2744,
      coverUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 3.8 Paris Spa (France)
  const bizParisSpa = await prisma.business.create({
    data: {
      ownerId: merchantParis.id,
      name: "L'Atelier Beauté & Spa Naturel",
      slug: 'latelier-beaute-spa-paris',
      description: 'Eco-certified botanical spa specializing in micro-circulation facial resets, essential oil body sculpting, and organic skincare.',
      siret: '91029384700024',
      address: '38 Quai de Valmy',
      city: 'Paris',
      postcode: '75010',
      country: 'France',
      phone: '+33 1 48 03 22 90',
      email: 'contact@atelierbeaute.fr',
      website: 'https://atelierbeaute-paris.fr',
      isVerified: true,
      verifiedAt: new Date(),
      status: 'ACTIVE',
      latitude: 48.8711,
      longitude: 2.3664,
      coverUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 4. Worldwide Offers in Native Currencies
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000); // Ending soon!

  // Offer 1: New York (USD)
  await prisma.offer.create({
    data: {
      businessId: bizNYC.id,
      categoryId: catFood.id,
      title: 'Grand DUMBO Feast: 18" Artisan Truffle Pizza + Garlic Knots + 2 Craft Sodas',
      description: 'Treat your friends to our famous slow-fermented organic dough pizza, topped with house-pulled mozzarella, black winter truffle oil, and shaved parmigiano reggiano.',
      terms: 'Valid Tuesday through Sunday for dine-in or take-out. Present voucher before ordering.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 4800, // $48.00
      discountPriceCents: 2900, // $29.00
      discountPercentage: 40,
      currency: 'USD',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 100,
      redemptionCount: 38,
      status: 'APPROVED',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      viewsCount: 612,
      clicksCount: 184,
    },
  });

  // Offer 2: London (GBP) - Ending Soon!
  await prisma.offer.create({
    data: {
      businessId: bizLondon.id,
      categoryId: catFood.id,
      title: 'Traditional Sunday Roast for Two with Yorkshire Puddings & Cask Ale Flight',
      description: 'Enjoy 28-day dry-aged Yorkshire beef or slow-roasted pork belly with beef dripping potatoes, oversized Yorkshire puddings, rich red wine gravy, and a tasting flight of 3 cask ales.',
      terms: 'Sundays only between 12:00 and 17:00. Booking recommended quoting your LocalDeals voucher.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 5200, // £52.00
      discountPriceCents: 3500, // £35.00
      discountPercentage: 33,
      currency: 'GBP',
      startsAt: now,
      endsAt: nextWeek, // Ending Soon!
      redemptionLimit: 60,
      redemptionCount: 29,
      status: 'APPROVED',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      viewsCount: 480,
      clicksCount: 142,
    },
  });

  // Offer 3: Tokyo (JPY)
  await prisma.offer.create({
    data: {
      businessId: bizTokyo.id,
      categoryId: catFood.id,
      title: 'Wagyu Tonkotsu Ramen Special Set: Extra Chashu + Crispy Gyoza + Craft Tea',
      description: 'Signature rich double-broth tonkotsu ramen with Miyazaki Wagyu beef slices, seasoned soft-boiled ajitama egg, 5 pan-fried artisan pork gyoza, and chilled hojicha.',
      terms: 'Valid all open hours. Show your voucher at the vending machine counter to redeem.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 240000, // ¥2,400
      discountPriceCents: 160000, // ¥1,600
      discountPercentage: 33,
      currency: 'JPY',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 120,
      redemptionCount: 47,
      status: 'APPROVED',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      viewsCount: 890,
      clicksCount: 295,
    },
  });

  // Offer 4: Paris Bakery (EUR)
  const offerBoulangerie = await prisma.offer.create({
    data: {
      businessId: bizParis.id,
      categoryId: catFood.id,
      title: 'Artisan Lunch Special: Gourmet Sourdough Sandwich + Fresh Juice + Chocolate Eclair',
      description: 'Authentic Parisian lunch with traditional sourdough baguette (free-range roasted chicken or truffle ham & comte), freshly squeezed juice, and a handmade pastry of the day.',
      terms: 'Valid Monday to Friday 11:30 - 14:30. Take-away or dine-in counter.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 1450, // 14.50 €
      discountPriceCents: 990,  // 9.90 €
      discountPercentage: 32,
      currency: 'EUR',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 100,
      redemptionCount: 24,
      status: 'APPROVED',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      viewsCount: 520,
      clicksCount: 160,
    },
  });

  // Offer 5: Berlin HIIT & Sauna (EUR)
  await prisma.offer.create({
    data: {
      businessId: bizBerlin.id,
      categoryId: catSport.id,
      title: '3-Session Discovery Pass: Boutique Functional Training + Finnish Sauna Access',
      description: 'Access three coach-led athletic conditioning workouts in our loft studio, plus full access to our cedarwood Finnish sauna and recovery room.',
      terms: 'Valid for new members over a 30-day window from first class booking.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 7500, // 75.00 €
      discountPriceCents: 3900, // 39.00 €
      discountPercentage: 48,
      currency: 'EUR',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 50,
      redemptionCount: 19,
      status: 'APPROVED',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      viewsCount: 340,
      clicksCount: 88,
    },
  });

  // Offer 6: Sydney Reformer Pilates (AUD) - Ending Soon!
  await prisma.offer.create({
    data: {
      businessId: bizSydney.id,
      categoryId: catSport.id,
      title: 'Bondi Coastal Reformer Pilates Duo: 2 Studio Classes + Superfood Green Smoothie',
      description: 'Strengthen, tone, and align with two high-intensity dynamic reformer pilates classes with oceanfront breezes, followed by our signature superfood recovery smoothie.',
      terms: 'Grip socks required. Valid for 21 days from purchase.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 6500, // A$65.00
      discountPriceCents: 3800, // A$38.00
      discountPercentage: 42,
      currency: 'AUD',
      startsAt: now,
      endsAt: nextWeek, // Ending Soon!
      redemptionLimit: 40,
      redemptionCount: 18,
      status: 'APPROVED',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      viewsCount: 410,
      clicksCount: 115,
    },
  });

  // Offer 7: Dubai Royal Mezzeh Feast (AED)
  await prisma.offer.create({
    data: {
      businessId: bizDubai.id,
      categoryId: catFood.id,
      title: 'Royal Mezzeh & Charcoal Mixed Grill Feast for Two + Signature Saffron Tea',
      description: 'Experience authentic Emirati hospitality on our Downtown terrace overlooking Burj Khalifa. 6 hot/cold mezzehs, charcoal grilled lamb chops & shish tawook, and cardamom tea.',
      terms: 'Valid daily from 18:00 to 23:00. Prior table reservation requested.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 32000, // 320.00 AED
      discountPriceCents: 21000, // 210.00 AED
      discountPercentage: 34,
      currency: 'AED',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 75,
      redemptionCount: 22,
      status: 'APPROVED',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      viewsCount: 450,
      clicksCount: 104,
    },
  });

  // Offer 8: Paris Organic Botanical Facial (EUR)
  const offerSpa = await prisma.offer.create({
    data: {
      businessId: bizParisSpa.id,
      categoryId: catBeauty.id,
      title: 'Botanical Radiance Facial (50 min) & Personalized Skin Diagnostic',
      description: 'Deep pore detox, gentle plant-based enzymatic peeling, lymphatic contour massage, and organic glow mask tailored to your skin barrier.',
      terms: 'Appointment booking required. 1 voucher per guest.',
      discountType: 'FIXED_AMOUNT',
      originalPriceCents: 7500, // 75.00 €
      discountPriceCents: 4500, // 45.00 €
      discountPercentage: 40,
      currency: 'EUR',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 40,
      redemptionCount: 14,
      status: 'APPROVED',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      viewsCount: 380,
      clicksCount: 92,
    },
  });

  // Offer 9: Pending Review for Admin Moderation Test
  await prisma.offer.create({
    data: {
      businessId: bizNYC.id,
      categoryId: catFood.id,
      title: 'Brooklyn Sunset Rooftop Cocktail Hour: 2 Mixology Drinks & Truffle Fries (-40%)',
      description: 'Submitted by Sal for moderation: Enjoy panoramic views of the Manhattan skyline with 2 signature craft cocktails and loaded parmesan truffle fries.',
      terms: 'Valid Monday - Thursday 17:00 - 19:30. 21+ with valid ID.',
      discountType: 'PERCENTAGE',
      originalPriceCents: 4000, // $40.00
      discountPriceCents: 2400, // $24.00
      discountPercentage: 40,
      currency: 'USD',
      startsAt: now,
      endsAt: nextMonth,
      redemptionLimit: 30,
      redemptionCount: 0,
      status: 'PENDING_REVIEW',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      viewsCount: 0,
      clicksCount: 0,
    },
  });

  // 5. Pre-seeded Voucher for Lucas (Valid counter verification demo)
  await prisma.redemption.create({
    data: {
      offerId: offerBoulangerie.id,
      userId: residentLucas.id,
      code: 'LD-PARIS-8821',
      qrToken: 'v1.tok_sec_boulangerie_8821_proof:sig_verified_30yr',
      status: 'ACTIVE',
      expiresAt: nextWeek,
      guestEmail: residentLucas.email,
    },
  });

  // 6. Favorite for Lucas
  await prisma.favorite.create({
    data: {
      userId: residentLucas.id,
      offerId: offerSpa.id,
    },
  });

  // 7. Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorRole: 'ADMIN',
      action: 'WORLDWIDE_PLATFORM_INITIALIZED',
      targetType: 'SYSTEM',
      targetId: 'INIT-GLOBAL-001',
      details: JSON.stringify({ message: 'LocalDeals worldwide platform initialized across 7 countries and 8 metropolitan hubs' }),
    },
  });

  console.log('✔ Database successfully seeded with 8 global businesses across NYC, London, Tokyo, Paris, Berlin, Sydney, Dubai, 9 worldwide offers, and active vouchers!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
