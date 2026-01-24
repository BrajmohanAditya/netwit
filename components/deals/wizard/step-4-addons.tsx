"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ACCESSORY_OPTIONS, WARRANTY_TERMS } from "@/lib/constants/deal-data";
import {
  DealFormData,
  calculateTotals,
} from "@/lib/services/deal-form.service";

interface Step4AddonsProps {
  data: DealFormData;
  onUpdate: <K extends keyof DealFormData>(
    key: K,
    value: DealFormData[K],
  ) => void;
  onUpdateMultiple: (updates: Partial<DealFormData>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step4Addons({
  data,
  onUpdate,
  onUpdateMultiple,
  onBack,
  onNext,
}: Step4AddonsProps) {
  const selectedAccessoryTotal = data.accessories
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.cost, 0);
  const totals = calculateTotals(data);

  const addCustomAccessory = () => {
    if (!data.customAccessoryLabel || !data.customAccessoryCost) return;
    const next = [
      ...data.accessories,
      {
        id: `custom-${data.customAccessoryLabel}`,
        label: data.customAccessoryLabel,
        cost: data.customAccessoryCost,
        selected: true,
      },
    ];
    onUpdateMultiple({
      accessories: next,
      customAccessoryLabel: "",
      customAccessoryCost: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Warranty</Label>
            <input
              type="checkbox"
              checked={data.warrantyEnabled}
              onChange={(e) => onUpdate("warrantyEnabled", e.target.checked)}
            />
          </div>
          {data.warrantyEnabled && (
            <div className="space-y-3">
              <Input
                placeholder="Provider"
                value={data.warrantyProvider}
                onChange={(e) => onUpdate("warrantyProvider", e.target.value)}
              />
              <Select
                value={data.warrantyTerm}
                onChange={(e) => onUpdate("warrantyTerm", e.target.value)}
              >
                {WARRANTY_TERMS.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </Select>
              <Input
                type="number"
                placeholder="Cost"
                value={data.warrantyCost}
                onChange={(e) =>
                  onUpdate("warrantyCost", Number(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="Commission"
                value={data.warrantyCommission}
                onChange={(e) =>
                  onUpdate("warrantyCommission", Number(e.target.value))
                }
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Insurance</Label>
            <input
              type="checkbox"
              checked={data.insuranceEnabled}
              onChange={(e) => onUpdate("insuranceEnabled", e.target.checked)}
            />
          </div>
          {data.insuranceEnabled && (
            <div className="space-y-3">
              <Input
                placeholder="Provider"
                value={data.insuranceProvider}
                onChange={(e) => onUpdate("insuranceProvider", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Premium"
                value={data.insurancePremium}
                onChange={(e) =>
                  onUpdate("insurancePremium", Number(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="Commission"
                value={data.insuranceCommission}
                onChange={(e) =>
                  onUpdate("insuranceCommission", Number(e.target.value))
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <Label className="text-sm font-medium">Accessories</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ACCESSORY_OPTIONS.map((item) => {
            const isSelected =
              data.accessories.find((acc) => acc.id === item.id)?.selected ??
              false;
            return (
              <label key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const next = [...data.accessories];
                    const idx = next.findIndex((acc) => acc.id === item.id);
                    if (idx >= 0) {
                      next[idx] = { ...next[idx], selected: e.target.checked };
                    } else {
                      next.push({ ...item, selected: e.target.checked });
                    }
                    onUpdate("accessories", next);
                  }}
                />
                {item.label} - ${item.cost}
              </label>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Custom accessory"
            value={data.customAccessoryLabel}
            onChange={(e) => onUpdate("customAccessoryLabel", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Cost"
            value={data.customAccessoryCost}
            onChange={(e) =>
              onUpdate("customAccessoryCost", Number(e.target.value))
            }
          />
          <Button variant="outline" onClick={addCustomAccessory}>
            + Add Custom
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Updated Total</span>
          <span>
            ${(totals.total + selectedAccessoryTotal).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Add-ons</span>
          <span>+${selectedAccessoryTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Sales Commission</span>
          <span>
            $
            {(
              data.salesBaseCommission + data.salesAddonCommission
            ).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Paid</span>
          <input
            type="checkbox"
            checked={data.commissionPaid}
            onChange={(e) => onUpdate("commissionPaid", e.target.checked)}
          />
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
