"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { VehicleForm } from "@/components/inventory/vehicle-form";
import type { VehicleFormData } from "@/types/inventory";
import type { Vehicle, VehicleStatus } from "@/types/vehicle";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = useMemo(() => createClient(), []);

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

    const { error } = await supabase
      .from("vehicles")
      .update({
        vin: data.vin,
        year: data.year,
        make: data.make,
        model: data.model,
        trim: data.trim || null,
        odometer: data.odometer ?? 0,
        stock_number: data.stock_number || null,
        condition: data.condition,
        status: data.status,
        purchase_price: data.purchase_price ?? 0,
        retail_price: data.retail_price ?? 0,
        extra_costs: data.extra_costs ?? 0,
        taxes: data.taxes ?? 0,
        image_gallery: data.image_gallery?.length ? data.image_gallery : null,
      })
      .eq("id", vehicle.id);

    if (error) {
      console.error("Failed to update vehicle:", error.message);
      toast.error("Failed to update vehicle. Please try again.");
      return;
    }

    toast.success("Vehicle updated successfully.");
    router.push(`/inventory/${vehicle.id}`);
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
