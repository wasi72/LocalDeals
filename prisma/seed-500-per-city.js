const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CITIES = [
  {
    name: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
    lat: 35.6762,
    lng: 139.6503,
    postcode: '160-0023',
    neighborhoods: ['Shinjuku', 'Shibuya', 'Ginza', 'Asakusa', 'Roppongi', 'Akihabara', 'Harajuku', 'Omotesando', 'Ueno', 'Tsukiji', 'Nakameguro'],
    priceMultiplier: 100, // JPY: e.g. 250000 = ¥2,500
  },
  {
    name: 'New York',
    country: 'United States',
    currency: 'USD',
    lat: 40.7128,
    lng: -74.006,
    postcode: '10001',
    neighborhoods: ['DUMBO', 'Williamsburg', 'SoHo', 'West Village', 'Flatiron', 'Chelsea', 'East Village', 'Tribeca', 'Harlem', 'Bushwick', 'Lower East Side'],
    priceMultiplier: 1, // USD: e.g. 3500 = $35.00
  },
  {
    name: 'London',
    country: 'United Kingdom',
    currency: 'GBP',
    lat: 51.5074,
    lng: -0.1278,
    postcode: 'WC2E 9HA',
    neighborhoods: ['Covent Garden', 'Soho', 'Mayfair', 'Shoreditch', 'Borough', 'Camden', 'Notting Hill', 'Kensington', 'Marylebone', 'Fitzrovia', 'Richmond'],
    priceMultiplier: 0.85, // GBP: e.g. 3000 = £30.00
  },
  {
    name: 'Paris',
    country: 'France',
    currency: 'EUR',
    lat: 48.8566,
    lng: 2.3522,
    postcode: '75011',
    neighborhoods: ['Le Marais', 'Montmartre', 'Saint-Germain', 'Oberkampf', 'Canal Saint-Martin', 'Bastille', 'Latin Quarter', 'Belleville', 'Opéra', 'Batignolles'],
    priceMultiplier: 0.95, // EUR: e.g. 3200 = €32.00
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    currency: 'PKR',
    lat: 31.5204,
    lng: 74.3587,
    postcode: '54000',
    neighborhoods: ['Gulberg III', 'DHA Phase 5', 'DHA Phase 3', 'Mall Road', 'MM Alam Road', 'Model Town', 'Johar Town', 'Anarkali', 'Cantt', 'Faisal Town'],
    priceMultiplier: 80, // PKR: e.g. 250000 = Rs. 2,500
  },
  {
    name: 'Karachi',
    country: 'Pakistan',
    currency: 'PKR',
    lat: 24.8607,
    lng: 67.0011,
    postcode: '75500',
    neighborhoods: ['Clifton Block 4', 'DHA Phase 6', 'DHA Phase 5', 'Do Darya', 'Bahadurabad', 'Burns Road', 'Tipu Sultan Road', 'PECHS', 'Boat Basin', 'KDA'],
    priceMultiplier: 80, // PKR: e.g. 250000 = Rs. 2,500
  },
  {
    name: 'Burewala',
    country: 'Pakistan',
    currency: 'PKR',
    lat: 30.1587,
    lng: 72.6784,
    postcode: '61010',
    neighborhoods: ['Main Multan Road', 'Arif Bazar', 'College Chowk', 'Model Town', 'Grain Market', 'Chichawatni Road', 'Gulshan-e-Rehman', 'Vehari Road', 'Stadium Road', 'Housing Colony'],
    priceMultiplier: 60, // PKR: e.g. 180000 = Rs. 1,800
  },
  {
    name: 'Chichawatni',
    country: 'Pakistan',
    currency: 'PKR',
    lat: 30.5333,
    lng: 72.7001,
    postcode: '57200',
    neighborhoods: ['G.T. Road Bypass', 'Main Circular Road', 'Railway Road', 'Main Bazar', 'Bypass Adda', 'Model Town', 'Kamalia Road', 'Sahiwal Road', 'Purana Bazar', 'Grain Market'],
    priceMultiplier: 60, // PKR: e.g. 180000 = Rs. 1,800
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    currency: 'AED',
    lat: 25.2048,
    lng: 55.2708,
    postcode: '00000',
    neighborhoods: ['Downtown Dubai', 'Dubai Marina', 'JBR Beach', 'Palm Jumeirah', 'DIFC', 'Al Barsha', 'Business Bay', 'City Walk', 'Deira Creek', 'Al Quoz'],
    priceMultiplier: 3.67, // AED: e.g. 15000 = 150 AED
  },
  {
    name: 'Rome',
    country: 'Italy',
    currency: 'EUR',
    lat: 41.9028,
    lng: 12.4964,
    postcode: '00186',
    neighborhoods: ['Trastevere', 'Piazza Navona', 'Rione Monti', 'Campo de\' Fiori', 'Testaccio', 'Prati', 'Spanish Steps', 'San Lorenzo', 'Colosseo', 'Parioli'],
    priceMultiplier: 0.95, // EUR
  },
  {
    name: 'Toronto',
    country: 'Canada',
    currency: 'CAD',
    lat: 43.6532,
    lng: -79.3832,
    postcode: 'M5V 2H1',
    neighborhoods: ['Queen West', 'Yorkville', 'Kensington Market', 'Distillery District', 'King West', 'Ossington', 'Annex', 'Roncesvalles', 'Danforth', 'Financial District'],
    priceMultiplier: 1.35, // CAD
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    currency: 'SGD',
    lat: 1.3521,
    lng: 103.8198,
    postcode: '048582',
    neighborhoods: ['Telok Ayer', 'Tanjong Pagar', 'Orchard Road', 'Katong', 'Tiong Bahru', 'Marina Bay', 'Bugis', 'Chinatown', 'Clarke Quay', 'Kampong Glam'],
    priceMultiplier: 1.35, // SGD
  },
  {
    name: 'Sydney',
    country: 'Australia',
    currency: 'AUD',
    lat: -33.8688,
    lng: 151.2093,
    postcode: '2026',
    neighborhoods: ['Bondi Beach', 'Surry Hills', 'Manly Beach', 'Paddington', 'Darlinghurst', 'Newtown', 'Barangaroo', 'CBD', 'Double Bay', 'Coogee Beach'],
    priceMultiplier: 1.5, // AUD
  },
  {
    name: 'Berlin',
    country: 'Germany',
    currency: 'EUR',
    lat: 52.52,
    lng: 13.405,
    postcode: '10997',
    neighborhoods: ['Mitte', 'Kreuzberg', 'Friedrichshain', 'Prenzlauer Berg', 'Neukölln', 'Charlottenburg', 'Schöneberg', 'Wedding', 'Moabit', 'Tiergarten'],
    priceMultiplier: 0.95, // EUR
  },
  {
    name: 'Los Angeles',
    country: 'United States',
    currency: 'USD',
    lat: 34.0522,
    lng: -118.2437,
    postcode: '90012',
    neighborhoods: ['Silver Lake', 'Venice Beach', 'West Hollywood', 'Santa Monica', 'Echo Park', 'Downtown LA', 'Beverly Hills', 'Culver City', 'Los Feliz', 'Pasadena'],
    priceMultiplier: 1, // USD
  },
];

