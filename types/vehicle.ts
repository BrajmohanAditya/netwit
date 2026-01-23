export type VehicleStatus = "active" | "inactive" | "sold" | "coming-soon";
export type FuelType = "gas" | "diesel" | "electric" | "hybrid";
export type TransmissionType = "auto" | "manual" | "cvt";
export type BodyType =
  | "sedan"
  | "suv"
  | "truck"
  | "van"
  | "coupe"
  | "hatchback"
  | "wagon";

export interface Vehicle {
  id: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  image: string;
  status: VehicleStatus;
  purchasePrice: number;
  retailPrice: number;
  odometer: number;
  fuel: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  daysInStock: number;
  createdAt: Date;
}

export interface VehicleFilters {
  search: string;
  status: VehicleStatus[];
  make: string[];
  year: [number, number];
  price: [number, number];
  odometer: [number, number];
  fuel: FuelType[];
  transmission: TransmissionType[];
  bodyType: BodyType[];
}

export interface VehicleStats {
  total: number;
  active: number;
  sold: number;
  totalValue: number;
}
