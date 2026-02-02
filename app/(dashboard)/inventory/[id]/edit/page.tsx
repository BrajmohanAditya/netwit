"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VehicleEditForm } from "@/components/inventory/vehicle-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/vehicle";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { VehicleFormData } from "@/types/inventory";
import toast from "react-hot-toast";

interface InventoryVehicleEditPageProps {
  params: { id: string };
}

const statusMap: Record<string, Vehicle["status"]> = {
  Available: "active",
  Active: "active",
  Inactive: "inactive",
  Sold: "sold",
  Pending: "coming-soon",
  "Coming Soon": "coming-soon",
};

const mapVehicle = (row: Doc<"vehicles">): Vehicle => {
  const createdAt = new Date(row.created_at || new Date());
  const daysInStock = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    id: row._id,
    stockNumber: row.stockNo ?? "N/A",
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim ?? "",
    vin: row.vin,
    image: row.images?.[0] ?? "",
    status: statusMap[row.status] ?? "active",
    purchasePrice: row.cost ?? 0,
    retailPrice: row.price,
    odometer: row.mileage,
    fuel: "gas", // Default since not in schema
    transmission: "auto", // Default since not in schema
    bodyType: "sedan", // Default since not in schema
    daysInStock,
    createdAt,
  };
};

export default function InventoryVehicleEditPage({
  params,
}: InventoryVehicleEditPageProps) {
  const router = useRouter();
  const vehicleId = params.id as Id<"vehicles">;

  const vehicleData = useQuery(api.vehicles.getById, { id: vehicleId });
  const updateVehicle = useMutation(api.vehicles.update);

  if (vehicleData === undefined) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (vehicleData === null) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
        <Button asChild variant="outline">
          <Link href="/inventory">Back to Inventory</Link>
        </Button>
      </div>
    );
  }

  const vehicle = mapVehicle(vehicleData);

  const handleUpdate = async (data: VehicleFormData) => {
    try {
      await updateVehicle({
        id: vehicleId,
        stockNo: data.stock_number,
        vin: data.vin,
        year: data.year,
        make: data.make,
        model: data.model,
        trim: data.trim,
        status: data.status,
        price: data.retail_price,
        cost: data.purchase_price,
        mileage: data.odometer,
        images: data.image_gallery,
      });
      toast.success("Vehicle updated successfully");
      router.push(`/inventory/${vehicleId}`);
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      toast.error("Failed to update vehicle");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Edit Vehicle</h1>
          <p className="text-sm text-muted">Vehicle ID: {params.id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/inventory/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleEditForm vehicle={vehicle} />
        </CardContent>
      </Card>
    </div>
  );
}
