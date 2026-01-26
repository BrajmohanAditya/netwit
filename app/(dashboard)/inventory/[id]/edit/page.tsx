import Link from "next/link";
import { notFound } from "next/navigation";
import { VehicleEditForm } from "@/components/inventory/vehicle-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockVehicles } from "@/lib/mock/vehicles";

interface InventoryVehicleEditPageProps {
  params: { id: string };
}

export default function InventoryVehicleEditPage({
  params,
}: InventoryVehicleEditPageProps) {
  const vehicle = mockVehicles.find((item) => item.id === params.id);

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
