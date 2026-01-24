"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import {
  CONDITIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
  DRIVE_TYPES,
  EXTERIOR_COLORS,
  INTERIOR_COLORS,
  DOOR_COUNTS,
  SEAT_COUNTS,
  ODOMETER_UNITS,
} from "@/lib/constants/vehicle-data";
import {
  VehicleFormData,
  ValidationErrors,
} from "@/lib/services/vehicle-form.service";

interface Step2SpecificationsProps {
  data: VehicleFormData;
  errors: ValidationErrors;
  onUpdate: (field: keyof VehicleFormData, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Specifications({
  data,
  errors,
  onUpdate,
  onBack,
  onNext,
}: Step2SpecificationsProps) {
  return (
    <div className="space-y-6">
      {/* Odometer Section */}
      <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <Label className="text-sm font-medium">Odometer Reading</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={data.odometer || ""}
            onChange={(e) =>
              onUpdate(
                "odometer",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="45000"
            className="flex-1"
          />
          <Select
            value={data.odometerUnit}
            onChange={(e) => onUpdate("odometerUnit", e.target.value)}
            className="w-24"
          >
            {ODOMETER_UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <Label className="text-sm font-medium">
          Condition <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-col sm:flex-row gap-4">
          {CONDITIONS.map((condition) => (
            <label
              key={condition.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="condition"
                value={condition.value}
                checked={data.condition === condition.value}
                onChange={(e) => onUpdate("condition", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">{condition.label}</span>
            </label>
          ))}
        </div>
        {errors.condition && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.condition}
          </p>
        )}
      </div>

      {/* Fuel, Transmission, Drive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuel" className="text-sm font-medium">
            Fuel <span className="text-red-500">*</span>
          </Label>
          <Select
            id="fuel"
            value={data.fuel}
            onChange={(e) => onUpdate("fuel", e.target.value)}
            className={errors.fuel ? "border-red-500" : ""}
          >
            <option value="">Select fuel type</option>
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </Select>
          {errors.fuel && <p className="text-xs text-red-600">{errors.fuel}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission" className="text-sm font-medium">
            Transmission <span className="text-red-500">*</span>
          </Label>
          <Select
            id="transmission"
            value={data.transmission}
            onChange={(e) => onUpdate("transmission", e.target.value)}
            className={errors.transmission ? "border-red-500" : ""}
          >
            <option value="">Select transmission</option>
            {TRANSMISSIONS.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </Select>
          {errors.transmission && (
            <p className="text-xs text-red-600">{errors.transmission}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="drive" className="text-sm font-medium">
            Drive Type <span className="text-red-500">*</span>
          </Label>
          <Select
            id="drive"
            value={data.drive}
            onChange={(e) => onUpdate("drive", e.target.value)}
            className={errors.drive ? "border-red-500" : ""}
          >
            <option value="">Select drive type</option>
            {DRIVE_TYPES.map((drive) => (
              <option key={drive} value={drive}>
                {drive}
              </option>
            ))}
          </Select>
          {errors.drive && (
            <p className="text-xs text-red-600">{errors.drive}</p>
          )}
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exteriorColor" className="text-sm font-medium">
            Exterior Color <span className="text-red-500">*</span>
          </Label>
          <Select
            id="exteriorColor"
            value={data.exteriorColor}
            onChange={(e) => onUpdate("exteriorColor", e.target.value)}
            className={errors.exteriorColor ? "border-red-500" : ""}
          >
            <option value="">Select color</option>
            {EXTERIOR_COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </Select>
          {errors.exteriorColor && (
            <p className="text-xs text-red-600">{errors.exteriorColor}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="interiorColor" className="text-sm font-medium">
            Interior Color <span className="text-red-500">*</span>
          </Label>
          <Select
            id="interiorColor"
            value={data.interiorColor}
            onChange={(e) => onUpdate("interiorColor", e.target.value)}
            className={errors.interiorColor ? "border-red-500" : ""}
          >
            <option value="">Select color</option>
            {INTERIOR_COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </Select>
          {errors.interiorColor && (
            <p className="text-xs text-red-600">{errors.interiorColor}</p>
          )}
        </div>
      </div>

      {/* Doors, Seats, Engine */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doors" className="text-sm font-medium">
            Doors <span className="text-red-500">*</span>
          </Label>
          <Select
            id="doors"
            value={data.doors}
            onChange={(e) => onUpdate("doors", e.target.value)}
            className={errors.doors ? "border-red-500" : ""}
          >
            <option value="">Select doors</option>
            {DOOR_COUNTS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </Select>
          {errors.doors && (
            <p className="text-xs text-red-600">{errors.doors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats" className="text-sm font-medium">
            Seats <span className="text-red-500">*</span>
          </Label>
          <Select
            id="seats"
            value={data.seats}
            onChange={(e) => onUpdate("seats", e.target.value)}
            className={errors.seats ? "border-red-500" : ""}
          >
            <option value="">Select seats</option>
            {SEAT_COUNTS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </Select>
          {errors.seats && (
            <p className="text-xs text-red-600">{errors.seats}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="engine" className="text-sm font-medium">
            Engine
          </Label>
          <Input
            id="engine"
            value={data.engine}
            onChange={(e) => onUpdate("engine", e.target.value)}
            placeholder="3.5L V6"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
