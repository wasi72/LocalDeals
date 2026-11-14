import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        offers: {
          some: {
            status: 'APPROVED',
          },
        },
      },
      select: {
        city: true,
        country: true,
        _count: {
          select: {
            offers: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
    });

    const cityMap = new Map<string, { city: string; country: string; dealCount: number }>();
    for (const b of businesses) {
      const key = `${b.city}`.toLowerCase();
      const existing = cityMap.get(key);
      if (existing) {
        existing.dealCount += b._count.offers;
      } else {
        cityMap.set(key, {
          city: b.city,
          country: b.country,
          dealCount: b._count.offers,
        });
      }
    }

    return NextResponse.json({
      success: true,
      cities: Array.from(cityMap.values()),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
