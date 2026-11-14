import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateCouponCode, generateSignedQrToken, generateQrCodeDataUrl } from '@/lib/redemptions';
import { isOfferActive } from '@/lib/discounts';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: offerId } = await params;
    const user = await getCurrentUser();

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { business: true },
    });

    if (!offer) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    // Check validity
    const check = isOfferActive(
      offer.status,
      offer.startsAt,
      offer.endsAt,
      offer.redemptionLimit,
      offer.redemptionCount
    );

    if (!check.active) {
      return NextResponse.json(
        { success: false, error: check.reason || 'This offer is not eligible for redemption' },
        { status: 400 }
      );
    }

    // Check if user already has an active voucher for this offer
    if (user) {
      const existing = await prisma.redemption.findFirst({
        where: {
          offerId,
          userId: user.id,
          status: 'ACTIVE',
        },
      });

      if (existing) {
        const qrCodeUrl = await generateQrCodeDataUrl(existing.qrToken);
        return NextResponse.json({
          success: true,
          voucher: existing,
          qrCodeUrl,
          message: 'Retrieved your existing active voucher',
        });
      }
    }

    // Generate new redemption voucher
    const code = generateCouponCode(offer.business.city);
    // Voucher valid until offer expiry or 7 days, whichever is earlier
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiresAt = offer.endsAt < in7Days ? offer.endsAt : in7Days;

    const qrToken = generateSignedQrToken(offer.id, code, expiresAt);
    const qrCodeUrl = await generateQrCodeDataUrl(qrToken);

    // Atomic transaction: create redemption and increment offer redemption counter
    const [redemption] = await prisma.$transaction([
      prisma.redemption.create({
        data: {
          offerId: offer.id,
          userId: user?.id || null,
          guestEmail: user?.email || null,
          code,
          qrToken,
          status: 'ACTIVE',
          expiresAt,
        },
      }),
      prisma.offer.update({
        where: { id: offer.id },
        data: {
          redemptionCount: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      voucher: redemption,
      qrCodeUrl,
      message: 'Voucher claimed successfully! Show this at the business counter.',
    });
  } catch (error: any) {
    console.error('Redeem voucher error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
