"use client";

import { useRouter } from "next/navigation";
import { Grid3X3, List } from "lucide-react";
import { VehicleStats } from "@/types/vehicle";

interface PageHeaderProps {
  stats: VehicleStats;
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function VehiclePageHeader({
  stats,
  view,
  onViewChange,
}: PageHeaderProps) {
  const router = useRouter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Title and View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">
            Inventory Management
          </h1>
          <p className="text-sm text-muted mt-1">
            {stats.total} vehicles | {formatCurrency(stats.totalValue)} total
            value
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewChange("grid")}
            className={`p-2 rounded transition-colors ${
              view === "grid"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewChange("table")}
            className={`p-2 rounded transition-colors ${
              view === "table"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Table view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vehicles */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-muted mb-2">Total</p>
          <p className="text-2xl font-bold text-heading">{stats.total}</p>
        </div>

        {/* Active Vehicles */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-muted mb-2">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>

        {/* Sold Vehicles */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-muted mb-2">Sold</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-muted mb-2">Total Value</p>
          <p className="text-2xl font-bold text-heading">
            {formatCurrency(stats.totalValue)}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push("/inventory/new")}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          + Add Vehicle
        </button>
      </div>
    </div>
  );
}
