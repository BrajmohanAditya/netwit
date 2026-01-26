import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockVehicles } from "@/lib/mock/vehicles";

interface InventoryVehicleViewPageProps {
  params: { id: string };
}

export default function InventoryVehicleViewPage({
  params,
}: InventoryVehicleViewPageProps) {
  const vehicle = mockVehicles.find((item) => item.id === params.id);

  if (!vehicle) {
    notFound();
  }

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
              <Image
                src={vehicle.image}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-muted">Stock #{vehicle.stockNumber}</p>
              <h2 className="text-xl font-semibold text-heading">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-muted">{vehicle.trim}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted">Retail Price</p>
                <p className="text-lg font-semibold text-primary">
                  ${vehicle.retailPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Purchase Price</p>
                <p className="text-lg font-semibold">
                  ${vehicle.purchasePrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Odometer</p>
                <p className="text-lg font-semibold">
                  {vehicle.odometer.toLocaleString()} km
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Status</p>
                <p className="text-lg font-semibold capitalize">
                  {vehicle.status.replace("-", " ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">VIN</span>
              <span className="font-mono">{vehicle.vin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Fuel</span>
              <span className="capitalize">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Transmission</span>
              <span className="uppercase">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Body Type</span>
              <span className="capitalize">{vehicle.bodyType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Days in Stock</span>
              <span>{vehicle.daysInStock}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
