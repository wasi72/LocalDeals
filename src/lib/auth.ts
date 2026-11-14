import { cookies } from 'next/headers';
import prisma from './db';

export type UserRole = 'RESIDENT' | 'MERCHANT' | 'ADMIN';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  city?: string | null;
  postcode?: string | null;
  businessId?: string | null;
}

/**
 * Retrieves the current session user.
 * In a full production rollout, this integrates with NextAuth / Supabase Auth.
 * For flexible local testing & deployment, it checks a secure cookie or falls back to the default resident persona.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const activeUserId = cookieStore.get('ld_user_id')?.value;

    if (activeUserId) {
      const user = await prisma.user.findUnique({
        where: { id: activeUserId },
        include: { businesses: { select: { id: true } } },
      });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          city: user.city,
          postcode: user.postcode,
          businessId: user.businesses[0]?.id || null,
        };
      }
    }

    // Default to Resident Lucas for instant preview
    const defaultUser = await prisma.user.findFirst({
      where: { role: 'RESIDENT' },
    });

    if (defaultUser) {
      return {
        id: defaultUser.id,
        email: defaultUser.email,
        name: defaultUser.name,
        role: defaultUser.role as UserRole,
        city: defaultUser.city,
        postcode: defaultUser.postcode,
        businessId: null,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Permission checks
 */
export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === 'ADMIN';
}

export function isMerchant(user: SessionUser | null): boolean {
  return user?.role === 'MERCHANT' || user?.role === 'ADMIN';
}

export function canManageBusiness(user: SessionUser | null, businessOwnerId: string): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return user.id === businessOwnerId;
}
