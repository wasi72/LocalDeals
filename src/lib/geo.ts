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
  mumbai: {
    name: 'Mumbai (India)',
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    latitude: 19.076,
    longitude: 72.8777,
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
