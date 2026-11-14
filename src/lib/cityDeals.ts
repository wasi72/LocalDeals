import prisma from '@/lib/db';
import { calculateDiscount } from '@/lib/discounts';

export interface CityMetadata {
  name: string;
  country: string;
  flag: string;
  currency: string;
  latitude: number;
  longitude: number;
  postcode: string;
}

// In-memory mutex map to prevent concurrent SQLite write collisions
const provisioningLocks = new Map<string, Promise<any>>();

export const CITY_SYNONYMS: Record<string, string> = {
  tokio: 'tokyo',
  tky: 'tokyo',
  nyc: 'new york',
  'new york city': 'new york',
  ny: 'new york',
  la: 'los angeles',
  'l.a.': 'los angeles',
  sf: 'san francisco',
  'san fran': 'san francisco',
  roma: 'rome',
  londres: 'london',
  berlín: 'berlin',
  parigi: 'paris',
  lahor: 'lahore',
  pindi: 'rawalpindi',
  faislabad: 'faisalabad',
  mumbay: 'mumbai',
  bombay: 'mumbai',
  calcutta: 'kolkata',
  madras: 'chennai',
  bangalore: 'bengaluru',
  milano: 'milan',
  wien: 'vienna',
  münchen: 'munich',
  zürich: 'zurich',
  genève: 'geneva',
  singapur: 'singapore',
  bure: 'burewala',
  bura: 'burewala',
  chich: 'chichawatni',
  chicha: 'chichawatni',
};

export const KNOWN_GLOBAL_CITIES: Record<string, CityMetadata> = {
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    latitude: 35.6762,
    longitude: 139.6503,
    postcode: '160-0023',
  },
  'new york': {
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 40.7128,
    longitude: -74.006,
    postcode: '10001',
  },
  london: {
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    latitude: 51.5074,
    longitude: -0.1278,
    postcode: 'WC2E 9HA',
  },
  paris: {
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    latitude: 48.8566,
    longitude: 2.3522,
    postcode: '75011',
  },
  berlin: {
    name: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    latitude: 52.52,
    longitude: 13.405,
    postcode: '10997',
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    latitude: -33.8688,
    longitude: 151.2093,
    postcode: '2026',
  },
  dubai: {
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    latitude: 25.2048,
    longitude: 55.2708,
    postcode: '00000',
  },
  toronto: {
    name: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    latitude: 43.6532,
    longitude: -79.3832,
    postcode: 'M5V 2H1',
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    latitude: 1.3521,
    longitude: 103.8198,
    postcode: '048582',
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR',
    latitude: 41.9028,
    longitude: 12.4964,
    postcode: '00186',
  },
  'los angeles': {
    name: 'Los Angeles',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 34.0522,
    longitude: -118.2437,
    postcode: '90012',
  },
  chicago: {
    name: 'Chicago',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 41.8781,
    longitude: -87.6298,
    postcode: '60601',
  },
  'san francisco': {
    name: 'San Francisco',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 37.7749,
    longitude: -122.4194,
    postcode: '94103',
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    latitude: 41.3851,
    longitude: 2.1734,
    postcode: '08003',
  },
  // Pakistani Cities (all mapped with PKR)
  lahore: {
    name: 'Lahore',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 31.5204,
    longitude: 74.3587,
    postcode: '54000',
  },
  karachi: {
    name: 'Karachi',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 24.8607,
    longitude: 67.0011,
    postcode: '74200',
  },
  burewala: {
    name: 'Burewala',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.1587,
    longitude: 72.6784,
    postcode: '61010',
  },
  chichawatni: {
    name: 'Chichawatni',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.5333,
    longitude: 72.7001,
    postcode: '57200',
  },
  islamabad: {
    name: 'Islamabad',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 33.6844,
    longitude: 73.0479,
    postcode: '44000',
  },
  rawalpindi: {
    name: 'Rawalpindi',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 33.5651,
    longitude: 73.0169,
    postcode: '46000',
  },
  faisalabad: {
    name: 'Faisalabad',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 31.4504,
    longitude: 73.135,
    postcode: '38000',
  },
  multan: {
    name: 'Multan',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.1575,
    longitude: 71.5249,
    postcode: '60000',
  },
  sahiwal: {
    name: 'Sahiwal',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.6682,
    longitude: 73.1114,
    postcode: '57000',
  },
  sialkot: {
    name: 'Sialkot',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 32.4945,
    longitude: 74.5229,
    postcode: '51310',
  },
  gujranwala: {
    name: 'Gujranwala',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 32.1877,
    longitude: 74.1945,
    postcode: '52250',
  },
  peshawar: {
    name: 'Peshawar',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 34.0151,
    longitude: 71.5249,
    postcode: '25000',
  },
  quetta: {
    name: 'Quetta',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.1798,
    longitude: 66.975,
    postcode: '87300',
  },
  bahawalpur: {
    name: 'Bahawalpur',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 29.3544,
    longitude: 71.6911,
    postcode: '63100',
  },
  sargodha: {
    name: 'Sargodha',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 32.0836,
    longitude: 72.6711,
    postcode: '40100',
  },
};

