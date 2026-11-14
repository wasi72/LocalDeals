const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Comprehensive Global Deals for Tokyo, NYC, London, Paris, Pakistan, and Global Hubs...');

  // 1. Delete junk businesses and test records (e.g. 'Bure', 'Chich', 'Chicha', 'Tokio')
  const junkCities = ['Bure', 'Chich', 'Chicha', 'Tokio'];
  const junkBiz = await prisma.business.findMany({
    where: { city: { in: junkCities } },
    select: { id: true },
  });
  if (junkBiz.length > 0) {
    const ids = junkBiz.map((b) => b.id);
    await prisma.offer.deleteMany({ where: { businessId: { in: ids } } });
    await prisma.business.deleteMany({ where: { id: { in: ids } } });
    console.log(`Cleaned up ${ids.length} junk businesses.`);
  }

  // 2. Fetch categories
  const categories = await prisma.category.findMany();
  const catMap = {};
  for (const c of categories) {
    catMap[c.slug] = c.id;
  }
  const defaultCatId = categories[0].id;

  // Helper to get or create merchant
  async function getOrCreateMerchant(email, name, city, postcode, phone) {
    return await prisma.user.upsert({
      where: { email },
      update: { name, city, postcode, phone },
      create: {
        email,
        name,
        role: 'MERCHANT',
        city,
        postcode,
        phone,
      },
    });
  }

  // Helper to upsert business and offer
  async function seedBizAndOffer({
    merchantEmail,
    merchantName,
    city,
    postcode,
    country,
    bizName,
    slug,
    desc,
    address,
    lat,
    lng,
    phone,
    coverUrl,
    catSlug,
    title,
    offerDesc,
    terms,
    origCents,
    discCents,
    pct,
    currency,
    isFeatured = false,
    daysValid = 30,
    imageUrl,
  }) {
    const merchant = await getOrCreateMerchant(
      merchantEmail,
      merchantName,
      city,
      postcode,
      phone
    );

    const biz = await prisma.business.upsert({
      where: { slug },
      update: {
        name: bizName,
        description: desc,
        address,
        city,
        postcode,
        country,
        latitude: lat,
        longitude: lng,
        phone,
        coverUrl,
        isVerified: true,
        status: 'ACTIVE',
      },
      create: {
        ownerId: merchant.id,
        name: bizName,
        slug,
        description: desc,
        address,
        city,
        postcode,
        country,
        latitude: lat,
        longitude: lng,
        phone,
        coverUrl,
        isVerified: true,
        status: 'ACTIVE',
      },
    });

    const now = new Date();
    const endsAt = new Date(now.getTime() + daysValid * 24 * 60 * 60 * 1000);

    const existingOffer = await prisma.offer.findFirst({
      where: {
        businessId: biz.id,
        title,
      },
    });

    if (!existingOffer) {
      await prisma.offer.create({
        data: {
          businessId: biz.id,
          categoryId: catMap[catSlug] || defaultCatId,
          title,
          description: offerDesc,
          terms,
          discountType: 'FIXED_AMOUNT',
          originalPriceCents: origCents,
          discountPriceCents: discCents,
          discountPercentage: pct,
          currency,
          isFeatured,
          status: 'APPROVED',
          startsAt: now,
          endsAt,
          redemptionLimit: 100,
          imageUrl,
        },
      });
      console.log(`[+] Added Deal: "${title}" in ${city} (${currency})`);
    } else {
      await prisma.offer.update({
        where: { id: existingOffer.id },
        data: {
          originalPriceCents: origCents,
          discountPriceCents: discCents,
          discountPercentage: pct,
          currency,
          endsAt,
          status: 'APPROVED',
        },
      });
    }
  }

  // ==========================================
  // 1. TOKYO (JAPAN) - 6 DIVERSE AUTHENTIC DEALS
  // ==========================================
  // Deal 1: Ramen
  await seedBizAndOffer({
    merchantEmail: 'kenji@menyamusashi.jp',
    merchantName: 'Kenji Takahashi',
    city: 'Tokyo',
    postcode: '160-0023',
    country: 'Japan',
    bizName: 'Menya Musashi Premium Ramen Bar',
    slug: 'menya-musashi-shinjuku',
    desc: 'Renowned Shinjuku ramen master crafting 16-hour simmered double-soup broth with hand-pulled thick noodles and flame-torched chashu.',
    address: '7-2-6 Nishi-Shinjuku, K-1 Bldg 1F',
    lat: 35.6946,
    lng: 139.6983,
    phone: '+81 3-5321-9876',
    coverUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Wagyu Tonkotsu Ramen Special Set: Extra Chashu + Crispy Gyoza + Craft Tea',
    offerDesc: 'Rich slow-simmered Kurobuta tonkotsu ramen with extra flame-charred pork belly chashu, 5 pan-fried gyoza, and chilled hojicha.',
    terms: 'Valid daily 11:30 AM to 9:30 PM. One voucher per person. Dine-in only.',
    origCents: 280000,
    discCents: 180000,
    pct: 36,
    currency: 'JPY',
    isFeatured: true,
    daysValid: 30,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  });

  // Deal 2: Ginza Edomae Omakase Sushi
  await seedBizAndOffer({
    merchantEmail: 'saito@ginzasushi-tokyo.jp',
    merchantName: 'Master Jiro Saito',
    city: 'Tokyo',
    postcode: '104-0061',
    country: 'Japan',
    bizName: 'Ginza Saito Edomae Sushi Counter',
    slug: 'ginza-saito-sushi-tokyo',
    desc: 'Intimate 8-seat Ginza sushi counter sourcing wild seafood daily from Toyosu Market, aged red-vinegar shari, and bespoke sake.',
    address: '5-7-10 Ginza, Chuo-ku, Ginza New Bldg B1F',
    lat: 35.6719,
    lng: 139.7648,
    phone: '+81 3-3571-0988',
    coverUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Chef\'s 10-Piece Seasonal Omakase Nigiri + Chawanmushi & Akami Handroll',
    offerDesc: 'Handcrafted seasonal nigiri including Otoro, Akami, Shima-Aji, and Hokkaido Uni, accompanied by steamed silky egg custard and red miso.',
    terms: 'Reservation recommended 24h prior. Valid Tuesday through Sunday lunch and dinner.',
    origCents: 750000,
    discCents: 450000,
    pct: 40,
    currency: 'JPY',
    isFeatured: true,
    daysValid: 25,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  });

  // Deal 3: Asakusa Uji Matcha & Wagashi Tea House
  await seedBizAndOffer({
    merchantEmail: 'yuki@saryou-asakusa.jp',
    merchantName: 'Yuki Morimoto',
    city: 'Tokyo',
    postcode: '111-0032',
    country: 'Japan',
    bizName: 'Kissa Saryo Uji Matcha Lounge',
    slug: 'kissa-saryo-matcha-asakusa',
    desc: 'Historic Asakusa tea retreat serving first-harvest ceremonial Uji matcha, handmade seasonal wagashi, and matcha mont blanc.',
    address: '2-1-12 Asakusa, Taito-ku',
    lat: 35.7148,
    lng: 139.7967,
    phone: '+81 3-3844-3321',
    coverUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Ceremonial Uji Matcha High Tea & Handcrafted Wagashi Degustation for Two',
    offerDesc: 'Two hand-whisked ceremonial matcha bowls served with freshly dusted matcha warabi mochi, red bean dorayaki, and matcha gelato.',
    terms: 'Valid 10:00 AM to 6:00 PM daily. Dine-in tea garden seating.',
    origCents: 380000,
    discCents: 220000,
    pct: 42,
    currency: 'JPY',
    isFeatured: false,
    daysValid: 40,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
  });

  // Deal 4: Roppongi Hinoki Onsen & Herbal Spa
  await seedBizAndOffer({
    merchantEmail: 'kaori@hinokispa-roppongi.jp',
    merchantName: 'Kaori Tanaka',
    city: 'Tokyo',
    postcode: '106-0032',
    country: 'Japan',
    bizName: 'Roppongi Hills Hinoki Onsen & Herbal Spa',
    slug: 'roppongi-hinoki-onsen-spa',
    desc: 'Private Japanese cedar mineral bath sanctuary in Roppongi Hills offering therapeutic hot spring mineral soaks and Shiatsu acupressure.',
    address: '6-10-1 Roppongi, Minato-ku, Keyakizaka 3F',
    lat: 35.6605,
    lng: 139.7292,
    phone: '+81 3-6406-8899',
    coverUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    catSlug: 'beauty-spa-wellness',
    title: 'Private Hinoki Cedar Mineral Bath (60 min) + Restorative Shiatsu Massage',
    offerDesc: 'Exclusive cedar wood onsen mineral soak infused with natural hot spring salts, followed by a 45-minute therapeutic full-body Shiatsu massage.',
    terms: 'Booking required online. Includes private changing suite and complimentary green tea.',
    origCents: 1150000,
    discCents: 680000,
    pct: 41,
    currency: 'JPY',
    isFeatured: true,
    daysValid: 20,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  });

  // Deal 5: Omotesando Botanical Head Spa & Hair Studio
  await seedBizAndOffer({
    merchantEmail: 'daisuke@omotesando-headspa.jp',
    merchantName: 'Daisuke Endo',
    city: 'Tokyo',
    postcode: '150-0001',
    country: 'Japan',
    bizName: 'Omotesando Botanical Hair Spa & Studio',
    slug: 'omotesando-botanical-hair-spa',
    desc: 'Celebrated Harajuku/Omotesando Japanese head spa specializing in carbonated water scalp detox, herbal steam, and organic hair masks.',
    address: '4-12-10 Jingumae, Shibuya-ku',
    lat: 35.6672,
    lng: 139.7093,
    phone: '+81 3-5413-7722',
    coverUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    catSlug: 'hair-salons-barbershops',
    title: 'Japanese Carbonated Head Spa Scalp Detox (50 min) + Precision Cut & Styling',
    offerDesc: 'Ultrasonic carbonated water scalp treatment, pressure point head and shoulder massage, organic argan oil hair infusion, and custom cut.',
    terms: 'Valid Tuesday through Sunday. Appointment required.',
    origCents: 850000,
    discCents: 520000,
    pct: 39,
    currency: 'JPY',
    isFeatured: false,
    daysValid: 35,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
  });

  // Deal 6: Shibuya Boutique Reformer Pilates Lab
  await seedBizAndOffer({
    merchantEmail: 'mio@shibuya-pilates.jp',
    merchantName: 'Mio Watanabe',
    city: 'Tokyo',
    postcode: '150-0042',
    country: 'Japan',
    bizName: 'Shibuya Movement & Reformer Pilates Lab',
    slug: 'shibuya-reformer-pilates-lab',
    desc: 'High-energy boutique athletic reformer studio in central Shibuya with small group classes, core conditioning, and recovery lounge.',
    address: '1-14-14 Udagawacho, Shibuya-ku, B1F',
    lat: 35.6618,
    lng: 139.6989,
    phone: '+81 3-6416-5501',
    coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    catSlug: 'fitness-yoga-movement',
    title: '3-Class Boutique Reformer Pilates Discovery Pass + Electrolyte Elixir',
    offerDesc: 'Three 50-minute athletic reformer pilates group sessions guided by certified master trainers. Includes grip socks and post-workout drink.',
    terms: 'Valid for new clients. 30-day class activation window.',
    origCents: 600000,
    discCents: 360000,
    pct: 40,
    currency: 'JPY',
    isFeatured: false,
    daysValid: 30,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  });

  // ==========================================
  // 2. PAKISTAN - BUREWALA & CHICHAWATNI & LAHORE & KARACHI
  // ==========================================
  // Burewala Deal 1: BBQ & Karahi
  await seedBizAndOffer({
    merchantEmail: 'tariq@burewala-bbq.pk',
    merchantName: 'Tariq Mehmood',
    city: 'Burewala',
    postcode: '61010',
    country: 'Pakistan',
    bizName: 'Burewala Heritage Charcoal BBQ & Shinwari Karahi',
    slug: 'burewala-heritage-bbq-shinwari',
    desc: 'Famous Burewala open-air dhabba and family dining known for live charcoal mutton shinwari, tandoori boti, and fresh tandoori naan.',
    address: 'Main Multan Road, Near College Chowk',
    lat: 30.1587,
    lng: 72.6784,
    phone: '+92 300 8765432',
    coverUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Live Shinwari Mutton Karahi & Charcoal BBQ Feast for Two',
    offerDesc: '1kg freshly slaughtered Shinwari mutton karahi simmered with tomatoes and green chilies, 4 seekh kebabs, 4 hot roghani naans, and mint raita.',
    terms: 'Valid daily 6:00 PM to 12:00 AM. Dine-in or family hall seating.',
    origCents: 260000,
    discCents: 155000,
    pct: 40,
    currency: 'PKR',
    isFeatured: true,
    daysValid: 30,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  });

  // Burewala Deal 2: Dairy & Sweets
  await seedBizAndOffer({
    merchantEmail: 'asif@burewala-sweets.pk',
    merchantName: 'Asif Gujjar',
    city: 'Burewala',
    postcode: '61010',
    country: 'Pakistan',
    bizName: 'Royal Dairy Sweets & Doodh Jalebi House',
    slug: 'royal-dairy-sweets-burewala',
    desc: 'Pure buffalo milk confectionery, piping hot saffron jalebi, kheer, and artisanal khoya barfi in central Arif Bazar, Burewala.',
    address: 'Arif Bazar, Burewala',
    lat: 30.1555,
    lng: 72.6821,
    phone: '+92 301 7654321',
    coverUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Hot Doodh Jalebi & Khoya Barfi Dessert Platter for Two + Karak Chai',
    offerDesc: 'Crisp saffron jalebis served in hot condensed saffron milk, accompanied by a 500g sampler of fresh pistachio khoya barfi and 2 cups of dhabba chai.',
    terms: 'Valid daily from 4 PM to 11 PM.',
    origCents: 140000,
    discCents: 85000,
    pct: 39,
    currency: 'PKR',
    isFeatured: false,
    daysValid: 40,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  });

  // Chichawatni Deal 1: Sajji & BBQ
  await seedBizAndOffer({
    merchantEmail: 'hamza@chichawatni-sajji.pk',
    merchantName: 'Hamza Baloch',
    city: 'Chichawatni',
    postcode: '57200',
    country: 'Pakistan',
    bizName: 'Chichawatni Famous Balochi Sajji & Dera',
    slug: 'chichawatni-famous-balochi-sajji',
    desc: 'Renowned highway dera on G.T. Road serving authentic slow-roasted Balochi whole lamb and chicken sajji over wood embers with spiced basmati rice.',
    address: 'G.T. Road Bypass, Near Chichawatni Interchange',
    lat: 30.5333,
    lng: 72.7001,
    phone: '+92 302 6543210',
    coverUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Full Charcoal Roasted Chicken Sajji + Spiced Basmati Rice & Mint Raita for Two',
    offerDesc: 'One whole marinated chicken roasted slowly over embers until crispy and juicy, served over aromatic basmati rice with kachumber salad and special chutneys.',
    terms: 'Valid daily 1:00 PM to 11:30 PM. Dine-in or takeaway.',
    origCents: 210000,
    discCents: 125000,
    pct: 40,
    currency: 'PKR',
    isFeatured: true,
    daysValid: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  });

  // Chichawatni Deal 2: Chai & Naan
  await seedBizAndOffer({
    merchantEmail: 'rehman@chichawatni-tea.pk',
    merchantName: 'Abdul Rehman',
    city: 'Chichawatni',
    postcode: '57200',
    country: 'Pakistan',
    bizName: 'Al-Madina Heritage Chai & Bakarkhani Bakery',
    slug: 'al-madina-chai-bakery-chichawatni',
    desc: 'Traditional clay cup matka chai, freshly baked crispy sweet and savory bakarkhani, and stuffed kulchas in main bazar Chichawatni.',
    address: 'Main Circular Road, Chichawatni',
    lat: 30.5312,
    lng: 72.6985,
    phone: '+92 303 5432109',
    coverUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Clay Matka Cardamom Chai & Warm Layered Bakarkhani Pairing for Two',
    offerDesc: 'Two piping-hot slow-boiled cardamom milk teas served in handmade clay cups, accompanied by two fresh tandoori flaky bakarkhanis with honey.',
    terms: 'Valid morning to midnight daily.',
    origCents: 100000,
    discCents: 60000,
    pct: 40,
    currency: 'PKR',
    isFeatured: false,
    daysValid: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  });

  // Lahore Deals:
  await seedBizAndOffer({
    merchantEmail: 'kamran@gulberg-chai.pk',
    merchantName: 'Kamran Ali',
    city: 'Lahore',
    postcode: '54000',
    country: 'Pakistan',
    bizName: 'Gulberg Artisan Chai & Charcoal Kitchen',
    slug: 'gulberg-artisan-chai-kitchen-lahore',
    desc: 'Contemporary heritage cafe serving traditional slow-brewed karak chai, stuffed tandoori parathas, and charcoal grilled kebabs in Lahore.',
    address: '12-C Main Boulevard, Gulberg III',
    lat: 31.5126,
    lng: 74.3486,
    phone: '+92 42 35789012',
    coverUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Royal Lahore High Chai & Tandoori Platter for Two',
    offerDesc: 'Handmade seekh kebabs, stuffed cheese & herb parathas, sweet gulab jamun, and two pots of slow-simmered cardamom matka chai.',
    terms: 'Valid daily from 4 PM to 11 PM. Dine-in or takeaway.',
    origCents: 380000,
    discCents: 220000,
    pct: 42,
    currency: 'PKR',
    isFeatured: true,
    daysValid: 30,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  });

  await seedBizAndOffer({
    merchantEmail: 'saad@dha-coffee.pk',
    merchantName: 'Saad Farooq',
    city: 'Lahore',
    postcode: '54792',
    country: 'Pakistan',
    bizName: 'DHA Phase 5 Specialty Coffee Roasters',
    slug: 'dha-phase-5-coffee-roasters-lahore',
    desc: 'Third-wave micro roastery in DHA Phase 5 offering single-origin African and Colombian beans, artisanal sourdough toasts, and cold brew.',
    address: 'Plaza 45, Sector C Commercial, DHA Phase 5',
    lat: 31.4722,
    lng: 74.4094,
    phone: '+92 42 35890123',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
    title: 'Artisan Sourdough Brunch & Specialty Pour-Over Flight for Two',
    offerDesc: 'Two signature brunch dishes (Smoked Salmon Tartine or Scrambled Truffle Brioche) with two hand-poured single-origin filter coffees.',
    terms: 'Valid 8:00 AM to 3:00 PM daily.',
    origCents: 320000,
    discCents: 195000,
    pct: 39,
    currency: 'PKR',
    isFeatured: false,
    daysValid: 25,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  });

  console.log('Finished comprehensive global seeding successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
