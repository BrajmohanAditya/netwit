"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Eye, Edit2, Fuel, Zap } from "lucide-react";
import { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (id: string) => void;
}

export function VehicleCard({
  vehicle,
  isSelected,
  onSelect,
  onDelete,
}: VehicleCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "coming-soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = {
    active: "Active",
    sold: "Sold",
    inactive: "Inactive",
    "coming-soon": "Coming Soon",
  }[vehicle.status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-video overflow-hidden">
        <Image
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}
        >
          {statusLabel}
        </div>

        {/* Stock Number */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-mono text-gray-700">
          {vehicle.stockNumber}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Checkbox and Title */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(vehicle.id, e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-heading">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-muted">{vehicle.trim}</p>
          </div>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-primary">
          {formatCurrency(vehicle.retailPrice)}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1">
            {vehicle.fuel === "electric" ? (
              <Zap className="h-4 w-4" />
            ) : (
              <Fuel className="h-4 w-4" />
            )}
            {vehicle.fuel}
          </span>
          <span>{vehicle.odometer.toLocaleString()} km</span>
          <span>{vehicle.transmission}</span>
        </div>

        {/* VIN */}
        <div className="font-mono text-xs text-muted truncate border-t border-gray-100 pt-2">
          VIN: {vehicle.vin}
        </div>

        {/* Days in Stock */}
        <p className="text-xs text-muted">
          {vehicle.daysInStock} days in stock
        </p>

        {/* Actions - Show on Hover */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-gray-100">
          <Link
            href={`/inventory/${vehicle.id}/edit`}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Link>
          <Link
            href={`/inventory/${vehicle.id}`}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
          <button
            onClick={() => onDelete(vehicle.id)}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
