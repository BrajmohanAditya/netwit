export const DISCOUNT_REASONS = [
  "Promotion",
  "Loyalty",
  "Manager Override",
  "Inventory Clearance",
  "Competitor Match",
];

export const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Check"];

export const FINANCING_TYPES = [
  { id: "dealership", label: "Dealership" },
  { id: "bank", label: "Bank" },
  { id: "third-party", label: "Third-Party" },
  { id: "cash", label: "Cash (full)" },
  { id: "lease", label: "Lease" },
];

export const PAYMENT_FREQUENCIES = ["Monthly", "Bi-Weekly", "Weekly"];

export const WARRANTY_TERMS = ["3yr/60K", "5yr/100K", "7yr/120K"];

export const ACCESSORY_OPTIONS = [
  { id: "winter-tires", label: "Winter Tires", cost: 1200 },
  { id: "remote-start", label: "Remote Start", cost: 450 },
  { id: "paint-protection", label: "Paint Protection", cost: 800 },
];

export const DEFAULT_ADDITIONAL_COSTS = [
  { id: "delivery", label: "Delivery", amount: 500 },
  { id: "accessories", label: "Accessories", amount: 1200 },
];