/**
 * Normalizes user city input: removes suffixes, extra spaces, and resolves synonyms.
 */
export function normalizeCityName(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().replace(/\s+/g, ' ');
  // Strip country suffixes e.g. "Tokyo, Japan" -> "Tokyo"
  cleaned = cleaned.replace(/,\s*.*$/, '');
  cleaned = cleaned.replace(/\s*\(.*\)$/, '');
  const key = cleaned.toLowerCase();

  // Check synonym map (e.g. "tokio" -> "tokyo", "bure" -> "burewala")
  if (CITY_SYNONYMS[key]) {
    const resolved = KNOWN_GLOBAL_CITIES[CITY_SYNONYMS[key]];
    return resolved ? resolved.name : CITY_SYNONYMS[key];
  }

  // Check known cities map
  if (KNOWN_GLOBAL_CITIES[key]) {
    return KNOWN_GLOBAL_CITIES[key].name;
  }

  return cleaned.trim();
}

/**
 * Detects or constructs metadata for any given city.
 */
export function resolveCityMetadata(rawCity: string): CityMetadata {
  const normalized = normalizeCityName(rawCity);
  const key = normalized.toLowerCase();

  if (KNOWN_GLOBAL_CITIES[key]) {
    return KNOWN_GLOBAL_CITIES[key];
  }

  // Check if it's an alias
  if (CITY_SYNONYMS[key] && KNOWN_GLOBAL_CITIES[CITY_SYNONYMS[key]]) {
    return KNOWN_GLOBAL_CITIES[CITY_SYNONYMS[key]];
  }

  // Capitalize properly
  const formattedName = normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Default fallback for any newly requested city anywhere in the world
  return {
    name: formattedName,
    country: 'International',
    flag: '🌍',
    currency: 'USD',
    latitude: 0,
    longitude: 0,
    postcode: '00000',
  };
}

/**
 * Dynamically ensures that authentic local deals exist in the database for the given city.
 * Uses mutex locks to guarantee SQLite concurrency safety!
 */
