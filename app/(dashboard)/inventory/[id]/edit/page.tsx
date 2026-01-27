import Link from "next/link";
import { notFound } from "next/navigation";
import { VehicleEditForm } from "@/components/inventory/vehicle-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { Vehicle } from "@/types/vehicle";

interface InventoryVehicleEditPageProps {
  params: { id: string };
}

type DbVehicle = Database["public"]["Tables"]["vehicles"]["Row"];

const statusMap: Record<DbVehicle["status"], Vehicle["status"]> = {
  Active: "active",
  Inactive: "inactive",
  Sold: "sold",
  "Coming Soon": "coming-soon",
};

const FALLBACK_IMAGE = "https://placehold.co/800x450?text=Vehicle";

const mapVehicle = (row: DbVehicle): Vehicle => {
  const createdAt = new Date(row.created_at);
  const daysInStock = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    id: row.id,
    stockNumber: row.stock_number ?? "N/A",
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim ?? "",
    vin: row.vin,
    image: row.image_gallery?.[0] ?? FALLBACK_IMAGE,
    status: statusMap[row.status],
    purchasePrice: row.purchase_price,
    retailPrice: row.retail_price,
    odometer: row.odometer,
    fuel: "gas",
    transmission: "auto",
    bodyType: "sedan",
    daysInStock,
    createdAt,
  };
};

export const dynamic = "force-dynamic";

export default async function InventoryVehicleEditPage({
  params,
}: InventoryVehicleEditPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load vehicle:", error.message);
  }

  const vehicle = data ? mapVehicle(data) : null;

  if (!vehicle) {
    notFound();
  }

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
