"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  DealFormData,
  DealValidationErrors,
} from "@/lib/services/deal-form.service";

interface Step1BasicInfoProps {
  data: DealFormData;
  errors: DealValidationErrors;
  onUpdate: <K extends keyof DealFormData>(
    key: K,
    value: DealFormData[K],
  ) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function Step1BasicInfo({
  data,
  errors,
  onUpdate,
  onNext,
  onCancel,
}: Step1BasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Deal #</Label>
          <Input value={data.dealNumber} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Salesperson</Label>
          <Select
            value={data.salesperson}
            onChange={(e) => onUpdate("salesperson", e.target.value)}
          >
            <option value="Current user">Current user</option>
            <option value="Ava Carter">Ava Carter</option>
            <option value="Noah Reed">Noah Reed</option>
          </Select>
          {errors.salesperson && (
            <p className="text-xs text-red-600">{errors.salesperson}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-sm font-medium">Customer</Label>
          <Input
            value={data.customer}
            onChange={(e) => onUpdate("customer", e.target.value)}
            placeholder="Search customer"
          />
          {errors.customer && (
            <p className="text-xs text-red-600">{errors.customer}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-sm font-medium">Vehicle</Label>
          <Input
            value={data.vehicle}
            onChange={(e) => onUpdate("vehicle", e.target.value)}
            placeholder="Search vehicle"
          />
          {errors.vehicle && (
            <p className="text-xs text-red-600">{errors.vehicle}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Deal Date</Label>
          <Input
            type="date"
            value={data.dealDate}
            onChange={(e) => onUpdate("dealDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Expected Delivery</Label>
          <Input
            type="date"
            value={data.expectedDelivery}
            onChange={(e) => onUpdate("expectedDelivery", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onNext}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
