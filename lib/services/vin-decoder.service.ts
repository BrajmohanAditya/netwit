// VIN Decoder Service
// This service handles VIN decoding and validation

interface VINDecoderResult {
  year?: number;
  make?: string;
  model?: string;
  bodyType?: string;
  engine?: string;
  error?: string;
}

export async function decodeVIN(vin: string): Promise<VINDecoderResult> {
  // Validate VIN format
  if (!vin || vin.length !== 17) {
    return { error: "VIN must be 17 characters long" };
  }

  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return { error: "VIN contains invalid characters" };
  }

  try {
    // TODO: Replace with actual VIN decoder API (e.g., NHTSA API)
    // For now, return mock data based on VIN position
    const mockData = getMockVINData(vin);
    return mockData;
  } catch (error) {
    return { error: "Failed to decode VIN. Please enter details manually." };
  }
}

// Mock VIN decoder - extract basic info from VIN
function getMockVINData(vin: string): VINDecoderResult {
  // Extract year from position 9 (10th character)
  const yearChar = vin.charAt(9);
  const yearMap: Record<string, number> = {
    A: 2010,
    B: 2011,
    C: 2012,
    D: 2013,
    E: 2014,
    F: 2015,
    G: 2016,
    H: 2017,
    J: 2018,
    K: 2019,
    L: 2020,
    M: 2021,
    N: 2022,
    P: 2023,
    R: 2024,
    S: 2025,
    T: 2026,
  };

  const year = yearMap[yearChar.toUpperCase()] || new Date().getFullYear();
  const make = vin.charAt(2).toUpperCase() === "F" ? "Ford" : "Toyota"; // Simple mock
  const model = make === "Ford" ? "Mustang" : "Camry"; // Simple mock

  return {
    year,
    make,
    model,
    bodyType: "Sedan",
    engine: "3.5L V6",
  };
}

// Validate VIN format
export function validateVIN(vin: string): boolean {
  if (!vin) return false;
  if (vin.length !== 17) return false;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return false;
  return true;
}

// Generate next stock number
export function generateStockNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `AUTO-${timestamp.toString().slice(-6)}${random}`.slice(0, 12);
}
