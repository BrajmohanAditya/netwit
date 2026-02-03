"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Eye, Edit2, Copy } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { useState } from "react";

interface VehicleRowProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (id: string) => void;
}

export function VehicleRow({
  vehicle,
  isSelected,
  onSelect,
  onDelete,
}: VehicleRowProps) {
  const [copiedVin, setCopiedVin] = useState(false);

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

  const handleCopyVin = async () => {
    await navigator.clipboard.writeText(vehicle.vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2000);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(vehicle.id, e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
      </td>

      {/* Thumbnail */}
      <td className="px-4 py-3">
        <div className="relative w-16 h-12 bg-gray-100 rounded overflow-hidden">
          <Image
            src={vehicle.image}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
          />
        </div>
      </td>

      {/* Stock Number */}
      <td className="px-4 py-3 font-mono text-sm text-gray-700">
        {vehicle.stockNumber}
      </td>

      {/* Year */}
      <td className="px-4 py-3 text-sm">{vehicle.year}</td>

      {/* Make */}
      <td className="px-4 py-3 text-sm">{vehicle.make}</td>

      {/* Model */}
      <td className="px-4 py-3 text-sm">{vehicle.model}</td>

      {/* Trim */}
      <td className="px-4 py-3 text-sm text-muted">{vehicle.trim}</td>

      {/* VIN */}
      <td className="px-4 py-3">
        <button
          onClick={handleCopyVin}
          className="font-mono text-sm text-gray-700 hover:text-primary transition-colors flex items-center gap-1"
          title="Click to copy"
        >
          {vehicle.vin.substring(0, 8)}...
          {copiedVin ? (
            <span className="text-xs text-green-600">Copied!</span>
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </td>

      {/* Odometer */}
      <td className="px-4 py-3 text-sm text-muted">
        {vehicle.odometer.toLocaleString()} km
      </td>

      {/* Purchase Price */}
      <td className="px-4 py-3 text-sm">
        {formatCurrency(vehicle.purchasePrice)}
      </td>

      {/* Retail Price */}
      <td className="px-4 py-3 text-sm font-semibold text-primary">
        {formatCurrency(vehicle.retailPrice)}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}
        >
          {statusLabel}
        </span>
      </td>

      {/* Days in Stock */}
      <td className="px-4 py-3 text-sm text-muted">
        {vehicle.daysInStock} days
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/inventory/${vehicle.id}/edit`}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <Link
            href={`/inventory/${vehicle.id}`}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(vehicle.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
