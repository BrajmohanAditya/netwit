import { VehicleListing } from "@/components/inventory/vehicle-listing";
import { mockVehicles } from "@/lib/mock/vehicles";

export default function InventoryPage() {
  return <VehicleListing vehicles={mockVehicles} />;
}
