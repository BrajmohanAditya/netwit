"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types/vehicle";
import { Separator } from "@/components/ui/separator";

interface InventoryVehicleViewPageProps {
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
    fuel: "gas", // Default
    transmission: "auto", // Default
    bodyType: "sedan", // Default
    daysInStock,
    createdAt,
  };
};

export default function InventoryVehicleViewPage({
  params,
}: InventoryVehicleViewPageProps) {
  const vehicleId = params.id as Id<"vehicles">;
  const vehicleData = useQuery(api.vehicles.getById, { id: vehicleId });

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
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Vehicle Details</h1>
          <p className="text-sm text-muted">Vehicle ID: {params.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/inventory">Back to Inventory</Link>
          </Button>
          <Button asChild>
            <Link href={`/inventory/${params.id}/edit`}>Edit Vehicle</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              {vehicle.image ? (
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide broken images
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-muted-foreground">{vehicle.trim}</p>
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-primary">
                  {formatter.format(vehicle.retailPrice)}
                </h3>
                <Badge
                  variant={
                    vehicle.status === "active" ? "default" : "secondary"
                  }
                >
                  {vehicle.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">VIN</span>
              <span className="font-medium">{vehicle.vin}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock #</span>
              <span className="font-medium">{vehicle.stockNumber}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mileage</span>
              <span className="font-medium">
                {vehicle.odometer.toLocaleString()} mi
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days in Stock</span>
              <span className="font-medium">{vehicle.daysInStock}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
