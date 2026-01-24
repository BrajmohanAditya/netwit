"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  VehicleFormData,
  ValidationErrors,
  formatCurrency,
  parseCurrency,
  calculateEstimatedIncome,
} from "@/lib/services/vehicle-form.service";

interface Step3PricingProps {
  data: VehicleFormData;
  errors: ValidationErrors;
  onUpdate: (field: keyof VehicleFormData, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3Pricing({
  data,
  errors,
  onUpdate,
  onBack,
  onNext,
}: Step3PricingProps) {
  const { income, isPositive } = calculateEstimatedIncome(data);

  const handlePriceInput = (field: keyof VehicleFormData, value: string) => {
    const numValue = parseCurrency(value);
    onUpdate(field, numValue > 0 ? numValue : null);
  };

  return (
    <div className="space-y-6">
      {/* Pricing Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Purchase Price */}
        <div className="space-y-2">
          <Label htmlFor="purchasePrice" className="text-sm font-medium">
            Purchase Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="purchasePrice"
            type="number"
            value={data.purchasePrice || ""}
            onChange={(e) =>
              onUpdate(
                "purchasePrice",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="28000"
            className={errors.purchasePrice ? "border-red-500" : ""}
          />
          {data.purchasePrice && (
            <p className="text-xs text-gray-600">
              {formatCurrency(data.purchasePrice)}
            </p>
          )}
          {errors.purchasePrice && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.purchasePrice}
            </p>
          )}
        </div>

        {/* Retail Price */}
        <div className="space-y-2">
          <Label htmlFor="retailPrice" className="text-sm font-medium">
            Retail Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="retailPrice"
            type="number"
            value={data.retailPrice || ""}
            onChange={(e) =>
              onUpdate(
                "retailPrice",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="34500"
            className={errors.retailPrice ? "border-red-500" : ""}
          />
          {data.retailPrice && (
            <p className="text-xs text-gray-600">
              {formatCurrency(data.retailPrice)}
            </p>
          )}
          {errors.retailPrice && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.retailPrice}
            </p>
          )}
        </div>

        {/* Special Price */}
        <div className="space-y-2">
          <Label htmlFor="specialPrice" className="text-sm font-medium">
            Special Price (Optional)
          </Label>
          <Input
            id="specialPrice"
            type="number"
            value={data.specialPrice || ""}
            onChange={(e) =>
              onUpdate(
                "specialPrice",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="0"
          />
          {data.specialPrice && (
            <p className="text-xs text-gray-600">
              {formatCurrency(data.specialPrice)}
            </p>
          )}
        </div>

        {/* Extra Costs */}
        <div className="space-y-2">
          <Label htmlFor="extraCosts" className="text-sm font-medium">
            Extra Costs (Optional)
          </Label>
          <Input
            id="extraCosts"
            type="number"
            value={data.extraCosts || ""}
            onChange={(e) =>
              onUpdate(
                "extraCosts",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="0"
          />
          {data.extraCosts && (
            <p className="text-xs text-gray-600">
              {formatCurrency(data.extraCosts)}
            </p>
          )}
        </div>

        {/* Taxes */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="taxes" className="text-sm font-medium">
            Taxes (Auto-calculated or manual)
          </Label>
          <Input
            id="taxes"
            type="number"
            value={data.taxes || ""}
            onChange={(e) =>
              onUpdate(
                "taxes",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="Auto-calculated"
          />
          {data.taxes && (
            <p className="text-xs text-gray-600">
              {formatCurrency(data.taxes)}
            </p>
          )}
        </div>
      </div>

      {/* Estimated Income Card */}
      <div
        className={`p-6 rounded-lg border-2 ${
          isPositive
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-300"
        }`}
      >
        <p className="text-sm text-gray-600 mb-2">Estimated Income</p>
        <p
          className={`text-3xl font-bold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(income)}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Retail Price - Purchase Price - Extra Costs - Taxes
        </p>
      </div>

      {/* Calculation Breakdown */}
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Retail Price:</span>
          <span className="font-medium">
            {formatCurrency(data.retailPrice || 0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">- Purchase Price:</span>
          <span className="font-medium">
            {formatCurrency(data.purchasePrice || 0)}
          </span>
        </div>
        {data.extraCosts ? (
          <div className="flex justify-between">
            <span className="text-gray-600">- Extra Costs:</span>
            <span className="font-medium">
              {formatCurrency(data.extraCosts)}
            </span>
          </div>
        ) : null}
        {data.taxes ? (
          <div className="flex justify-between">
            <span className="text-gray-600">- Taxes:</span>
            <span className="font-medium">{formatCurrency(data.taxes)}</span>
          </div>
        ) : null}
        <div className="border-t border-gray-300 pt-2 flex justify-between">
          <span className="font-semibold">Estimated Income:</span>
          <span
            className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(income)}
          </span>
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
