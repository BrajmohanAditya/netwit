// Vehicle makes and models data
export const VEHICLE_MAKES = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

export const VEHICLE_MODELS: Record<string, string[]> = {
  Ford: ["F-150", "Mustang", "Explorer", "Edge", "Escape"],
  Toyota: ["Camry", "Corolla", "CR-V", "Highlander", "Tacoma"],
  Honda: ["Civic", "Accord", "CR-V", "Odyssey", "Pilot"],
  Chevrolet: ["Silverado", "Malibu", "Equinox", "Traverse", "Colorado"],
  BMW: ["3 Series", "5 Series", "7 Series", "X3", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  Audi: ["A3", "A4", "A6", "Q5", "Q7"],
};

export const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Truck",
  "Van",
  "Coupe",
  "Hatchback",
  "Wagon",
  "Convertible",
  "Minivan",
];

export const FUEL_TYPES = [
  "Gasoline",
  "Diesel",
  "Hybrid",
  "Electric",
  "Plug-in Hybrid",
];

export const TRANSMISSIONS = ["Manual", "Automatic", "CVT", "Electric"];

export const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD"];

export const EXTERIOR_COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Brown",
  "Gold",
  "Beige",
  "Green",
  "Orange",
  "Yellow",
  "Purple",
];

export const INTERIOR_COLORS = [
  "Black",
  "Gray",
  "Tan",
  "Beige",
  "Brown",
  "White",
  "Navy",
];

export const DOOR_COUNTS = ["2", "4", "5"];

export const SEAT_COUNTS = ["2", "4", "5", "6", "7", "8"];

export const CONDITIONS = [
  { id: "new", label: "New", value: "new" },
  { id: "used", label: "Used", value: "used" },
  { id: "cpo", label: "CPO (Certified Pre-Owned)", value: "cpo" },
];

export const ODOMETER_UNITS = [
  { id: "km", label: "km" },
  { id: "mi", label: "mi" },
];

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB (Reduced for local data URI compatibility)
export const MAX_IMAGES = 20;
export const DESCRIPTION_MAX_LENGTH = 2000;
