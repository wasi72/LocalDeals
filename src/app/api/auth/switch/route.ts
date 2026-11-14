import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, email } = body;

    let targetUser = null;

    if (email) {
      targetUser = await prisma.user.findUnique({
        where: { email },
      });
    } else if (role) {
      targetUser = await prisma.user.findFirst({
        where: { role: role.toUpperCase() },
      });
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Target persona user not found' }, { status: 404 });
    }

    const cookieStore = await cookies();
    cookieStore.set('ld_user_id', targetUser.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
      message: `Active persona switched to ${targetUser.name} (${targetUser.role})`,
    });
  } catch (error: any) {
    console.error('Switch auth error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
