import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateDiscount } from '@/lib/discounts';
import { normalizeCityName, ensureDealsForCity, resolveCityMetadata } from '@/lib/cityDeals';
import { z } from 'zod';

const createOfferSchema = z.object({
  businessId: z.string().min(1, 'Business is required'),
  categoryId: z.string().min(1, 'Category is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  terms: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BOGO', 'PERK']).default('FIXED_AMOUNT'),
  originalPriceCents: z.number().int().positive('Original price must be positive'),
  discountPriceCents: z.number().int().nonnegative('Discount price cannot be negative'),
  currency: z.string().min(3).max(4).default('USD'),
  redemptionLimit: z.number().int().positive().optional().nullable(),
  durationDays: z.number().int().min(1).max(90).default(30),
  imageUrl: z.string().url().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const rawCity = searchParams.get('city') || '';
    const country = searchParams.get('country') || '';
    const categorySlug = searchParams.get('category') || '';
    const endingSoon = searchParams.get('endingSoon') === 'true';
    const minDiscount = parseInt(searchParams.get('minDiscount') || '0', 10);
    const autoProvision = searchParams.get('auto') === 'true';

    const cleanCity = normalizeCityName(rawCity);
    const isWorldwide = !cleanCity || cleanCity.toLowerCase() === 'all' || cleanCity.toLowerCase() === 'worldwide';

    // Allow callers to specify limit (default 100 for worldwide, 600 for specific city)
    const defaultLimit = isWorldwide ? 120 : 600;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 2000) : defaultLimit;

    const now = new Date();

    const buildWhere = (cityQuery = cleanCity) => {
      const whereClause: any = {
        status: 'APPROVED',
        startsAt: { lte: now },
        endsAt: { gte: now },
      };

      if (query) {
        whereClause.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
          { business: { name: { contains: query } } },
          { business: { city: { contains: query } } },
          { business: { country: { contains: query } } },
        ];
      }

      if (!isWorldwide && cityQuery) {
        const meta = resolveCityMetadata(cityQuery);
        const resolvedName = meta.name;
        whereClause.business = {
          ...whereClause.business,
          OR: [
            { city: { contains: resolvedName } },
            { city: { contains: cityQuery } },
            { postcode: { startsWith: cityQuery } },
            { country: { contains: resolvedName } },
          ],
        };
      }

      if (country && country.toLowerCase() !== 'all' && country.toLowerCase() !== 'global') {
        whereClause.business = {
          ...whereClause.business,
          country: { contains: country },
        };
      }

      if (categorySlug && categorySlug !== 'all') {
        whereClause.category = {
          slug: categorySlug,
        };
      }

      if (minDiscount > 0) {
        whereClause.discountPercentage = {
          gte: minDiscount,
        };
      }

      if (endingSoon) {
        const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        whereClause.endsAt = {
          gte: now,
          lte: in7Days,
        };
      }

      return whereClause;
    };

    const where = buildWhere();

    // Total count of matching offers
    const totalCount = await prisma.offer.count({ where });

    // Fetch batch up to limit
    let offers = await prisma.offer.findMany({
      where,
      take: limit,
      include: {
        business: true,
        category: true,
        _count: {
          select: { redemptions: true, favorites: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { endsAt: 'asc' },
      ],
    });

    // If 0 offers found and novel city requested with autoProvision:
    if (totalCount === 0 && !isWorldwide && autoProvision && cleanCity.length >= 3) {
      await ensureDealsForCity(cleanCity);
      const updatedWhere = buildWhere();
      offers = await prisma.offer.findMany({
        where: updatedWhere,
        take: limit,
        include: {
          business: true,
          category: true,
          _count: {
            select: { redemptions: true, favorites: true },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { endsAt: 'asc' },
        ],
      });
    }

    const cityMeta = resolveCityMetadata(cleanCity);

    return NextResponse.json({
      success: true,
      totalCount: totalCount || offers.length,
      count: offers.length,
      limit,
      city: isWorldwide ? 'Worldwide' : cityMeta.name || cleanCity,
      country: isWorldwide ? 'Global' : cityMeta.country,
      currency: isWorldwide ? 'USD' : cityMeta.currency,
      offers,
    });
  } catch (error: any) {
    console.error('Offers fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createOfferSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const data = validated.data;

    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
    });

    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }

    if (business.ownerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to create offers for this business' },
        { status: 403 }
      );
    }

    const calc = calculateDiscount(data.originalPriceCents, data.discountPriceCents, data.currency);
    if (!calc.isValid) {
      return NextResponse.json(
        { success: false, error: calc.validationError || 'Invalid discount structure' },
        { status: 400 }
      );
    }

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + data.durationDays * 24 * 60 * 60 * 1000);

    const offer = await prisma.offer.create({
      data: {
        businessId: data.businessId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        terms: data.terms || null,
        discountType: data.discountType,
        originalPriceCents: data.originalPriceCents,
        discountPriceCents: data.discountPriceCents,
        discountPercentage: calc.discountPercentage,
        currency: data.currency || 'USD',
        startsAt,
        endsAt,
        redemptionLimit: data.redemptionLimit || null,
        status: user.role === 'ADMIN' ? 'APPROVED' : 'PENDING_REVIEW',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: user.role,
        action: 'OFFER_CREATED',
        targetType: 'OFFER',
        targetId: offer.id,
        details: JSON.stringify({ title: offer.title, currency: offer.currency, status: offer.status }),
      },
    });

    return NextResponse.json({
      success: true,
      offer,
      message:
        offer.status === 'APPROVED'
          ? 'Offer created and published live worldwide!'
          : 'Offer submitted for admin moderation review.',
    });
  } catch (error: any) {
    console.error('Create offer error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
