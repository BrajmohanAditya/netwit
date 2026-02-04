"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { VehicleForm } from "@/components/inventory/vehicle-form";
import type { VehicleFormData } from "@/types/inventory";
import type { Vehicle, VehicleStatus } from "@/types/vehicle";

interface VehicleEditFormProps {
  vehicle: Vehicle;
  onSubmit?: (data: VehicleFormData) => Promise<void>;
}

const mapStatusToForm = (status: VehicleStatus): VehicleFormData["status"] => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "sold":
      return "Sold";
    case "coming-soon":
      return "Coming Soon";
    default:
      return "Active";
  }
};

export function VehicleEditForm({ vehicle, onSubmit }: VehicleEditFormProps) {
  const router = useRouter();

  const initialData: VehicleFormData = {
    vin: vehicle.vin,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim || "",
    odometer: vehicle.odometer,
    stock_number: vehicle.stockNumber,
    condition: "Used",
    status: mapStatusToForm(vehicle.status),
    purchase_price: vehicle.purchasePrice,
    retail_price: vehicle.retailPrice,
    extra_costs: 0,
    taxes: 0,
    image_gallery: vehicle.image ? [vehicle.image] : [],
  };

  const handleSubmit = async (data: VehicleFormData) => {
    if (onSubmit) {
      await onSubmit(data);
      return;
    }
    toast.success("Vehicle updated successfully!");
  };

  const handleCancel = () => {
    router.push(`/inventory/${vehicle.id}`);
  };

  return (
    <VehicleForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
