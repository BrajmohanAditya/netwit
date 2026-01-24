"use client";

import { Button } from "@/components/ui/button";
import {
  DealFormData,
  calculateLoan,
  calculateTotals,
  getDealDraftTime,
} from "@/lib/services/deal-form.service";

interface Step5ReviewProps {
  data: DealFormData;
  onBack: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function Step5Review({
  data,
  onBack,
  onSaveDraft,
  onSubmit,
  isLoading = false,
}: Step5ReviewProps) {
  const totals = calculateTotals(data);
  const loan = calculateLoan(data);
  const lastSaved = getDealDraftTime();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-4 bg-green-50 text-sm text-green-700">
        Draft saved {lastSaved ? `at ${lastSaved}` : ""}
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-heading">Deal Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted">Deal #</p>
            <p className="font-medium text-heading">{data.dealNumber}</p>
          </div>
          <div>
            <p className="text-muted">Customer</p>
            <p className="font-medium text-heading">{data.customer}</p>
          </div>
          <div>
            <p className="text-muted">Vehicle</p>
            <p className="font-medium text-heading">{data.vehicle}</p>
          </div>
          <div>
            <p className="text-muted">Salesperson</p>
            <p className="font-medium text-heading">{data.salesperson}</p>
          </div>
          <div>
            <p className="text-muted">Deal Date</p>
            <p className="font-medium text-heading">{data.dealDate}</p>
          </div>
          <div>
            <p className="text-muted">Expected Delivery</p>
            <p className="font-medium text-heading">
              {data.expectedDelivery || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Financial Breakdown
        </h4>
        <div className="text-sm space-y-1">
          <div className="flex items-center justify-between">
            <span>Vehicle Price</span>
            <span>${data.vehiclePrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>-${data.discount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Trade-In</span>
            <span>
              -${data.tradeInEnabled ? data.tradeInValue.toLocaleString() : 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Additional Costs</span>
            <span>${totals.additional.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>${totals.tax.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between font-semibold border-t border-gray-200 pt-2">
            <span>Total</span>
            <span>${totals.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Payment Details
        </h4>
        <div className="text-sm space-y-1">
          <div className="flex items-center justify-between">
            <span>Down Payment</span>
            <span>${data.downPayment.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Financing</span>
            <span>{data.financingType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Monthly</span>
            <span>${loan.monthly.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Interest</span>
            <span>${loan.totalInterest.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h4 className="text-base font-semibold text-heading">Add-ons</h4>
        <div className="text-sm space-y-1">
          {data.warrantyEnabled && (
            <div className="flex items-center justify-between">
              <span>Warranty</span>
              <span>${data.warrantyCost.toLocaleString()}</span>
            </div>
          )}
          {data.insuranceEnabled && (
            <div className="flex items-center justify-between">
              <span>Insurance</span>
              <span>${data.insurancePremium.toLocaleString()}</span>
            </div>
          )}
          {data.accessories
            .filter((item) => item.selected)
            .map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span>${item.cost.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Commission</span>
          <span>
            $
            {(
              data.salesBaseCommission + data.salesAddonCommission
            ).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Paid</span>
          <span>{data.commissionPaid ? "Yes" : "No"}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="outline" className="flex-1" onClick={onSaveDraft}>
          Save Draft
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create →"}
        </Button>
      </div>
    </div>
  );
}
