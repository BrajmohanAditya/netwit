"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  VehicleFormData,
  formatCurrency,
  calculateEstimatedIncome,
} from "@/lib/services/vehicle-form.service";
import { getDraftSavedTime } from "@/lib/services/vehicle-form.service";
import { useState, useEffect } from "react";

interface Step5ReviewProps {
  data: VehicleFormData;
  draftSavedAt?: string;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function Step5Review({
  data,
  draftSavedAt,
  onBack,
  onSubmit,
  isLoading = false,
}: Step5ReviewProps) {
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const { income, isPositive } = calculateEstimatedIncome(data);

  useEffect(() => {
    setSavedTime(getDraftSavedTime());
  }, []);

  return (
    <div className="space-y-6">
      {/* Auto-Save Indicator */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900">Draft auto-saved</p>
          <p className="text-xs text-green-700 mt-1">
            {savedTime && `Last saved at ${savedTime}`}
          </p>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          <span className="text-2xl">📋</span> Basic Information
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Stock Number</p>
            <p className="font-medium text-heading">{data.stockNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">VIN</p>
            <p className="font-medium text-heading">{data.vin}</p>
          </div>
          <div>
            <p className="text-gray-600">Year</p>
            <p className="font-medium text-heading">{data.year}</p>
          </div>
          <div>
            <p className="text-gray-600">Make</p>
            <p className="font-medium text-heading">{data.make}</p>
          </div>
          <div>
            <p className="text-gray-600">Model</p>
            <p className="font-medium text-heading">{data.model}</p>
          </div>
          <div>
            <p className="text-gray-600">Trim</p>
            <p className="font-medium text-heading">{data.trim || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600">Body Type</p>
            <p className="font-medium text-heading">{data.bodyType}</p>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          <span className="text-2xl">⚙️</span> Specifications
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Condition</p>
            <Badge
              className={`mt-1 ${
                data.condition === "new"
                  ? "bg-blue-100 text-blue-800"
                  : data.condition === "cpo"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {data.condition?.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Fuel</p>
            <p className="font-medium text-heading">{data.fuel}</p>
          </div>
          <div>
            <p className="text-gray-600">Transmission</p>
            <p className="font-medium text-heading">{data.transmission}</p>
          </div>
          <div>
            <p className="text-gray-600">Drive</p>
            <p className="font-medium text-heading">{data.drive}</p>
          </div>
          <div>
            <p className="text-gray-600">Odometer</p>
            <p className="font-medium text-heading">
              {data.odometer?.toLocaleString()} {data.odometerUnit}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Engine</p>
            <p className="font-medium text-heading">{data.engine}</p>
          </div>
          <div>
            <p className="text-gray-600">Exterior</p>
            <p className="font-medium text-heading">{data.exteriorColor}</p>
          </div>
          <div>
            <p className="text-gray-600">Interior</p>
            <p className="font-medium text-heading">{data.interiorColor}</p>
          </div>
          <div>
            <p className="text-gray-600">Doors / Seats</p>
            <p className="font-medium text-heading">
              {data.doors} / {data.seats}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          <span className="text-2xl">💰</span> Pricing
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Purchase Price</p>
            <p className="font-medium text-heading">
              {formatCurrency(data.purchasePrice || 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Retail Price</p>
            <p className="font-medium text-heading">
              {formatCurrency(data.retailPrice || 0)}
            </p>
          </div>
          {data.specialPrice ? (
            <div>
              <p className="text-gray-600">Special Price</p>
              <p className="font-medium text-heading">
                {formatCurrency(data.specialPrice)}
              </p>
            </div>
          ) : null}
          {data.extraCosts ? (
            <div>
              <p className="text-gray-600">Extra Costs</p>
              <p className="font-medium text-heading">
                {formatCurrency(data.extraCosts)}
              </p>
            </div>
          ) : null}
          {data.taxes ? (
            <div>
              <p className="text-gray-600">Taxes</p>
              <p className="font-medium text-heading">
                {formatCurrency(data.taxes)}
              </p>
            </div>
          ) : null}
        </div>

        {/* Estimated Income */}
        <div
          className={`mt-4 p-4 rounded-lg border-2 ${
            isPositive
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Estimated Income</p>
          <p
            className={`text-2xl font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(income)}
          </p>
        </div>
      </div>

      {/* Images Section */}
      {data.images.length > 0 && (
        <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
            <span className="text-2xl">📷</span> Images ({data.images.length})
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {data.images.slice(0, 5).map((image, index) => (
              <div
                key={index}
                className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                <Image
                  src={image}
                  alt={`Vehicle ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === data.primaryImageIndex && (
                  <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    Primary
                  </div>
                )}
              </div>
            ))}
            {data.images.length > 5 && (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  +{data.images.length - 5}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description Section */}
      {data.description && (
        <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
            <span className="text-2xl">📝</span> Description
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {data.description}
          </p>
        </div>
      )}

      {/* Confirmation Message */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Ready to submit?</p>
          <p className="text-xs text-blue-700 mt-1">
            Click Submit to add this vehicle to your inventory
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
          disabled={isLoading}
        >
          ← Back
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "✓ Submit Vehicle"}
        </Button>
      </div>
    </div>
  );
}
