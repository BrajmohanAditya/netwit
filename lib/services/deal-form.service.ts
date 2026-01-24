import {
  ACCESSORY_OPTIONS,
  DEFAULT_ADDITIONAL_COSTS,
} from "@/lib/constants/deal-data";

export interface AdditionalCost {
  id: string;
  label: string;
  amount: number;
}

export interface DealFormData {
  // Step 1
  dealNumber: string;
  customer: string;
  customerMeta?: string;
  vehicle: string;
  vehicleMeta?: string;
  salesperson: string;
  dealDate: string;
  expectedDelivery: string;

  // Step 2
  vehiclePrice: number;
  tradeInEnabled: boolean;
  tradeInVehicle: string;
  tradeInValue: number;
  discount: number;
  discountReason: string;
  additionalCosts: AdditionalCost[];
  taxRate: number;

  // Step 3
  downPayment: number;
  paymentDate: string;
  paymentMethod: string;
  financingType: string;
  loanRate: number;
  termMonths: number;
  frequency: string;
  institution: string;

  // Step 4
  warrantyEnabled: boolean;
  warrantyProvider: string;
  warrantyTerm: string;
  warrantyCost: number;
  warrantyCommission: number;
  insuranceEnabled: boolean;
  insuranceProvider: string;
  insurancePremium: number;
  insuranceCommission: number;
  accessories: { id: string; label: string; cost: number; selected: boolean }[];
  customAccessoryLabel: string;
  customAccessoryCost: number;
  salesBaseCommission: number;
  salesAddonCommission: number;
  commissionPaid: boolean;

  // Draft
  draftSavedAt?: string;
}

export interface DealValidationErrors {
  [key: string]: string;
}

const STORAGE_KEY = "deal_form_draft";
const DRAFT_TIMESTAMP_KEY = "deal_form_draft_timestamp";

const isLocalStorageAvailable = () => {
  try {
    return typeof window !== "undefined" && window.localStorage !== null;
  } catch {
    return false;
  }
};

export function generateDealNumber() {
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `D-${suffix}`;
}

export function createEmptyDealFormData(): DealFormData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    dealNumber: generateDealNumber(),
    customer: "",
    vehicle: "",
    salesperson: "Current user",
    dealDate: today,
    expectedDelivery: "",
    vehiclePrice: 34500,
    tradeInEnabled: false,
    tradeInVehicle: "",
    tradeInValue: 0,
    discount: 0,
    discountReason: "Promotion",
    additionalCosts: DEFAULT_ADDITIONAL_COSTS.map((cost) => ({ ...cost })),
    taxRate: 12,
    downPayment: 5000,
    paymentDate: "",
    paymentMethod: "Cash",
    financingType: "dealership",
    loanRate: 5.99,
    termMonths: 60,
    frequency: "Monthly",
    institution: "",
    warrantyEnabled: false,
    warrantyProvider: "",
    warrantyTerm: "5yr/100K",
    warrantyCost: 2500,
    warrantyCommission: 500,
    insuranceEnabled: false,
    insuranceProvider: "",
    insurancePremium: 1200,
    insuranceCommission: 150,
    accessories: ACCESSORY_OPTIONS.map((item) => ({
      ...item,
      selected: item.id === "winter-tires" || item.id === "remote-start",
    })),
    customAccessoryLabel: "",
    customAccessoryCost: 0,
    salesBaseCommission: 1000,
    salesAddonCommission: 650,
    commissionPaid: false,
  };
}

export function validateStep1(data: DealFormData): DealValidationErrors {
  const errors: DealValidationErrors = {};
  if (!data.customer) errors.customer = "Customer is required";
  if (!data.vehicle) errors.vehicle = "Vehicle is required";
  if (!data.salesperson) errors.salesperson = "Salesperson is required";
  return errors;
}

export function validateStep2(data: DealFormData): DealValidationErrors {
  const errors: DealValidationErrors = {};
  if (!data.vehiclePrice || data.vehiclePrice <= 0) {
    errors.vehiclePrice = "Vehicle price is required";
  }
  return errors;
}

export function validateStep3(data: DealFormData): DealValidationErrors {
  const errors: DealValidationErrors = {};
  if (!data.paymentMethod) errors.paymentMethod = "Payment method required";
  if (data.financingType !== "cash" && !data.institution) {
    errors.institution = "Institution is required";
  }
  return errors;
}

export function calculateTaxAmount(subtotal: number, taxRate: number) {
  return Math.round(subtotal * (taxRate / 100));
}

export function calculateTotals(data: DealFormData) {
  const base =
    data.vehiclePrice -
    data.discount -
    (data.tradeInEnabled ? data.tradeInValue : 0);
  const additional = data.additionalCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0,
  );
  const tax = calculateTaxAmount(base + additional, data.taxRate);
  const total = base + additional + tax;
  return { base, additional, tax, total };
}

export function calculateLoan(data: DealFormData) {
  const { total } = calculateTotals(data);
  const loan = Math.max(total - data.downPayment, 0);
  const rate = data.loanRate / 100 / 12;
  const n = data.termMonths || 1;
  const monthly =
    rate === 0 ? loan / n : (loan * rate) / (1 - Math.pow(1 + rate, -n));
  const totalPaid = monthly * n;
  const totalInterest = Math.max(totalPaid - loan, 0);
  return {
    loan: Math.round(loan),
    monthly: Math.round(monthly),
    totalPaid: Math.round(totalPaid),
    totalInterest: Math.round(totalInterest),
  };
}

export function saveDealDraft(data: DealFormData) {
  if (!isLocalStorageAvailable()) return;
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const payload = { ...data, draftSavedAt: now };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  localStorage.setItem(DRAFT_TIMESTAMP_KEY, now);
}

export function loadDealDraft(): DealFormData | null {
  if (!isLocalStorageAvailable()) return null;
  const draft = localStorage.getItem(STORAGE_KEY);
  return draft ? (JSON.parse(draft) as DealFormData) : null;
}

export function clearDealDraft() {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
}

export function getDealDraftTime() {
  if (!isLocalStorageAvailable()) return null;
  return localStorage.getItem(DRAFT_TIMESTAMP_KEY);
}
