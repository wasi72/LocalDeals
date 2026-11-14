import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: offerId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Please log in to save deals' }, { status: 401 });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_offerId: {
          userId: user.id,
          offerId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, isFavorited: false, message: 'Removed from saved deals' });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          offerId,
        },
      });
      return NextResponse.json({ success: true, isFavorited: true, message: 'Deal saved to your favorites!' });
    }
  } catch (error: any) {
    console.error('Favorite error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
