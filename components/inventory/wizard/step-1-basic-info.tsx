"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import {
  VEHICLE_MAKES,
  VEHICLE_MODELS,
  BODY_TYPES,
} from "@/lib/constants/vehicle-data";
import {
  VehicleFormData,
  ValidationErrors,
} from "@/lib/services/vehicle-form.service";
import { decodeVIN, validateVIN } from "@/lib/services/vin-decoder.service";

interface Step1BasicInfoProps {
  data: VehicleFormData;
  errors: ValidationErrors;
  onUpdate: (field: keyof VehicleFormData, value: any) => void;
  onUpdateMultiple: (updates: Partial<VehicleFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function Step1BasicInfo({
  data,
  errors,
  onUpdate,
  onUpdateMultiple,
  onNext,
  onCancel,
}: Step1BasicInfoProps) {
  const [decoding, setDecoding] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [makeSearch, setMakeSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  const handleDecodeVIN = async () => {
    if (!validateVIN(data.vin)) {
      return;
    }

    setDecoding(true);
    setDecoded(false);

    try {
      const result = await decodeVIN(data.vin);

      if (result.error) {
        console.error(result.error);
      } else {
        onUpdateMultiple({
          year: result.year,
          make: result.make || "",
          model: result.model || "",
          bodyType: result.bodyType || "",
          engine: result.engine || "",
        });
        setDecoded(true);
        setTimeout(() => setDecoded(false), 3000);
      }
    } finally {
      setDecoding(false);
    }
  };

  const filteredMakes = VEHICLE_MAKES.filter((make) =>
    make.toLowerCase().includes(makeSearch.toLowerCase()),
  );

  const filteredModels = data.make
    ? (VEHICLE_MODELS[data.make] || []).filter((model) =>
        model.toLowerCase().includes(modelSearch.toLowerCase()),
      )
    : [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Stock Number - Auto-generated, editable */}
      <div className="space-y-2">
        <Label htmlFor="stockNumber" className="text-sm font-medium">
          Stock Number
        </Label>
        <Input
          id="stockNumber"
          value={data.stockNumber}
          onChange={(e) => onUpdate("stockNumber", e.target.value)}
          placeholder="AUTO-0001"
          className="bg-gray-50"
        />
      </div>

      {/* VIN Section */}
      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="space-y-2">
          <Label htmlFor="vin" className="text-sm font-medium">
            VIN (17 characters)
          </Label>
          <div className="flex gap-2">
            <Input
              id="vin"
              value={data.vin}
              onChange={(e) => {
                onUpdate("vin", e.target.value.toUpperCase());
                setDecoded(false);
              }}
              placeholder="1FA6P8F99G5123456"
              maxLength={17}
              className={`flex-1 ${errors.vin ? "border-red-500" : ""}`}
            />
            <Button
              onClick={handleDecodeVIN}
              disabled={decoding || !validateVIN(data.vin)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {decoding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Decoding...
                </>
              ) : (
                "Decode VIN"
              )}
            </Button>
          </div>
          {errors.vin && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.vin}
            </p>
          )}
          {decoded && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />✓ VIN decoded successfully
            </p>
          )}
        </div>
      </div>

      {/* Year, Make, Model, Trim, Body Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            Year <span className="text-red-500">*</span>
          </Label>
          <Select
            id="year"
            value={data.year?.toString() || ""}
            onChange={(e) =>
              onUpdate("year", e.target.value ? parseInt(e.target.value) : null)
            }
            className={errors.year ? "border-red-500" : ""}
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          {errors.year && <p className="text-xs text-red-600">{errors.year}</p>}
        </div>

        {/* Make with Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium">
            Make <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="make"
              value={data.make}
              onChange={(e) => {
                setMakeSearch(e.target.value);
                onUpdate("make", e.target.value);
              }}
              placeholder="Ford"
              className={errors.make ? "border-red-500" : ""}
              list="makes-list"
            />
            <datalist id="makes-list">
              {filteredMakes.map((make) => (
                <option key={make} value={make} />
              ))}
            </datalist>
          </div>
          {errors.make && <p className="text-xs text-red-600">{errors.make}</p>}
        </div>

        {/* Model with Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="model"
              value={data.model}
              onChange={(e) => {
                setModelSearch(e.target.value);
                onUpdate("model", e.target.value);
              }}
              placeholder="Mustang"
              className={errors.model ? "border-red-500" : ""}
              disabled={!data.make}
              list="models-list"
            />
            <datalist id="models-list">
              {filteredModels.map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </div>
          {errors.model && (
            <p className="text-xs text-red-600">{errors.model}</p>
          )}
        </div>

        {/* Trim */}
        <div className="space-y-2">
          <Label htmlFor="trim" className="text-sm font-medium">
            Trim
          </Label>
          <Input
            id="trim"
            value={data.trim}
            onChange={(e) => onUpdate("trim", e.target.value)}
            placeholder="EcoBoost Fastback"
          />
        </div>

        {/* Body Type */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bodyType" className="text-sm font-medium">
            Body Type <span className="text-red-500">*</span>
          </Label>
          <Select
            id="bodyType"
            value={data.bodyType}
            onChange={(e) => onUpdate("bodyType", e.target.value)}
            className={errors.bodyType ? "border-red-500" : ""}
          >
            <option value="">Select body type</option>
            {BODY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          {errors.bodyType && (
            <p className="text-xs text-red-600">{errors.bodyType}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
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
