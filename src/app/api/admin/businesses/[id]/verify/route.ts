import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: businessId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Administrator access required' }, { status: 403 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: {
        isVerified: !business.isVerified,
        verifiedAt: !business.isVerified ? new Date() : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: user.role,
        action: updated.isVerified ? 'BUSINESS_VERIFIED' : 'BUSINESS_UNVERIFIED',
        targetType: 'BUSINESS',
        targetId: businessId,
        details: JSON.stringify({ businessName: updated.name, siret: updated.siret }),
      },
    });

    return NextResponse.json({
      success: true,
      business: updated,
      message: updated.isVerified ? 'Business marked as SIRET-verified' : 'Verification badge removed',
    });
  } catch (error: any) {
    console.error('Verify business error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