// 55 Business Archetypes across categories
const BIZ_TEMPLATES = [
  // Dining (20 Archetypes)
  { name: 'Wood-Fired Sourdough Pizzeria', catSlug: 'dining-food-cafes', icon: 'pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
  { name: 'Artisan Roast & Single Origin Coffee', catSlug: 'dining-food-cafes', icon: 'coffee', img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
  { name: 'Heirloom Organic Bakery & Pastry Lab', catSlug: 'dining-food-cafes', icon: 'bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Traditional Charcoal Grill & Smokehouse', catSlug: 'dining-food-cafes', icon: 'bbq', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Authentic Handcrafted Ramen Bar', catSlug: 'dining-food-cafes', icon: 'ramen', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { name: 'Edomae Omakase Sushi Counter', catSlug: 'dining-food-cafes', icon: 'sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Seaside Coastal Seafood & Oyster Bar', catSlug: 'dining-food-cafes', icon: 'seafood', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80' },
  { name: 'Heritage Clay Pot Chai & Paratha House', catSlug: 'dining-food-cafes', icon: 'tea', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Contemporary Trattoria & Fresh Pasta', catSlug: 'dining-food-cafes', icon: 'pasta', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Craft Burger Lab & Belgian Frites', catSlug: 'dining-food-cafes', icon: 'burger', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ceremonial Matcha Salon & High Tea', catSlug: 'dining-food-cafes', icon: 'matcha', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80' },
  { name: 'Plant-Based Farm-to-Table Kitchen', catSlug: 'dining-food-cafes', icon: 'vegan', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { name: 'Traditional Dim Sum & Dumpling House', catSlug: 'dining-food-cafes', icon: 'dumpling', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gourmet Brunch & Avocado Toast Lab', catSlug: 'dining-food-cafes', icon: 'brunch', img: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Charcoal Yakitori & Craft Beer Tap', catSlug: 'dining-food-cafes', icon: 'yakitori', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { name: 'Spanish Tapas Bodega & Natural Wine', catSlug: 'dining-food-cafes', icon: 'tapas', img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Heirloom Tacos & Small-Batch Mezcal', catSlug: 'dining-food-cafes', icon: 'tacos', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
  { name: 'Artisan Gelato & Warm Dessert House', catSlug: 'dining-food-cafes', icon: 'gelato', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Traditional Shinwari Karahi & Dhabba', catSlug: 'dining-food-cafes', icon: 'karahi', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pure Desi Sweets & Rabri Kulfi Bar', catSlug: 'dining-food-cafes', icon: 'sweets', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80' },

  // Wellness & Spas (10 Archetypes)
  { name: 'Botanical Radiance Facial & Skin Spa', catSlug: 'beauty-spa-wellness', icon: 'facial', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hinoki Cedar Mineral Bath & Onsen', catSlug: 'beauty-spa-wellness', icon: 'onsen', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { name: 'Deep Tissue Aromatherapy Sanctuary', catSlug: 'beauty-spa-wellness', icon: 'massage', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' },
  { name: 'Himalayan Salt Floatation & Detox Suite', catSlug: 'beauty-spa-wellness', icon: 'float', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80' },
  { name: 'Eucalyptus Hammam & Kessa Scrub House', catSlug: 'beauty-spa-wellness', icon: 'hammam', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { name: 'Infrared Sauna & Contrast Plunge Spa', catSlug: 'beauty-spa-wellness', icon: 'sauna', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sea Mineral Body Polish & Glow Lab', catSlug: 'beauty-spa-wellness', icon: 'bodywork', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ayurvedic Herbal Therapy & Shirodhara', catSlug: 'beauty-spa-wellness', icon: 'ayurveda', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gold Leaf Anti-Aging Skin Clinic', catSlug: 'beauty-spa-wellness', icon: 'gold-facial', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sensory Deprivation Restorative Lounge', catSlug: 'beauty-spa-wellness', icon: 'sensory', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80' },

  // Hair Salons & Barbershops (7 Archetypes)
  { name: 'Heritage Straight-Razor Master Barbershop', catSlug: 'hair-salons-barbershops', icon: 'barber', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Japanese Carbonated Scalp & Head Spa', catSlug: 'hair-salons-barbershops', icon: 'headspa', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80' },
  { name: 'Precision Styling & Balayage Atelier', catSlug: 'hair-salons-barbershops', icon: 'styling', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Organic Keratin & Scalp Health Lounge', catSlug: 'hair-salons-barbershops', icon: 'keratin', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80' },
  { name: 'Old Town Shave Parlor & Hot Towels', catSlug: 'hair-salons-barbershops', icon: 'shave', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gentlemen\'s Beard Spa & Grooming Club', catSlug: 'hair-salons-barbershops', icon: 'beard', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Botanical Color Lab & Precision Haircut', catSlug: 'hair-salons-barbershops', icon: 'color', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },

  // Fitness & Movement (8 Archetypes)
  { name: 'Athletic Reformer Pilates & Core Lab', catSlug: 'fitness-yoga-movement', icon: 'pilates', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { name: 'High-Intensity Boxing & Functional HIIT', catSlug: 'fitness-yoga-movement', icon: 'boxing', img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Vinyasa Yoga & Tibetan Sound Sanctuary', catSlug: 'fitness-yoga-movement', icon: 'yoga', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80' },
  { name: 'Strength & Conditioning CrossFit Box', catSlug: 'fitness-yoga-movement', icon: 'crossfit', img: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rhythm Spin Cycling & Cardio Club', catSlug: 'fitness-yoga-movement', icon: 'cycle', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Indoor Bouldering & Movement Loft', catSlug: 'fitness-yoga-movement', icon: 'climbing', img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mindful Mobility & Aerial Hammock Studio', catSlug: 'fitness-yoga-movement', icon: 'aerial', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80' },
  { name: 'Performance Athletic Recovery & Ice Bath', catSlug: 'fitness-yoga-movement', icon: 'recovery', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },

  // Boutiques & Specialty Shops (5 Archetypes)
  { name: 'Artisan Full-Grain Leather Workshop', catSlug: 'boutiques-specialty-shops', icon: 'leather', img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80' },
  { name: 'Vintage Vinyl Records & Turntable Vault', catSlug: 'boutiques-specialty-shops', icon: 'vinyl', img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80' },
  { name: 'Niche Botanical Perfumery & Custom Scent', catSlug: 'boutiques-specialty-shops', icon: 'perfume', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' },
  { name: 'Handcrafted Ceramic Pottery Atelier', catSlug: 'boutiques-specialty-shops', icon: 'pottery', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bespoke Tailoring & Handwoven Fabric', catSlug: 'boutiques-specialty-shops', icon: 'tailor', img: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80' },

  // Local Services & Artisans (5 Archetypes)
  { name: 'Mechanical Watchmaker & Clock Restoration', catSlug: 'services-artisans', icon: 'watch', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Master Bicycle Performance Overhaul', catSlug: 'services-artisans', icon: 'bike', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Waterstone Cutlery Sharpening Workshop', catSlug: 'services-artisans', icon: 'knives', img: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fine Art Picture Framing & Mounting', catSlug: 'services-artisans', icon: 'framing', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' },
  { name: 'Heritage Portrait Photography Session', catSlug: 'services-artisans', icon: 'photo', img: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80' },
];

// 10 Distinct Offer Archetypes per Business
const OFFER_VARIANTS = [
  {
    titlePrefix: 'Signature Tasting Feast for Two',
    descTemplate: (b, n) => `Complete chef-curated tasting menu including signature main, fresh accompaniments, and artisanal craft beverage in ${n}.`,
    terms: 'Valid daily for lunch or dinner. Reservation recommended.',
    baseOrig: 4500, baseDisc: 2700, pct: 40, isFeatured: true,
  },
  {
    titlePrefix: 'Deluxe VIP Discovery Experience',
    descTemplate: (b, n) => `Premium VIP package featuring priority access, complimentary upgrade, and exclusive artisanal tasting or treatment in ${n}.`,
    terms: 'Valid 7 days a week. One voucher per party.',
    baseOrig: 7500, baseDisc: 4500, pct: 40, isFeatured: true,
  },
  {
    titlePrefix: 'Weekend Special Pairing & Refreshment for Two',
    descTemplate: (b, n) => `Enjoy two signature items paired with handcrafted organic beverages and complimentary house sides in ${n}.`,
    terms: 'Valid on weekends. Walk-ins welcome.',
    baseOrig: 3600, baseDisc: 2200, pct: 39, isFeatured: false,
  },
  {
    titlePrefix: '3-Session Multi-Visit Discovery Pass',
    descTemplate: (b, n) => `Three full-access sessions or treatments over 30 days to experience everything ${b} has to offer in ${n}.`,
    terms: 'Valid 30 days from first visit. Non-transferable.',
    baseOrig: 6000, baseDisc: 3500, pct: 42, isFeatured: false,
  },
  {
    titlePrefix: 'Midweek Off-Peak Privilege Pass',
    descTemplate: (b, n) => `Exclusive 45% discount for visits between Monday and Thursday. Enjoy quieter hours with personalized attention in ${n}.`,
    terms: 'Valid Monday through Thursday only.',
    baseOrig: 4000, baseDisc: 2200, pct: 45, isFeatured: false,
  },
  {
    titlePrefix: 'Express Lunch / Fast Refreshment Package',
    descTemplate: (b, n) => `Fast-service high-value package tailored for busy neighborhood locals in ${n}. Guaranteed under 45 minutes.`,
    terms: 'Valid 11:30 AM to 2:30 PM on weekdays.',
    baseOrig: 2200, baseDisc: 1300, pct: 41, isFeatured: false,
  },
  {
    titlePrefix: 'Family & Group Sharing Platter (Serves 4)',
    descTemplate: (b, n) => `Generous multi-course sharing selection featuring popular house specialties for friends and family in ${n}.`,
    terms: 'Dine-in or takeaway. Serves up to 4 guests.',
    baseOrig: 8500, baseDisc: 5100, pct: 40, isFeatured: false,
  },
  {
    titlePrefix: 'Early Bird Sunrise Special',
    descTemplate: (b, n) => `Start your morning right with fresh single-origin beverage and signature house selection in ${n}.`,
    terms: 'Valid before 10:30 AM daily.',
    baseOrig: 1800, baseDisc: 1050, pct: 42, isFeatured: false,
  },
  {
    titlePrefix: 'Artisan Masterclass & Hands-On Workshop',
    descTemplate: (b, n) => `Join the master artisans at ${b} for an interactive 75-minute hands-on workshop including custom take-home item.`,
    terms: 'Advance booking required. All materials provided.',
    baseOrig: 9500, baseDisc: 5500, pct: 42, isFeatured: false,
  },
  {
    titlePrefix: '5-Visit Comprehensive Loyalty Pack',
    descTemplate: (b, n) => `The ultimate neighborhood package: five complete visits or sessions with priority booking privileges in ${n}.`,
    terms: 'Valid for 60 days from first redemption.',
    baseOrig: 12000, baseDisc: 6800, pct: 43, isFeatured: false,
  },
];

async function main() {
  console.log('======================================================');
  console.log('   LOCALDEALS 500+ DEALS PER CITY MASSIVE PROVISION   ');
  console.log('======================================================');

  // Fetch categories
  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));
  const defaultCatId = categories[0].id;

  const now = new Date();
  const endsAt = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

  let totalBusinessesCreated = 0;
  let totalOffersCreated = 0;

  for (const city of CITIES) {
    console.log(`\n[Generating] 500+ Deals for ${city.name} (${city.country}) in ${city.currency}...`);

    // Create a merchant user for this city
    const merchantEmail = `hub.partner.${city.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@localdeals-hub.com`;
    const merchant = await prisma.user.upsert({
      where: { email: merchantEmail },
      update: { city: city.name, postcode: city.postcode },
      create: {
        email: merchantEmail,
        name: `${city.name} Merchant Collective`,
        role: 'MERCHANT',
        city: city.name,
        postcode: city.postcode,
      },
    });

    const businessesToInsert = [];
    const offersToInsert = [];

    // Create 55 businesses for this city
    for (let bIdx = 0; bIdx < BIZ_TEMPLATES.length; bIdx++) {
      const template = BIZ_TEMPLATES[bIdx];
      const neighborhood = city.neighborhoods[bIdx % city.neighborhoods.length];
      const bizSlug = `${city.name.toLowerCase()}-${template.icon}-${bIdx + 1}-${Date.now().toString(36)}`;
      const bizId = `biz_${city.name.toLowerCase().slice(0, 3)}_${bIdx + 1}_${Date.now().toString(36)}`;
      const bizName = `${neighborhood} ${template.name}`;

      businessesToInsert.push({
        id: bizId,
        ownerId: merchant.id,
        name: bizName,
        slug: bizSlug,
        description: `Premier neighborhood establishment in ${neighborhood}, ${city.name}. Renowned for authentic local craftsmanship and warm hospitality.`,
        address: `${(bIdx + 1) * 7} ${neighborhood} Avenue`,
        city: city.name,
        postcode: city.postcode,
        country: city.country,
        latitude: city.lat !== 0 ? city.lat + (bIdx - 27) * 0.002 : 0,
        longitude: city.lng !== 0 ? city.lng + ((bIdx % 5) - 2) * 0.003 : 0,
        coverUrl: template.img,
        isVerified: true,
        status: 'ACTIVE',
      });

      // 10 distinct offers per business -> 550 offers per city!
      for (let oIdx = 0; oIdx < OFFER_VARIANTS.length; oIdx++) {
        const variant = OFFER_VARIANTS[oIdx];
        const offerId = `off_${city.name.toLowerCase().slice(0, 3)}_${bIdx + 1}_${oIdx + 1}_${Math.random().toString(36).slice(2, 7)}`;
        const origPrice = Math.round(variant.baseOrig * city.priceMultiplier);
        const discPrice = Math.round(variant.baseDisc * city.priceMultiplier);

        offersToInsert.push({
          id: offerId,
          businessId: bizId,
          categoryId: catMap.get(template.catSlug) || defaultCatId,
          title: `${variant.titlePrefix}: ${bizName}`,
          description: variant.descTemplate(bizName, neighborhood),
          terms: variant.terms,
          discountType: 'FIXED_AMOUNT',
          originalPriceCents: origPrice,
          discountPriceCents: discPrice,
          discountPercentage: variant.pct,
          currency: city.currency,
          isFeatured: variant.isFeatured && oIdx === 0,
          status: 'APPROVED',
          startsAt: now,
          endsAt: endsAt,
          redemptionLimit: 150,
          imageUrl: template.img,
        });
      }
    }

    // Batch insert businesses
    await prisma.business.createMany({
      data: businessesToInsert,
    });
    totalBusinessesCreated += businessesToInsert.length;

    // Batch insert offers in chunks of 200 for SQLite safety
    const CHUNK_SIZE = 200;
    for (let i = 0; i < offersToInsert.length; i += CHUNK_SIZE) {
      const chunk = offersToInsert.slice(i, i + CHUNK_SIZE);
      await prisma.offer.createMany({
        data: chunk,
      });
    }
    totalOffersCreated += offersToInsert.length;

    console.log(`  ✔ Created ${businessesToInsert.length} businesses and ${offersToInsert.length} offers for ${city.name}!`);
  }

  const grandTotalOffers = await prisma.offer.count({ where: { status: 'APPROVED' } });
  const grandTotalBusinesses = await prisma.business.count();

  console.log('\n======================================================');
  console.log('   MASSIVE PROVISIONING COMPLETE (100% GREEN)         ');
  console.log('======================================================');
  console.log(`Total New Businesses Inserted: ${totalBusinessesCreated}`);
  console.log(`Total New Offers Inserted:     ${totalOffersCreated}`);
  console.log(`Grand Total Active Offers:     ${grandTotalOffers}`);
  console.log(`Grand Total Active Businesses: ${grandTotalBusinesses}`);
}

main()
  .catch((e) => {
    console.error('Massive provisioning error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
