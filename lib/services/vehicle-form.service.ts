// Vehicle Form Service
// Handles validation, calculations, and localStorage persistence

export interface VehicleFormData {
  // Step 1: Basic Info
  stockNumber: string;
  vin: string;
  year: number | null;
  make: string;
  model: string;
  trim: string;
  bodyType: string;

  // Step 2: Specifications
  odometer: number | null;
  odometerUnit: "km" | "mi";
  condition: "new" | "used" | "cpo";
  fuel: string;
  transmission: string;
  drive: string;
  exteriorColor: string;
  interiorColor: string;
  doors: string;
  seats: string;
  engine: string;

  // Step 3: Pricing
  purchasePrice: number | null;
  retailPrice: number | null;
  specialPrice: number | null;
  extraCosts: number | null;
  taxes: number | null;

  // Step 4: Images & Description
  images: string[]; // Base64 or file paths
  primaryImageIndex: number;
  description: string;

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  draftSavedAt?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Validate Step 1: Basic Info
export function validateStep1(
  data: Partial<VehicleFormData>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.vin || data.vin.trim().length !== 17) {
    errors.vin = "VIN must be 17 characters";
  }

  if (
    !data.year ||
    data.year < 1900 ||
    data.year > new Date().getFullYear() + 1
  ) {
    errors.year = "Please select a valid year";
  }

  if (!data.make || data.make.trim() === "") {
    errors.make = "Make is required";
  }

  if (!data.model || data.model.trim() === "") {
    errors.model = "Model is required";
  }

  if (!data.bodyType || data.bodyType.trim() === "") {
    errors.bodyType = "Body type is required";
  }

  return errors;
}

// Validate Step 2: Specifications
export function validateStep2(
  data: Partial<VehicleFormData>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.condition) {
    errors.condition = "Condition is required";
  }

  if (!data.fuel) {
    errors.fuel = "Fuel type is required";
  }

  if (!data.transmission) {
    errors.transmission = "Transmission is required";
  }

  if (!data.drive) {
    errors.drive = "Drive type is required";
  }

  if (!data.exteriorColor) {
    errors.exteriorColor = "Exterior color is required";
  }

  if (!data.interiorColor) {
    errors.interiorColor = "Interior color is required";
  }

  if (!data.doors) {
    errors.doors = "Number of doors is required";
  }

  if (!data.seats) {
    errors.seats = "Number of seats is required";
  }

  return errors;
}

// Validate Step 3: Pricing
export function validateStep3(
  data: Partial<VehicleFormData>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (
    data.purchasePrice === null ||
    data.purchasePrice === undefined ||
    data.purchasePrice <= 0
  ) {
    errors.purchasePrice =
      "Purchase price is required and must be greater than 0";
  }

  if (
    data.retailPrice === null ||
    data.retailPrice === undefined ||
    data.retailPrice <= 0
  ) {
    errors.retailPrice = "Retail price is required and must be greater than 0";
  }

  return errors;
}

// Calculate estimated income
export function calculateEstimatedIncome(data: Partial<VehicleFormData>): {
  income: number;
  isPositive: boolean;
} {
  const purchasePrice = data.purchasePrice || 0;
  const retailPrice = data.retailPrice || 0;
  const extraCosts = data.extraCosts || 0;
  const taxes = data.taxes || 0;

  const income = retailPrice - purchasePrice - extraCosts - taxes;

  return {
    income,
    isPositive: income >= 0,
  };
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
}

// localStorage helper
const STORAGE_KEY = "vehicle_form_draft";
const DRAFT_TIMESTAMP_KEY = "vehicle_form_draft_timestamp";

// Check if localStorage is available (client-side only)
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== "undefined" && window.localStorage !== null;
  } catch {
    return false;
  }
};

export function saveDraftToStorage(data: VehicleFormData): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dataWithTimestamp = {
      ...data,
      draftSavedAt: now,
      updatedAt: new Date(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    localStorage.setItem(DRAFT_TIMESTAMP_KEY, now);
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

export function loadDraftFromStorage(): VehicleFormData | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const draft = localStorage.getItem(STORAGE_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

export function clearDraftFromStorage(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

export function getDraftSavedTime(): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    return localStorage.getItem(DRAFT_TIMESTAMP_KEY);
  } catch (error) {
    return null;
  }
}

// Create empty form data
export function createEmptyFormData(stockNumber?: string): VehicleFormData {
  return {
    stockNumber: stockNumber || "",
    vin: "",
    year: null,
    make: "",
    model: "",
    trim: "",
    bodyType: "",
    odometer: null,
    odometerUnit: "mi",
    condition: "used",
    fuel: "",
    transmission: "",
    drive: "",
    exteriorColor: "",
    interiorColor: "",
    doors: "",
    seats: "",
    engine: "",
    purchasePrice: null,
    retailPrice: null,
    specialPrice: null,
    extraCosts: null,
    taxes: null,
    images: [],
    primaryImageIndex: 0,
    description: "",
  };
}
