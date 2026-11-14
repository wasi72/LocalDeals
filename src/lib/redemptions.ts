import crypto from 'crypto';
import QRCode from 'qrcode';

const SECRET_KEY = process.env.HMAC_SECRET || 'localdeals-default-production-key-fallback-30yr';

/**
 * Generates an unpredictable, memorable human-readable redemption code.
 * Example: "LD-PARIS-8392"
 */
export function generateCouponCode(city = 'PARIS'): string {
  const cleanCity = city.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'DEAL';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const randomChars = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `LD-${cleanCity}-${randomNum}-${randomChars}`;
}

/**
 * Creates a cryptographically signed verification token for an offer and voucher.
 * Protects against tampering and unauthorized replication.
 */
export function generateSignedQrToken(offerId: string, code: string, expiresAt: Date): string {
  const payload = `${offerId}:${code}:${expiresAt.getTime()}`;
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex').slice(0, 24);
  return `v1.${payload}:${hmac}`;
}

/**
 * Verifies the cryptographic token.
 */
export function verifySignedQrToken(token: string): {
  valid: boolean;
  offerId?: string;
  code?: string;
  expiresAt?: Date;
  reason?: string;
} {
  try {
    if (!token.startsWith('v1.')) {
      return { valid: false, reason: 'Invalid token header' };
    }

    const body = token.slice(3);
    const lastColon = body.lastIndexOf(':');
    if (lastColon === -1) {
      return { valid: false, reason: 'Malformed token structure' };
    }

    const payload = body.slice(0, lastColon);
    const signature = body.slice(lastColon + 1);

    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex').slice(0, 24);
    if (signature !== expectedSig) {
      return { valid: false, reason: 'Cryptographic signature mismatch (tampered token)' };
    }

    const [offerId, code, expStr] = payload.split(':');
    const expiresAt = new Date(parseInt(expStr, 10));

    if (new Date() > expiresAt) {
      return { valid: false, reason: 'Voucher has expired' };
    }

    return { valid: true, offerId, code, expiresAt };
  } catch {
    return { valid: false, reason: 'Token verification exception' };
  }
}

/**
 * Generates an inline Base64 PNG QR Code data URL.
 */
export async function generateQrCodeDataUrl(dataString: string): Promise<string> {
  try {
    return await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 280,
      color: {
        dark: '#064e3b', // Deep emerald
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    throw err;
  }
}
