export interface CityMetadata {
  name: string;
  country: string;
  flag: string;
  currency: string;
  latitude: number;
  longitude: number;
  postcode: string;
}

export const CITY_SYNONYMS: Record<string, string> = {
  tokio: 'tokyo',
  tky: 'tokyo',
  nyc: 'new york',
  'new york city': 'new york',
  ny: 'new york',
  la: 'los angeles',
  'l.a.': 'los angeles',
  sf: 'san francisco',
  'san fran': 'san francisco',
  roma: 'rome',
  londres: 'london',
  berlín: 'berlin',
  parigi: 'paris',
  lahor: 'lahore',
  pindi: 'rawalpindi',
  faislabad: 'faisalabad',
  mumbay: 'mumbai',
  bombay: 'mumbai',
  calcutta: 'kolkata',
  madras: 'chennai',
  bangalore: 'bengaluru',
  milano: 'milan',
  wien: 'vienna',
  münchen: 'munich',
  zürich: 'zurich',
  genève: 'geneva',
  singapur: 'singapore',
  bure: 'burewala',
  bura: 'burewala',
  chich: 'chichawatni',
  chicha: 'chichawatni',
};

export const KNOWN_GLOBAL_CITIES: Record<string, CityMetadata> = {
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    latitude: 35.6762,
    longitude: 139.6503,
    postcode: '160-0023',
  },
  'new york': {
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 40.7128,
    longitude: -74.006,
    postcode: '10001',
  },
  london: {
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    latitude: 51.5074,
    longitude: -0.1278,
    postcode: 'WC2E 9HA',
  },
  paris: {
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    latitude: 48.8566,
    longitude: 2.3522,
    postcode: '75011',
  },
  berlin: {
    name: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    latitude: 52.52,
    longitude: 13.405,
    postcode: '10997',
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    latitude: -33.8688,
    longitude: 151.2093,
    postcode: '2026',
  },
  dubai: {
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    latitude: 25.2048,
    longitude: 55.2708,
    postcode: '00000',
  },
  toronto: {
    name: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    latitude: 43.6532,
    longitude: -79.3832,
    postcode: 'M5V 2H1',
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    latitude: 1.3521,
    longitude: 103.8198,
    postcode: '048582',
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR',
    latitude: 41.9028,
    longitude: 12.4964,
    postcode: '00186',
  },
  'los angeles': {
    name: 'Los Angeles',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 34.0522,
    longitude: -118.2437,
    postcode: '90012',
  },
  chicago: {
    name: 'Chicago',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 41.8781,
    longitude: -87.6298,
    postcode: '60601',
  },
  'san francisco': {
    name: 'San Francisco',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    latitude: 37.7749,
    longitude: -122.4194,
    postcode: '94103',
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    latitude: 41.3851,
    longitude: 2.1734,
    postcode: '08003',
  },
  // Pakistani Cities (all mapped with PKR)
  lahore: {
    name: 'Lahore',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 31.5204,
    longitude: 74.3587,
    postcode: '54000',
  },
  karachi: {
    name: 'Karachi',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 24.8607,
    longitude: 67.0011,
    postcode: '74200',
  },
  burewala: {
    name: 'Burewala',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.1587,
    longitude: 72.6784,
    postcode: '61010',
  },
  chichawatni: {
    name: 'Chichawatni',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.5333,
    longitude: 72.7001,
    postcode: '57200',
  },
  islamabad: {
    name: 'Islamabad',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 33.6844,
    longitude: 73.0479,
    postcode: '44000',
  },
  rawalpindi: {
    name: 'Rawalpindi',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 33.5651,
    longitude: 73.0169,
    postcode: '46000',
  },
  faisalabad: {
    name: 'Faisalabad',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 31.4504,
    longitude: 73.135,
    postcode: '38000',
  },
  multan: {
    name: 'Multan',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.1575,
    longitude: 71.5249,
    postcode: '60000',
  },
  sahiwal: {
    name: 'Sahiwal',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.6682,
    longitude: 73.1114,
    postcode: '57000',
  },
  sialkot: {
    name: 'Sialkot',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 32.4945,
    longitude: 74.5229,
    postcode: '51310',
  },
  gujranwala: {
    name: 'Gujranwala',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 32.1877,
    longitude: 74.1945,
    postcode: '52250',
  },
  peshawar: {
    name: 'Peshawar',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 34.0151,
    longitude: 71.5249,
    postcode: '25000',
  },
  quetta: {
    name: 'Quetta',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 30.1798,
    longitude: 66.975,
    postcode: '87300',
  },
  bahawalpur: {
    name: 'Bahawalpur',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 29.3544,
    longitude: 71.6911,
    postcode: '63100',
  },
  sargodha: {
    name: 'Sargodha',
    country: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    latitude: 32.0836,
    longitude: 72.6711,
    postcode: '40100',
  },
};

/**
 * Normalizes user city input: removes suffixes, extra spaces, and resolves synonyms.
 * Completely client-safe: zero server or database dependencies!
 */
export function normalizeCityName(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().replace(/\s+/g, ' ');
  // Strip country suffixes e.g. "Tokyo, Japan" -> "Tokyo"
  cleaned = cleaned.replace(/,\s*.*$/, '');
  cleaned = cleaned.replace(/\s*\(.*\)$/, '');
  const key = cleaned.toLowerCase();

  // Check synonym map (e.g. "tokio" -> "tokyo", "bure" -> "burewala")
  if (CITY_SYNONYMS[key]) {
    const resolved = KNOWN_GLOBAL_CITIES[CITY_SYNONYMS[key]];
    return resolved ? resolved.name : CITY_SYNONYMS[key];
  }

  // Check known cities map
  if (KNOWN_GLOBAL_CITIES[key]) {
    return KNOWN_GLOBAL_CITIES[key].name;
  }

  return cleaned.trim();
}

/**
 * Detects or constructs metadata for any given city.
 * Completely client-safe: zero server or database dependencies!
 */
export function resolveCityMetadata(rawCity: string): CityMetadata {
  const normalized = normalizeCityName(rawCity);
  const key = normalized.toLowerCase();

  if (KNOWN_GLOBAL_CITIES[key]) {
    return KNOWN_GLOBAL_CITIES[key];
  }

  // Check if it's an alias
  if (CITY_SYNONYMS[key] && KNOWN_GLOBAL_CITIES[CITY_SYNONYMS[key]]) {
    return KNOWN_GLOBAL_CITIES[CITY_SYNONYMS[key]];
  }

  // Capitalize properly
  const formattedName = normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Default fallback for any newly requested city anywhere in the world
  return {
    name: formattedName,
    country: 'International',
    flag: '🌍',
    currency: 'USD',
    latitude: 0,
    longitude: 0,
    postcode: '00000',
  };
}
