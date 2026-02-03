"use client";

import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "./vehicle-card";

interface VehicleGridProps {
  vehicles: Vehicle[];
  selectedVehicles: Set<string>;
  onSelectVehicle: (id: string, selected: boolean) => void;
  onDelete: (id: string) => void;
}

export function VehicleGrid({
  vehicles,
  selectedVehicles,
  onSelectVehicle,
  onDelete,
}: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 font-medium">No vehicles found</p>
          <p className="text-sm text-muted">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={selectedVehicles.has(vehicle.id)}
          onSelect={onSelectVehicle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
