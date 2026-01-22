import React from "react";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { Heart, Eye, Share2 } from "lucide-react";

interface Vehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  stockNumber: string;
  status: "Active" | "Inactive" | "Sold" | "Coming Soon";
  retailPrice: number;
  condition?: string;
  mileage?: number;
  image?: string;
}

interface VehicleGridProps {
  vehicles: Vehicle[];
  onViewVehicle?: (vehicleId: string) => void;
  onLikeVehicle?: (vehicleId: string) => void;
  onShareVehicle?: (vehicleId: string) => void;
}

export function VehicleGrid({
  vehicles,
  onViewVehicle,
  onLikeVehicle,
  onShareVehicle,
}: VehicleGridProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Active":
        return "Available";
      case "Sold":
        return "Sold";
      case "Inactive":
        return "Reserved";
      default:
        return "Pending";
    }
  };

  const generateSpecs = (vehicle: Vehicle) => {
    const specs = [];
    if (vehicle.year) {
      specs.push({ icon: "📅", label: `${vehicle.year}` });
    }
    if (vehicle.mileage) {
      specs.push({ icon: "⛽", label: `${vehicle.mileage}K mi` });
    }
    if (vehicle.trim) {
      specs.push({ icon: "🔧", label: vehicle.trim });
    }
    if (vehicle.condition) {
      specs.push({ icon: "✨", label: vehicle.condition });
    }
    return specs.slice(0, 4);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          id={vehicle.id}
          image={vehicle.image || "/vehicles/placeholder.jpg"}
          title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          subtitle={`${vehicle.trim} • ${vehicle.condition || "Used"}`}
          price={vehicle.retailPrice}
          status={getStatusLabel(vehicle.status) as any}
          stockNumber={vehicle.stockNumber}
          specs={generateSpecs(vehicle)}
          vin={vehicle.vin}
          actions={[
            {
              label: "View",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => onViewVehicle?.(vehicle.id),
            },
            {
              label: "Like",
              icon: <Heart className="h-4 w-4" />,
              onClick: () => onLikeVehicle?.(vehicle.id),
            },
            {
              label: "Share",
              icon: <Share2 className="h-4 w-4" />,
              onClick: () => onShareVehicle?.(vehicle.id),
            },
          ]}
          onSelect={() => onViewVehicle?.(vehicle.id)}
        />
      ))}
    </div>
  );
}
