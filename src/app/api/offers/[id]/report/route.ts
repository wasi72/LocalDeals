import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const reportSchema = z.object({
  reporterEmail: z.string().email('Valid email required'),
  reporterName: z.string().optional(),
  reason: z.string().min(3, 'Reason is required'),
  details: z.string().min(5, 'Please provide more details on the issue'),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: offerId } = await params;
    const user = await getCurrentUser();
    const body = await request.json();

    const validated = reportSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        offerId,
        reporterEmail: user?.email || validated.data.reporterEmail,
        reporterName: user?.name || validated.data.reporterName || null,
        reason: validated.data.reason,
        details: validated.data.details,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: 'Thank you. Your report has been submitted to the moderation team for investigation.',
    });
  } catch (error: any) {
    console.error('Report submission error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
