import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const moderateSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'PAUSE']),
  reason: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: offerId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Administrator access required' }, { status: 403 });
    }

    const body = await request.json();
    const validated = moderateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Invalid moderation action' },
        { status: 400 }
      );
    }

    const { action, reason } = validated.data;

    let newStatus = 'APPROVED';
    if (action === 'REJECT') newStatus = 'REJECTED';
    if (action === 'PAUSE') newStatus = 'PAUSED';

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: newStatus,
        moderationReason: reason || null,
      },
      include: { business: true },
    });

    // Record admin audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: user.role,
        action: `OFFER_${action}D`,
        targetType: 'OFFER',
        targetId: offerId,
        details: JSON.stringify({
          previousStatus: updated.status,
          newStatus,
          reason,
          offerTitle: updated.title,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      offer: updated,
      message: `Offer status updated to ${newStatus}`,
    });
  } catch (error: any) {
    console.error('Admin moderation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
