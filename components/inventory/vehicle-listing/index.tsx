"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle, VehicleFilters, VehicleStats } from "@/types/vehicle";
import { VehiclePageHeader } from "./page-header";
import { FilterBar } from "./filter-bar";
import { VehicleGrid } from "./vehicle-grid";
import { VehicleTable } from "./vehicle-table";
import { BulkActionsBar } from "./bulk-actions-bar";

interface VehicleListingProps {
  vehicles: Vehicle[];
}

export function VehicleListing({ vehicles }: VehicleListingProps) {
  const router = useRouter();
  const [items, setItems] = useState<Vehicle[]>(vehicles);
  const storageKey = "inventory.deletedVehicleIds";
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set(),
  );
  const [filters, setFilters] = useState<VehicleFilters>({
    search: "",
    status: [],
    make: [],
    year: [new Date().getFullYear() - 10, new Date().getFullYear()],
    price: [0, 100000],
    odometer: [0, 200000],
    fuel: [],
    transmission: [],
    bodyType: [],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const deletedIds = new Set<string>(JSON.parse(stored));
      setItems(vehicles.filter((vehicle) => !deletedIds.has(vehicle.id)));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey, vehicles]);

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

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(storageKey);
      const deletedIds = new Set<string>(stored ? JSON.parse(stored) : []);
      deletedIds.add(id);
      window.localStorage.setItem(storageKey, JSON.stringify([...deletedIds]));
    }
    setItems((prev) => prev.filter((vehicle) => vehicle.id !== id));
    setSelectedVehicles((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    const idsToDelete = new Set(selectedVehicles);
    if (typeof window !== "undefined" && idsToDelete.size > 0) {
      const stored = window.localStorage.getItem(storageKey);
      const deletedIds = new Set<string>(stored ? JSON.parse(stored) : []);
      idsToDelete.forEach((id) => deletedIds.add(id));
      window.localStorage.setItem(storageKey, JSON.stringify([...deletedIds]));
    }
    setItems((prev) => prev.filter((vehicle) => !idsToDelete.has(vehicle.id)));
    setSelectedVehicles(new Set());
  };

  const handleExport = () => {
    console.log("Export vehicles:", Array.from(selectedVehicles));
    // TODO: Implement export functionality
  };

  const handleChangeStatus = () => {
    console.log("Change status for vehicles:", Array.from(selectedVehicles));
    // TODO: Implement change status functionality
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
