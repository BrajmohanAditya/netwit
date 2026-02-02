"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { VehicleListing } from "@/components/inventory/vehicle-listing";
import { Vehicle } from "@/types/vehicle";

export const dynamic = "force-dynamic";

const statusMap: Record<string, Vehicle["status"]> = {
  Available: "active",
  Active: "active",
  Inactive: "inactive",
  Sold: "sold",
  Pending: "coming-soon",
  "Coming Soon": "coming-soon",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000";

const mapVehicle = (row: Doc<"vehicles">): Vehicle => {
  const createdAt = new Date(row.created_at);
  const daysInStock = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  );

  let image = row.images?.[0] ?? FALLBACK_IMAGE;
  // If the image string is not a valid URL or path (e.g. just a filename from mock upload), fallback
  if (
    image &&
    !image.startsWith("http") &&
    !image.startsWith("/") &&
    !image.startsWith("data:")
  ) {
    image = FALLBACK_IMAGE;
  }

  return {
    id: row._id,
    stockNumber: row.stockNo ?? "N/A",
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim ?? "",
    vin: row.vin,
    image,
    status: statusMap[row.status] ?? "inactive",
    purchasePrice: row.cost ?? 0,
    retailPrice: row.price,
    odometer: row.mileage,
    fuel: "gas",
    transmission: "auto",
    bodyType: "sedan",
    daysInStock,
    createdAt,
  };
};

export default function InventoryPage() {
  const data = useQuery(api.vehicles.get);

  const vehicles = useMemo(() => (data ?? []).map(mapVehicle), [data]);

  return <VehicleListing vehicles={vehicles} />;
}
