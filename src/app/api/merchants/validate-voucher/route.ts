import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { verifySignedQrToken } from '@/lib/redemptions';
import { z } from 'zod';

const validateVoucherSchema = z.object({
  identifier: z.string().min(3, 'Voucher code or QR token is required'),
  action: z.enum(['CHECK', 'REDEEM']).default('CHECK'),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'MERCHANT' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Only authorized business staff or administrators can validate vouchers' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = validateVoucherSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { identifier, action } = validated.data;
    const cleanId = identifier.trim();

    // Check if identifier is QR token or human-readable coupon code
    let redemption = null;

    if (cleanId.startsWith('v1.')) {
      // Cryptographic QR Token
      const tokenVerification = verifySignedQrToken(cleanId);
      if (!tokenVerification.valid) {
        return NextResponse.json(
          { success: false, error: `Invalid QR Voucher: ${tokenVerification.reason}` },
          { status: 400 }
        );
      }

      redemption = await prisma.redemption.findUnique({
        where: { qrToken: cleanId },
        include: {
          offer: {
            include: { business: true },
          },
          user: {
            select: { name: true, email: true },
          },
        },
      });
    } else {
      // Coupon code search (case-insensitive)
      redemption = await prisma.redemption.findFirst({
        where: {
          code: {
            equals: cleanId,
          },
        },
        include: {
          offer: {
            include: { business: true },
          },
          user: {
            select: { name: true, email: true },
          },
        },
      });
    }

    if (!redemption) {
      return NextResponse.json(
        { success: false, error: 'Voucher code not found in system' },
        { status: 404 }
      );
    }

    // Permission check: ensure merchant owns the business for this offer (unless admin)
    if (user.role !== 'ADMIN' && user.id !== redemption.offer.business.ownerId) {
      return NextResponse.json(
        {
          success: false,
          error: `This voucher belongs to "${redemption.offer.business.name}", not your registered business.`,
        },
        { status: 403 }
      );
    }

    // Status checks
    const now = new Date();
    if (redemption.status === 'USED') {
      return NextResponse.json(
        {
          success: false,
          status: 'ALREADY_USED',
          redeemedAt: redemption.redeemedAt,
          error: `This voucher was already redeemed on ${redemption.redeemedAt?.toLocaleString('fr-FR')}. Cannot be reused.`,
          redemption,
        },
        { status: 400 }
      );
    }

    if (redemption.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, status: 'CANCELLED', error: 'This voucher has been cancelled' },
        { status: 400 }
      );
    }

    if (now > redemption.expiresAt) {
      return NextResponse.json(
        { success: false, status: 'EXPIRED', error: 'This voucher has expired' },
        { status: 400 }
      );
    }

    // If action is CHECK, return the valid details so merchant can inspect
    if (action === 'CHECK') {
      return NextResponse.json({
        success: true,
        status: 'VALID',
        message: 'Voucher is authentic, active and ready to be redeemed.',
        redemption,
      });
    }

    // If action is REDEEM, mark as USED
    const updated = await prisma.redemption.update({
      where: { id: redemption.id },
      data: {
        status: 'USED',
        redeemedAt: now,
      },
      include: {
        offer: {
          include: { business: true },
        },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: user.role,
        action: 'VOUCHER_REDEEMED',
        targetType: 'REDEMPTION',
        targetId: redemption.id,
        details: JSON.stringify({
          code: redemption.code,
          offerTitle: redemption.offer.title,
          businessName: redemption.offer.business.name,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      status: 'SUCCESSFULLY_REDEEMED',
      message: `Voucher ${redemption.code} redeemed successfully! Apply discount now.`,
      redemption: updated,
    });
  } catch (error: any) {
    console.error('Merchant voucher validation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
