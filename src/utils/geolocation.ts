// Geolocation utilities for Centro Universitario de los Altos service area validation

// Define service area boundaries for Centro Universitario de los Altos
const SERVICE_AREA = {
  name: 'Centro Universitario de los Altos',
  city: 'Tepatitlán de Morelos',
  state: 'Jalisco',
  // Approximate coordinates for CUAltos campus
  center: {
    lat: 20.8167,
    lng: -102.7500
  },
  // Service radius in kilometers
  radiusKm: 5
};

// Valid keywords that indicate addresses within our service area
const VALID_KEYWORDS = [
  'cualtos',
  'cu altos',
  'centro universitario',
  'universidad',
  'campus',
  'tepatitlán',
  'tepatitlan',
  'edificio',
  'aula',
  'laboratorio',
  'biblioteca',
  'cafetería',
  'cafeteria',
  'estacionamiento',
  'rectoría',
  'rectoria',
  'coordinación',
  'coordinacion'
];

// Buildings and areas within CUAltos
const CAMPUS_LOCATIONS = [
  'edificio a',
  'edificio b', 
  'edificio c',
  'edificio d',
  'edificio e',
  'edificio f',
  'edificio g',
  'edificio h',
  'biblioteca',
  'cafetería central',
  'cafeteria central',
  'rectoría',
  'rectoria',
  'estacionamiento principal',
  'laboratorio de cómputo',
  'laboratorio de computo',
  'auditorio',
  'cancha de futbol',
  'cancha de basquet',
  'área verde',
  'area verde'
];

/**
 * Validates if an address is within our delivery service area
 * @param address - The delivery address to validate
 * @returns Promise<boolean> - True if address is valid for delivery
 */
export async function validateAddress(address: string): Promise<boolean> {
  if (!address || address.trim().length === 0) {
    return false;
  }

  const normalizedAddress = address.toLowerCase().trim();

  // Check for campus-specific locations first (highest priority)
  const hasCampusLocation = CAMPUS_LOCATIONS.some(location => 
    normalizedAddress.includes(location)
  );

  if (hasCampusLocation) {
    return true;
  }

  // Check for valid keywords
  const hasValidKeyword = VALID_KEYWORDS.some(keyword => 
    normalizedAddress.includes(keyword)
  );

  if (hasValidKeyword) {
    return true;
  }

  // If no specific campus references, check if it mentions the city
  if (normalizedAddress.includes('tepatitlán') || normalizedAddress.includes('tepatitlan')) {
    // Additional validation could be added here for specific neighborhoods
    return true;
  }

  return false;
}

/**
 * Gets the estimated distance from campus center to a given address
 * @param address - The delivery address
 * @returns number - Estimated distance in kilometers
 */
export function getEstimatedDistance(address: string): number {
  const normalizedAddress = address.toLowerCase().trim();

  // If it's a specific campus building, distance is minimal
  const hasCampusLocation = CAMPUS_LOCATIONS.some(location => 
    normalizedAddress.includes(location)
  );

  if (hasCampusLocation) {
    return 0.1 + Math.random() * 0.4; // 0.1-0.5 km within campus
  }

  // If it mentions university keywords, assume it's nearby
  const hasUniversityKeyword = ['universidad', 'campus', 'cualtos'].some(keyword => 
    normalizedAddress.includes(keyword)
  );

  if (hasUniversityKeyword) {
    return 0.5 + Math.random() * 1.5; // 0.5-2 km from campus
  }

  // General Tepatitlán area
  return 2 + Math.random() * 3; // 2-5 km from campus
}

/**
 * Calculates estimated delivery time based on distance and current load
 * @param address - The delivery address
 * @returns number - Estimated delivery time in minutes
 */
export function calculateDeliveryTime(address: string): number {
  const distance = getEstimatedDistance(address);
  const baseTime = 15; // Base preparation time
  const travelTime = distance * 3; // 3 minutes per km (conservative estimate)
  const bufferTime = 5; // Buffer for finding the exact location

  return Math.ceil(baseTime + travelTime + bufferTime);
}

/**
 * Formats an address for display, highlighting campus-specific information
 * @param address - The raw address string
 * @returns string - Formatted address
 */
export function formatAddress(address: string): string {
  let formatted = address.trim();

  // Capitalize common campus terms
  const campusTerms = [
    { search: /\bcualtos\b/gi, replace: 'CUAltos' },
    { search: /\bcu altos\b/gi, replace: 'CU Altos' },
    { search: /\bcentro universitario\b/gi, replace: 'Centro Universitario' },
    { search: /\bedificio ([a-h])\b/gi, replace: 'Edificio $1' },
    { search: /\btepatitlán\b/gi, replace: 'Tepatitlán' },
    { search: /\btepatitlan\b/gi, replace: 'Tepatitlán' }
  ];

  campusTerms.forEach(term => {
    formatted = formatted.replace(term.search, term.replace);
  });

  return formatted;
}

/**
 * Gets service area information
 * @returns object - Service area details
 */
export function getServiceAreaInfo() {
  return {
    ...SERVICE_AREA,
    validKeywords: VALID_KEYWORDS,
    campusLocations: CAMPUS_LOCATIONS
  };
}

/**
 * Checks if delivery is available at the current time
 * @returns boolean - True if delivery is currently available
 */
export function isDeliveryAvailable(): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Delivery available from 11 AM to 11 PM
  return hour >= 11 && hour < 23;
}

/**
 * Gets the next available delivery time if service is currently closed
 * @returns string - Next available delivery time
 */
export function getNextDeliveryTime(): string {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 11) {
    return '11:00 AM';
  } else if (hour >= 23) {
    return '11:00 AM (mañana)';
  }
  
  return 'Ahora';
}