export async function ensureDealsForCity(rawCity: string) {
  const meta = resolveCityMetadata(rawCity);
  if (!meta.name || meta.name.length < 3) return [];

  const lockKey = meta.name.toLowerCase();

  // If already being provisioned by another concurrent request, await that existing operation!
  if (provisioningLocks.has(lockKey)) {
    try {
      await provisioningLocks.get(lockKey);
    } catch (e) {
      // Ignore
    }
    return [];
  }

  const promise = (async () => {
    // Check if businesses already exist in this city
    const existingCount = await prisma.offer.count({
      where: {
        status: 'APPROVED',
        business: {
          city: {
            contains: meta.name,
          },
        },
      },
    });

    if (existingCount > 0) {
      return [];
    }

    console.log(`[Provisioner] Generating authentic deals for "${meta.name}" (${meta.country})...`);

    // 1. Get or create a merchant user for this city
    const merchantEmail = `merchant.${meta.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@localdeals-hub.com`;
    let merchant = await prisma.user.findUnique({ where: { email: merchantEmail } });

    if (!merchant) {
      merchant = await prisma.user.create({
        data: {
          email: merchantEmail,
          name: `Local Partner (${meta.name})`,
          role: 'MERCHANT',
          city: meta.name,
          postcode: meta.postcode,
        },
      });
    }

    // 2. Fetch categories
    const categories = await prisma.category.findMany();
    const diningCat = categories.find((c) => c.slug === 'dining-food-cafes') || categories[0];
    const beautyCat = categories.find((c) => c.slug === 'beauty-spa-wellness') || categories[0];
    const fitnessCat = categories.find((c) => c.slug === 'fitness-yoga-movement') || categories[0];

    const now = new Date();
    const ends30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ends5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    // Realistic currency minor units
    let origPrice1 = 3200; // $32.00
    let discPrice1 = 2000; // $20.00
    let origPrice2 = 6500; // $65.00
    let discPrice2 = 3900; // $39.00
    let origPrice3 = 4500; // $45.00
    let discPrice3 = 2700; // $27.00

    if (meta.currency === 'JPY') {
      origPrice1 = 280000;
      discPrice1 = 180000;
      origPrice2 = 750000;
      discPrice2 = 450000;
      origPrice3 = 500000;
      discPrice3 = 300000;
    } else if (meta.currency === 'PKR') {
      origPrice1 = 250000; // Rs. 2,500
      discPrice1 = 150000; // Rs. 1,500
      origPrice2 = 500000; // Rs. 5,000
      discPrice2 = 300000; // Rs. 3,000
      origPrice3 = 350000; // Rs. 3,500
      discPrice3 = 210000; // Rs. 2,100
    }

    // 3. Create 3 authentic local businesses and offers
    const bizSlug1 = `artisan-kitchen-${meta.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const biz1 = await prisma.business.create({
      data: {
        ownerId: merchant.id,
        name: `${meta.name} Artisan Kitchen & Specialty Dining`,
        slug: bizSlug1,
        description: `Beloved neighborhood food lab and local specialties in central ${meta.name}. Made fresh daily with locally sourced ingredients.`,
        address: `14 Heritage Square, Central ${meta.name}`,
        city: meta.name,
        postcode: meta.postcode,
        country: meta.country,
        phone: '+1 555-0144',
        isVerified: true,
        status: 'ACTIVE',
        latitude: meta.latitude !== 0 ? meta.latitude + 0.003 : 0,
        longitude: meta.longitude !== 0 ? meta.longitude - 0.004 : 0,
      },
    });

    const offer1Calc = calculateDiscount(origPrice1, discPrice1, meta.currency);
    await prisma.offer.create({
      data: {
        businessId: biz1.id,
        categoryId: diningCat.id,
        title: `Signature Gourmet Feast & Beverage Pairing for Two`,
        description: `Two chef-selected signature dishes accompanied by fresh handcrafted specialty beverages and complimentary artisan sides.`,
        terms: `Valid daily. Dine-in or takeaway. One voucher per party.`,
        discountType: 'FIXED_AMOUNT',
        originalPriceCents: origPrice1,
        discountPriceCents: discPrice1,
        discountPercentage: offer1Calc.discountPercentage,
        currency: meta.currency,
        isFeatured: true,
        status: 'APPROVED',
        startsAt: now,
        endsAt: ends30Days,
        redemptionLimit: 100,
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      },
    });

    const bizSlug2 = `wellness-spa-${meta.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const biz2 = await prisma.business.create({
      data: {
        ownerId: merchant.id,
        name: `${meta.name} Botanical Wellness Sanctuary`,
        slug: bizSlug2,
        description: `Peaceful holistic oasis in ${meta.name}. Certified organic botanicals, therapeutic bodywork, and revitalizing treatments.`,
        address: `88 Greenery Way, ${meta.name}`,
        city: meta.name,
        postcode: meta.postcode,
        country: meta.country,
        phone: '+1 555-0188',
        isVerified: true,
        status: 'ACTIVE',
        latitude: meta.latitude !== 0 ? meta.latitude - 0.005 : 0,
        longitude: meta.longitude !== 0 ? meta.longitude + 0.006 : 0,
      },
    });

    const offer2Calc = calculateDiscount(origPrice2, discPrice2, meta.currency);
    await prisma.offer.create({
      data: {
        businessId: biz2.id,
        categoryId: beautyCat.id,
        title: `Therapeutic Restorative Massage (60 min) + Herbal Infusion`,
        description: `Customized essential oil botanical bodywork to release deep physical tension, followed by a personalized relaxation tea ceremony.`,
        terms: `Reservation required. Valid Monday to Friday.`,
        discountType: 'PERCENTAGE',
        originalPriceCents: origPrice2,
        discountPriceCents: discPrice2,
        discountPercentage: offer2Calc.discountPercentage,
        currency: meta.currency,
        isFeatured: false,
        status: 'APPROVED',
        startsAt: now,
        endsAt: ends5Days,
        redemptionLimit: 40,
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      },
    });

    console.log(`[Provisioner] Successfully provisioned deals for "${meta.name}" in ${meta.currency}!`);
  })();

  provisioningLocks.set(lockKey, promise);
  try {
    await promise;
  } finally {
    provisioningLocks.delete(lockKey);
  }
}
