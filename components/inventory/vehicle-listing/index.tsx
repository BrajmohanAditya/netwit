"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle, VehicleFilters, VehicleStats } from "@/types/vehicle";
import { VehiclePageHeader } from "./page-header";
import { FilterBar } from "./filter-bar";
import { VehicleGrid } from "./vehicle-grid";
import { VehicleTable } from "./vehicle-table";
import { BulkActionsBar } from "./bulk-actions-bar";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface VehicleListingProps {
  vehicles: Vehicle[];
}

export function VehicleListing({ vehicles }: VehicleListingProps) {
  const router = useRouter();
  const [items, setItems] = useState<Vehicle[]>(vehicles);
  const supabase = useMemo(() => createClient(), []);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set(),
  );
  const [filters, setFilters] = useState<VehicleFilters>({
    search: "",
    status: [],
    make: [],
    year: [0, new Date().getFullYear()],
    price: [0, 100000],
    odometer: [0, 200000],
    fuel: [],
    transmission: [],
    bodyType: [],
  });

  const toDbStatus = (status: Vehicle["status"]) => {
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
        return "Inactive";
    }
  };

  // Filter vehicles based on current filters
  const filteredVehicles = useMemo(() => {
    return items.filter((vehicle) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !vehicle.make.toLowerCase().includes(search) &&
          !vehicle.model.toLowerCase().includes(search) &&
          !vehicle.vin.toLowerCase().includes(search) &&
          !vehicle.stockNumber.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      if (
        filters.status.length > 0 &&
        !filters.status.includes(vehicle.status)
      ) {
        return false;
      }

      // Make filter
      if (filters.make.length > 0 && !filters.make.includes(vehicle.make)) {
        return false;
      }

      // Year filter
      if (vehicle.year < filters.year[0] || vehicle.year > filters.year[1]) {
        return false;
      }

      // Price filter
      if (
        vehicle.retailPrice < filters.price[0] ||
        vehicle.retailPrice > filters.price[1]
      ) {
        return false;
      }

      // Odometer filter
      if (
        vehicle.odometer < filters.odometer[0] ||
        vehicle.odometer > filters.odometer[1]
      ) {
        return false;
      }

      // Fuel filter
      if (filters.fuel.length > 0 && !filters.fuel.includes(vehicle.fuel)) {
        return false;
      }

      // Transmission filter
      if (
        filters.transmission.length > 0 &&
        !filters.transmission.includes(vehicle.transmission)
      ) {
        return false;
      }

      // Body type filter
      if (
        filters.bodyType.length > 0 &&
        !filters.bodyType.includes(vehicle.bodyType)
      ) {
        return false;
      }

      return true;
    });
  }, [items, filters]);

  // Calculate stats
  const stats: VehicleStats = useMemo(() => {
    return {
      total: items.length,
      active: items.filter((v) => v.status === "active").length,
      sold: items.filter((v) => v.status === "sold").length,
      totalValue: items.reduce((sum, v) => sum + v.retailPrice, 0),
    };
  }, [items]);

  const handleSelectVehicle = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedVehicles);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedVehicles(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedVehicles(new Set(filteredVehicles.map((v) => v.id)));
    } else {
      setSelectedVehicles(new Set());
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    router.push(`/inventory/${vehicle.id}/edit`);
  };

  const handleView = (vehicle: Vehicle) => {
    router.push(`/inventory/${vehicle.id}`);
  };

  const handleDelete = async (id: string) => {
    const previousItems = items;
    setItems((prev) => prev.filter((vehicle) => vehicle.id !== id));
    setSelectedVehicles((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      setItems(previousItems);
      toast.error("Failed to delete vehicle. Please try again.");
    } else {
      toast.success("Vehicle deleted successfully.");
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedVehicles);
    if (idsToDelete.length === 0) return;

    const previousItems = items;
    setItems((prev) =>
      prev.filter((vehicle) => !selectedVehicles.has(vehicle.id)),
    );
    setSelectedVehicles(new Set());

    const { error } = await supabase
      .from("vehicles")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      setItems(previousItems);
      toast.error("Failed to delete selected vehicles.");
    } else {
      toast.success("Selected vehicles deleted.");
    }
  };

  const handleExport = () => {
    const selected = items.filter((vehicle) =>
      selectedVehicles.has(vehicle.id),
    );
    if (selected.length === 0) return;

    const headers = [
      "Stock Number",
      "Year",
      "Make",
      "Model",
      "Trim",
      "VIN",
      "Status",
      "Odometer",
      "Purchase Price",
      "Retail Price",
    ];

    const rows = selected.map((vehicle) => [
      vehicle.stockNumber,
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim,
      vehicle.vin,
      vehicle.status,
      vehicle.odometer,
      vehicle.purchasePrice,
      vehicle.retailPrice,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChangeStatus = async () => {
    const selected = items.filter((vehicle) =>
      selectedVehicles.has(vehicle.id),
    );
    if (selected.length === 0) return;

    const updatable = selected.filter((vehicle) => vehicle.status !== "sold");
    if (updatable.length === 0) {
      toast.error("Selected vehicles cannot be updated.");
      return;
    }

    const allInactive = updatable.every(
      (vehicle) => vehicle.status === "inactive",
    );
    const nextStatus: Vehicle["status"] = allInactive ? "active" : "inactive";

    const previousItems = items;
    setItems((prev) =>
      prev.map((vehicle) =>
        selectedVehicles.has(vehicle.id) && vehicle.status !== "sold"
          ? { ...vehicle, status: nextStatus }
          : vehicle,
      ),
    );

    const idsToUpdate = updatable.map((vehicle) => vehicle.id);
    const { error } = await supabase
      .from("vehicles")
      .update({ status: toDbStatus(nextStatus) })
      .in("id", idsToUpdate);

    if (error) {
      setItems(previousItems);
      toast.error("Failed to update status.");
    } else {
      toast.success("Status updated successfully.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <VehiclePageHeader stats={stats} view={view} onViewChange={setView} />

      {/* Filters */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Vehicle List - Grid or Table */}
      {view === "grid" ? (
        <VehicleGrid
          vehicles={filteredVehicles}
          selectedVehicles={selectedVehicles}
          onSelectVehicle={handleSelectVehicle}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <VehicleTable
          vehicles={filteredVehicles}
          selectedVehicles={selectedVehicles}
          onSelectVehicle={handleSelectVehicle}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedVehicles.size}
        onChangeStatus={handleChangeStatus}
        onExport={handleExport}
        onDelete={handleBulkDelete}
        onClose={() => setSelectedVehicles(new Set())}
      />
    </div>
  );
}
