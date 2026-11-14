/**
 * Geolocation & Proximity Calculation Module (Worldwide)
 * Implements the Great Circle / Haversine formula to determine precise distances
 * between resident coordinates (or neighborhood centroids) and merchant premises worldwide.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CityInfo extends Coordinates {
  name: string;
  country: string;
  flag: string;
  currency: string;
}

export const KNOWN_CITIES: Record<string, CityInfo> = {
  all: {
    name: 'Worldwide (All Cities)',
    country: 'Global',
    flag: '🌍',
    currency: 'USD',
    latitude: 0,
    longitude: 0,
  },
  'new york': {
    name: 'New York (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 40.7128,
    longitude: -74.006,
  },
  nyc: {
    name: 'New York (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 40.7128,
    longitude: -74.006,
  },
  london: {
    name: 'London (UK)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  tokyo: {
    name: 'Tokyo (Japan)',
    country: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  paris: {
    name: 'Paris (France)',
    country: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  berlin: {
    name: 'Berlin (Germany)',
    country: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    latitude: 52.52,
    longitude: 13.405,
  },
  sydney: {
    name: 'Sydney (Australia)',
    country: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  dubai: {
    name: 'Dubai (UAE)',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    latitude: 25.2048,
    longitude: 55.2708,
  },
  toronto: {
    name: 'Toronto (Canada)',
    country: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    latitude: 43.6532,
    longitude: -79.3832,
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    latitude: 1.3521,
    longitude: 103.8198,
  },
  rome: {
    name: 'Rome (Italy)',
    country: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR',
    latitude: 41.9028,
    longitude: 12.4964,
  },
  'los angeles': {
    name: 'Los Angeles (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  la: {
    name: 'Los Angeles (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  chicago: {
    name: 'Chicago (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  'san francisco': {
    name: 'San Francisco (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  sf: {
    name: 'San Francisco (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  miami: {
    name: 'Miami (USA)',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 25.7617,
    longitude: -80.1918,
  },
  barcelona: {
    name: 'Barcelona (Spain)',
    country: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    latitude: 41.3851,
    longitude: 2.1734,
  },
  madrid: {
    name: 'Madrid (Spain)',
    country: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  amsterdam: {
    name: 'Amsterdam (Netherlands)',
    country: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    latitude: 52.3676,
    longitude: 4.9041,
  },
  lahore: {
    name: 'Lahore (Pakistan)',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 31.5204,
    longitude: 74.3587,
  },
  karachi: {
    name: 'Karachi (Pakistan)',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 24.8607,
    longitude: 67.0011,
  },
  mumbai: {
    name: 'Mumbai (India)',
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    latitude: 19.076,
    longitude: 72.8777,
  },
  delhi: {
    name: 'Delhi (India)',
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    latitude: 28.6139,
    longitude: 77.209,
  },
  melbourne: {
    name: 'Melbourne (Australia)',
    country: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    latitude: -37.8136,
    longitude: 144.9631,
  },
  seoul: {
    name: 'Seoul (South Korea)',
    country: 'South Korea',
    flag: '🇰🇷',
    currency: 'KRW',
    latitude: 37.5665,
    longitude: 126.978,
  },
};

/**
 * Calculates distance in kilometers between two lat/lng coordinates using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Formats distance into a human-friendly label.
 * Example: 0.35 km -> "350 m"
 * Example: 2.4 km -> "2.4 km"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
