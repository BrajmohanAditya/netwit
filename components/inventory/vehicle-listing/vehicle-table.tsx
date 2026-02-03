"use client";

import { Vehicle } from "@/types/vehicle";
import { VehicleRow } from "./vehicle-row";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface VehicleTableProps {
  vehicles: Vehicle[];
  selectedVehicles: Set<string>;
  onSelectVehicle: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onDelete: (id: string) => void;
}

type SortField = keyof Vehicle | null;
type SortDirection = "asc" | "desc";

export function VehicleTable({
  vehicles,
  selectedVehicles,
  onSelectVehicle,
  onSelectAll,
  onDelete,
}: VehicleTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    if (typeof aValue === "number") {
      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    return 0;
  });

  const isAllSelected =
    vehicles.length > 0 && selectedVehicles.size === vehicles.length;

  const TableHeader = ({
    label,
    field,
  }: {
    label: string;
    field?: SortField;
  }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">
      <button
        onClick={() => field && handleSort(field)}
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
        disabled={!field}
      >
        {label}
        {field &&
          sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </button>
    </th>
  );

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <p className="text-gray-500 font-medium">No vehicles found</p>
          <p className="text-sm text-muted">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left border-b border-gray-200 bg-gray-50">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </th>
              <TableHeader label="Image" />
              <TableHeader label="Stock #" field="stockNumber" />
              <TableHeader label="Year" field="year" />
              <TableHeader label="Make" field="make" />
              <TableHeader label="Model" field="model" />
              <TableHeader label="Trim" field="trim" />
              <TableHeader label="VIN" field="vin" />
              <TableHeader label="Odometer" field="odometer" />
              <TableHeader label="Purchase Price" field="purchasePrice" />
              <TableHeader label="Retail Price" field="retailPrice" />
              <TableHeader label="Status" field="status" />
              <TableHeader label="Days in Stock" field="daysInStock" />
              <TableHeader label="Actions" />
            </tr>
          </thead>
          <tbody>
            {sortedVehicles.map((vehicle) => (
              <VehicleRow
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={selectedVehicles.has(vehicle.id)}
                onSelect={onSelectVehicle}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
