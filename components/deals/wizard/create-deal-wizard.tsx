"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Stepper } from "@/components/ui/stepper";
import { Step1BasicInfo } from "@/components/deals/wizard/step-1-basic-info";
import { Step2Pricing } from "@/components/deals/wizard/step-2-pricing";
import { Step3Payment } from "@/components/deals/wizard/step-3-payment";
import { Step4Addons } from "@/components/deals/wizard/step-4-addons";
import { Step5Review } from "@/components/deals/wizard/step-5-review";
import { useDealWizard } from "@/lib/hooks/use-deal-wizard";
import { saveDealDraft } from "@/lib/services/deal-form.service";
import { api } from "@/convex/_generated/api";

const STEPS = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Pricing" },
  { number: 3, label: "Payment" },
  { number: 4, label: "Add-ons" },
  { number: 5, label: "Review" },
];

export function CreateDealWizard() {
  const router = useRouter();
  const createDeal = useMutation(api.deals.create);
  const {
    step,
    formData,
    errors,
    isLoading,
    updateField,
    updateMultiple,
    validateAndNext,
    goBack,
    goToStep,
    submit,
  } = useDealWizard();

  const handleCancel = () => {
    if (window.confirm("Cancel deal creation? Your draft will be saved.")) {
      saveDealDraft(formData);
      router.push("/deals");
    }
  };

  const handleSaveDraft = () => {
    saveDealDraft(formData);
  };

  const handleSubmit = async () => {
    await submit(async (data) => {
      await createDeal({
        title: data.vehicle || "New Deal",
        value: data.vehiclePrice || 0,
        customer: data.customer || "Unknown Customer",
        status: "new",
        dealNumber: data.dealNumber,
        vehicleId: data.vehicleMeta,
        customerId: data.customerMeta,
        notes: data.discountReason,
      });
      router.push("/deals?status=created");
    });
  };

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} currentStep={step} onStepClick={goToStep} />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        {step === 1 && (
          <Step1BasicInfo
            data={formData}
            errors={errors}
            onUpdate={updateField}
            onNext={validateAndNext}
            onCancel={handleCancel}
          />
        )}
        {step === 2 && (
          <Step2Pricing
            data={formData}
            errors={errors}
            onUpdate={updateField}
            onUpdateMultiple={updateMultiple}
            onBack={goBack}
            onNext={validateAndNext}
          />
        )}
        {step === 3 && (
          <Step3Payment
            data={formData}
            errors={errors}
            onUpdate={updateField}
            onBack={goBack}
            onNext={validateAndNext}
          />
        )}
        {step === 4 && (
          <Step4Addons
            data={formData}
            onUpdate={updateField}
            onUpdateMultiple={updateMultiple}
            onBack={goBack}
            onNext={validateAndNext}
          />
        )}
        {step === 5 && (
          <Step5Review
            data={formData}
            onBack={goBack}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
