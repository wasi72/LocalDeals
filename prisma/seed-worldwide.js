const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const WORLDWIDE_CITIES = [
  {
    name: 'Toronto',
    country: 'Canada',
    currency: 'CAD',
    postcode: 'M5V 2H1',
    address: '422 Queen Street West',
    lat: 43.6487,
    lng: -79.3986,
    bizName: 'Queen West Artisan Roasters & Brunch Lab',
    desc: 'Specialty micro-lot coffee bar and seasonal brunch kitchen in downtown Toronto.',
    offerTitle: 'Gourmet Sourdough Brunch & Cold Brew Flight for Two',
    offerDesc: 'Two signature brunch mains (Avocado Tartine or Truffle Eggs Benedict) plus two nitro cold brews or handcrafted lattes.',
    terms: 'Valid on weekends between 8 AM and 2 PM. One voucher per table.',
    origCents: 4800,
    discCents: 2900,
    pct: 40,
    img: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    currency: 'SGD',
    postcode: '048582',
    address: '18 Telok Ayer Street, Chinatown Heritage Precinct',
    lat: 1.2825,
    lng: 103.8475,
    bizName: 'Telok Ayer Modern Tea Salon & Patisserie',
    desc: 'Award-winning artisanal pastry shop blending Japanese ceremonial matcha with French pastry techniques.',
    offerTitle: 'Ceremonial Matcha High Tea Experience: Pastry Tier + Hand-Whisked Teas',
    offerDesc: 'Three-tiered handcrafted pastries including matcha opera cake, yuzu tartlets, and warm pandan scones with 2 artisanal ceremonial teas.',
    terms: 'Reservation recommended. Valid Tuesday through Sunday.',
    origCents: 6800,
    discCents: 4200,
    pct: 38,
    img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'Los Angeles',
    country: 'United States',
    currency: 'USD',
    postcode: '90026',
    address: '1604 Sunset Boulevard, Echo Park',
    lat: 34.0782,
    lng: -118.2606,
    bizName: 'Sunset Echo Craft Tacos & Mezcaleria',
    desc: 'Handmade organic heirloom masa tortillas, wood-smoked meats, and small-batch agave cocktails in Silver Lake / Echo Park.',
    offerTitle: 'Artisan Taco Flight for Two + House Guacamole & Fresh Lime Margaritas',
    offerDesc: 'Six gourmet tacos of your choice, house-made stone-ground guacamole with heirloom tortilla chips, and two craft margaritas.',
    terms: 'Dine-in only. Valid daily after 4:00 PM.',
    origCents: 5600,
    discCents: 3400,
    pct: 39,
    img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'Chicago',
    country: 'United States',
    currency: 'USD',
    postcode: '60607',
    address: '912 W Randolph Street, West Loop',
    lat: 41.8845,
    lng: -86.6508,
    bizName: 'West Loop Smoke & Cellar Gastropub',
    desc: 'Fulton Market neighborhood kitchen celebrating wood-smoked artisanal charcuterie, dry-aged burgers, and Midwest craft beers.',
    offerTitle: 'Dry-Aged Burger & Craft Beer Pairing for Two',
    offerDesc: 'Two signature prime dry-aged brisket burgers with hand-cut rosemary truffle fries and a tasting flight of 4 local craft draft beers.',
    terms: 'Valid Sunday to Thursday for lunch or dinner.',
    origCents: 6200,
    discCents: 3800,
    pct: 39,
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'San Francisco',
    country: 'United States',
    currency: 'USD',
    postcode: '94110',
    address: '890 Valencia Street, Mission District',
    lat: 37.7599,
    lng: -122.4214,
    bizName: 'Mission Botanical Wellness & Facial Studio',
    desc: 'Holistic skin sanctuary in the Mission District using organic cold-pressed California botanical serums.',
    offerTitle: 'California Glow Botanical Facial (50 min) + LED Light Rejuvenation',
    offerDesc: 'Deep ultrasonic pore cleansing, customized organic herbal mask, neck and shoulder acupressure massage, and collagen-boosting LED therapy.',
    terms: 'Online booking required. Valid for new and returning clients.',
    origCents: 12000,
    discCents: 7500,
    pct: 38,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    catSlug: 'beauty-spa-wellness',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    currency: 'EUR',
    postcode: '08003',
    address: 'Passeig del Born 24, El Born',
    lat: 41.3855,
    lng: 2.1834,
    bizName: 'El Born Tapas Bar & Bodega',
    desc: 'Vibrant neighborhood bodega in El Born serving Iberian ham croquetas, grilled wild octopus, and local Catalan natural wines.',
    offerTitle: 'Artisan Tapas Degustation for Two + Bottle of Penedès Cava',
    offerDesc: 'Five chef-selected tapas plates (jamón ibérico de bellota, patatas bravas, padrón peppers, gambas al ajillo) paired with chilled artisanal Cava.',
    terms: 'Dine-in only. Valid evenings from 7:00 PM to 11:00 PM.',
    origCents: 5400,
    discCents: 3200,
    pct: 41,
    img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    currency: 'PKR',
    postcode: '54000',
    address: '12-C Main Boulevard, Gulberg III',
    lat: 31.5126,
    lng: 74.3486,
    bizName: 'Gulberg Artisan Chai & Charcoal Kitchen',
    desc: 'Contemporary heritage cafe serving traditional slow-brewed karak chai, stuffed tandoori parathas, and charcoal grilled kebabs in Lahore.',
    offerTitle: 'Royal Lahore High Chai & Tandoori Platter for Two',
    offerDesc: 'Handmade seekh kebabs, stuffed cheese & herb parathas, sweet gulab jamun, and two pots of slow-simmered cardamom matka chai.',
    terms: 'Valid daily from 4 PM to 11 PM. Dine-in or takeaway.',
    origCents: 380000,
    discCents: 220000,
    pct: 42,
    img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'Karachi',
    country: 'Pakistan',
    currency: 'PKR',
    postcode: '75500',
    address: '26th Street, Badar Commercial, DHA Phase V',
    lat: 24.8138,
    lng: 67.0422,
    bizName: 'Clifton Coast Specialty Coffee & Roastery',
    desc: 'Specialty coffee roastery in DHA Karachi featuring ethically sourced single-origin beans, sourdough sandwiches, and specialty desserts.',
    offerTitle: 'Specialty Pour-Over & Gourmet Breakfast for Two',
    offerDesc: 'Two hand-brewed specialty coffees, two artisan breakfast sourdough sandwiches, and a warm Belgian dark chocolate brownie.',
    terms: 'Valid daily from 8 AM to 1 PM. One voucher per bill.',
    origCents: 320000,
    discCents: 190000,
    pct: 41,
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
  {
    name: 'Melbourne',
    country: 'Australia',
    currency: 'AUD',
    postcode: '3000',
    address: '12 Flinders Lane, Melbourne CBD',
    lat: -37.8164,
    lng: 144.9701,
    bizName: 'Flinders Lane Specialty Espresso Bar',
    desc: 'Celebrated Melbourne laneway cafe serving award-winning single-origin flat whites, seasonal pastries, and avocado smash.',
    offerTitle: 'Laneway Breakfast & Specialty Coffee Pairing for Two',
    offerDesc: 'Two house avocado smash sourdough toasts with poached organic eggs and two Melbourne single-origin flat whites or cold brews.',
    terms: 'Valid 7 AM to 2 PM Monday through Saturday.',
    origCents: 4400,
    discCents: 2600,
    pct: 41,
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    catSlug: 'dining-food-cafes',
  },
];

async function seedWorldwide() {
  console.log('Seeding extended worldwide cities...');
  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));
  const defaultCatId = categories[0].id;

  const now = new Date();
  const ends30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  for (const c of WORLDWIDE_CITIES) {
    const slug = `${c.bizName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${c.name.toLowerCase()}`;
    const merchantEmail = `merchant.${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@localdeals-hub.com`;

    const user = await prisma.user.upsert({
      where: { email: merchantEmail },
      update: {},
      create: {
        email: merchantEmail,
        name: `Merchant (${c.name})`,
        role: 'MERCHANT',
        city: c.name,
        postcode: c.postcode,
      },
    });

    const biz = await prisma.business.upsert({
      where: { slug },
      update: {},
      create: {
        ownerId: user.id,
        name: c.bizName,
        slug,
        description: c.desc,
        address: c.address,
        city: c.name,
        postcode: c.postcode,
        country: c.country,
        isVerified: true,
        status: 'ACTIVE',
        latitude: c.lat,
        longitude: c.lng,
      },
    });

    // Check if offer exists for this business
    const existingOffer = await prisma.offer.findFirst({
      where: { businessId: biz.id },
    });

    if (!existingOffer) {
      await prisma.offer.create({
        data: {
          businessId: biz.id,
          categoryId: catMap.get(c.catSlug) || defaultCatId,
          title: c.offerTitle,
          description: c.offerDesc,
          terms: c.terms,
          discountType: 'FIXED_AMOUNT',
          originalPriceCents: c.origCents,
          discountPriceCents: c.discCents,
          discountPercentage: c.pct,
          currency: c.currency,
          isFeatured: true,
          status: 'APPROVED',
          startsAt: now,
          endsAt: ends30Days,
          redemptionLimit: 75,
          imageUrl: c.img,
        },
      });
      console.log(`+ Seeded offer in ${c.name} (${c.currency}): "${c.offerTitle}"`);
    } else {
      console.log(`- Offer in ${c.name} already exists.`);
    }
  }

  console.log('Worldwide cities seeding complete!');
}

seedWorldwide()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
