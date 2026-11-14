/**
 * LocalDeals Financial & Discount Math Engine (Worldwide Multi-Currency)
 * Designed to prevent IEEE-754 floating point arithmetic issues by using integer cents / minor units.
 * Complies with the EU Omnibus Directive (Directive (EU) 2019/2161) and global FTC / CMA price transparency standards.
 */

export interface DiscountCalculation {
  originalPriceCents: number;
  discountPriceCents: number;
  savingsCents: number;
  discountPercentage: number;
  formattedOriginalPrice: string;
  formattedDiscountPrice: string;
  formattedSavings: string;
  currency: string;
  isValid: boolean;
  validationError?: string;
}

const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  EUR: 'fr-FR',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CAD: 'en-CA',
  AUD: 'en-AU',
  INR: 'en-IN',
  AED: 'en-AE',
  SGD: 'en-SG',
};

/**
 * Formats integer cents/minor units to a localized currency string.
 * Example: 1450, 'USD' -> "$14.50"
 * Example: 1450, 'EUR' -> "14,50 €"
 * Example: 180000, 'JPY' -> "¥1,800"
 */
export function formatCurrency(
  cents: number,
  currency = 'EUR',
  explicitLocale?: string
): string {
  const normCurrency = (currency || 'EUR').toUpperCase();
  const locale = explicitLocale || CURRENCY_LOCALES[normCurrency] || 'en-US';

  // Zero-decimal currencies like JPY
  if (normCurrency === 'JPY') {
    const amount = Math.round(cents / 100);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const majorUnits = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: normCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorUnits);
}

/**
 * Calculates discount and validates against price transparency regulations.
 */
export function calculateDiscount(
  originalCents: number,
  discountCents: number,
  currency = 'EUR'
): DiscountCalculation {
  if (originalCents <= 0) {
    return {
      originalPriceCents: originalCents,
      discountPriceCents: discountCents,
      savingsCents: 0,
      discountPercentage: 0,
      formattedOriginalPrice: formatCurrency(Math.max(0, originalCents), currency),
      formattedDiscountPrice: formatCurrency(Math.max(0, discountCents), currency),
      formattedSavings: formatCurrency(0, currency),
      currency,
      isValid: false,
      validationError: 'Original price must be strictly greater than 0',
    };
  }

  if (discountCents < 0) {
    return {
      originalPriceCents: originalCents,
      discountPriceCents: discountCents,
      savingsCents: 0,
      discountPercentage: 0,
      formattedOriginalPrice: formatCurrency(originalCents, currency),
      formattedDiscountPrice: formatCurrency(0, currency),
      formattedSavings: formatCurrency(0, currency),
      currency,
      isValid: false,
      validationError: 'Discount price cannot be negative',
    };
  }

  if (discountCents >= originalCents) {
    return {
      originalPriceCents: originalCents,
      discountPriceCents: discountCents,
      savingsCents: 0,
      discountPercentage: 0,
      formattedOriginalPrice: formatCurrency(originalCents, currency),
      formattedDiscountPrice: formatCurrency(discountCents, currency),
      formattedSavings: formatCurrency(0, currency),
      currency,
      isValid: false,
      validationError: 'Discount price must be less than the original baseline price',
    };
  }

  const savingsCents = originalCents - discountCents;
  const discountPercentage = Math.round((savingsCents / originalCents) * 100);

  return {
    originalPriceCents: originalCents,
    discountPriceCents: discountCents,
    savingsCents: savingsCents,
    discountPercentage: discountPercentage,
    formattedOriginalPrice: formatCurrency(originalCents, currency),
    formattedDiscountPrice: formatCurrency(discountCents, currency),
    formattedSavings: formatCurrency(savingsCents, currency),
    currency,
    isValid: true,
  };
}

/**
 * Validates offer date constraints.
 */
export function isOfferActive(
  status: string,
  startsAt: Date | string,
  endsAt: Date | string,
  redemptionLimit?: number | null,
  redemptionCount?: number
): { active: boolean; reason?: string } {
  if (status !== 'APPROVED') {
    return { active: false, reason: `Status is ${status}` };
  }

  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (now < start) {
    return { active: false, reason: 'Offer has not started yet' };
  }

  if (now > end) {
    return { active: false, reason: 'Offer has expired' };
  }

  if (redemptionLimit && (redemptionCount ?? 0) >= redemptionLimit) {
    return { active: false, reason: 'Redemption limit reached' };
  }

  return { active: true };
}
