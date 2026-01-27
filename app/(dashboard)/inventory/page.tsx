import { VehicleListing } from "@/components/inventory/vehicle-listing";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { Vehicle } from "@/types/vehicle";

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

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load vehicles:", error.message);
  }

  const vehicles = (data ?? []).map(mapVehicle);

  return <VehicleListing vehicles={vehicles} />;
}
