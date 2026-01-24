"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  FINANCING_TYPES,
  PAYMENT_FREQUENCIES,
  PAYMENT_METHODS,
} from "@/lib/constants/deal-data";
import {
  DealFormData,
  DealValidationErrors,
  calculateLoan,
} from "@/lib/services/deal-form.service";

interface Step3PaymentProps {
  data: DealFormData;
  errors: DealValidationErrors;
  onUpdate: <K extends keyof DealFormData>(
    key: K,
    value: DealFormData[K],
  ) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3Payment({
  data,
  errors,
  onUpdate,
  onBack,
  onNext,
}: Step3PaymentProps) {
  const loan = calculateLoan(data);
  const isFinancing = data.financingType !== "cash";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Down Payment</Label>
          <Input
            type="number"
            value={data.downPayment}
            onChange={(e) => onUpdate("downPayment", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date</Label>
          <Input
            type="date"
            value={data.paymentDate}
            onChange={(e) => onUpdate("paymentDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Method</Label>
          <Select
            value={data.paymentMethod}
            onChange={(e) => onUpdate("paymentMethod", e.target.value)}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>
          {errors.paymentMethod && (
            <p className="text-xs text-red-600">{errors.paymentMethod}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <Label className="text-sm font-medium">Financing</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FINANCING_TYPES.map((type) => (
            <label key={type.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="financingType"
                value={type.id}
                checked={data.financingType === type.id}
                onChange={(e) => onUpdate("financingType", e.target.value)}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {isFinancing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Loan</Label>
            <Input value={loan.loan} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rate</Label>
            <Input
              type="number"
              value={data.loanRate}
              onChange={(e) => onUpdate("loanRate", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Term (months)</Label>
            <Input
              type="number"
              value={data.termMonths}
              onChange={(e) => onUpdate("termMonths", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Frequency</Label>
            <Select
              value={data.frequency}
              onChange={(e) => onUpdate("frequency", e.target.value)}
            >
              {PAYMENT_FREQUENCIES.map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-medium">Institution</Label>
            <Input
              value={data.institution}
              onChange={(e) => onUpdate("institution", e.target.value)}
            />
            {errors.institution && (
              <p className="text-xs text-red-600">{errors.institution}</p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Monthly</span>
          <span>${loan.monthly.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total Interest</span>
          <span>${loan.totalInterest.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total Paid</span>
          <span>${loan.totalPaid.toLocaleString()}</span>
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
