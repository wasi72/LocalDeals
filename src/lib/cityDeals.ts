import prisma from '@/lib/db';
import { calculateDiscount } from '@/lib/discounts';
import {
  CityMetadata,
  CITY_SYNONYMS,
  KNOWN_GLOBAL_CITIES,
  normalizeCityName,
  resolveCityMetadata,
} from './cityUtils';

export type { CityMetadata };
export { CITY_SYNONYMS, KNOWN_GLOBAL_CITIES, normalizeCityName, resolveCityMetadata };

// In-memory mutex map to prevent concurrent SQLite write collisions
const provisioningLocks = new Map<string, Promise<any>>();

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
