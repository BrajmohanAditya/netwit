"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  DISCOUNT_REASONS,
  DEFAULT_ADDITIONAL_COSTS,
} from "@/lib/constants/deal-data";
import {
  DealFormData,
  DealValidationErrors,
  calculateTotals,
  calculateTaxAmount,
} from "@/lib/services/deal-form.service";

interface Step2PricingProps {
  data: DealFormData;
  errors: DealValidationErrors;
  onUpdate: <K extends keyof DealFormData>(
    key: K,
    value: DealFormData[K],
  ) => void;
  onUpdateMultiple: (updates: Partial<DealFormData>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Pricing({
  data,
  errors,
  onUpdate,
  onUpdateMultiple,
  onBack,
  onNext,
}: Step2PricingProps) {
  const { base, additional, tax, total } = calculateTotals(data);

  const addCostRow = () => {
    const next = [...data.additionalCosts];
    const newCost = DEFAULT_ADDITIONAL_COSTS[next.length] || {
      id: `custom-${next.length + 1}`,
      label: `Cost ${next.length + 1}`,
      amount: 0,
    };
    onUpdate("additionalCosts", [...next, newCost]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Price</Label>
          <Input
            type="number"
            value={data.vehiclePrice}
            onChange={(e) => onUpdate("vehiclePrice", Number(e.target.value))}
          />
          {errors.vehiclePrice && (
            <p className="text-xs text-red-600">{errors.vehiclePrice}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Discount</Label>
          <Input
            type="number"
            value={data.discount}
            onChange={(e) => onUpdate("discount", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Reason</Label>
          <Select
            value={data.discountReason}
            onChange={(e) => onUpdate("discountReason", e.target.value)}
          >
            {DISCOUNT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Tax Rate</Label>
          <Input
            type="number"
            value={data.taxRate}
            onChange={(e) => onUpdate("taxRate", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Trade-In</Label>
          <input
            type="checkbox"
            checked={data.tradeInEnabled}
            onChange={(e) => onUpdate("tradeInEnabled", e.target.checked)}
          />
        </div>
        {data.tradeInEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Vehicle"
              value={data.tradeInVehicle}
              onChange={(e) => onUpdate("tradeInVehicle", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Value"
              value={data.tradeInValue}
              onChange={(e) => onUpdate("tradeInValue", Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Additional Costs</Label>
          <Button variant="outline" size="sm" onClick={addCostRow}>
            + Add Cost
          </Button>
        </div>
        <div className="space-y-2">
          {data.additionalCosts.map((cost, index) => (
            <div key={cost.id} className="grid grid-cols-2 gap-3">
              <Input
                value={cost.label}
                onChange={(e) => {
                  const next = [...data.additionalCosts];
                  next[index] = { ...next[index], label: e.target.value };
                  onUpdate("additionalCosts", next);
                }}
              />
              <Input
                type="number"
                value={cost.amount}
                onChange={(e) => {
                  const next = [...data.additionalCosts];
                  next[index] = {
                    ...next[index],
                    amount: Number(e.target.value),
                  };
                  onUpdate("additionalCosts", next);
                }}
              />
            </div>
          ))}
          {data.additionalCosts.length === 0 && (
            <p className="text-xs text-muted">No additional costs added.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>${base.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Additional Costs</span>
          <span>${additional.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax ({data.taxRate}%)</span>
          <span>
            $
            {calculateTaxAmount(
              base + additional,
              data.taxRate,
            ).toLocaleString()}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          ← Back
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
