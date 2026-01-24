"use client";

import { useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/stepper";
import { Step1BasicInfo } from "@/components/inventory/wizard/step-1-basic-info";
import { Step2Specifications } from "@/components/inventory/wizard/step-2-specifications";
import { Step3Pricing } from "@/components/inventory/wizard/step-3-pricing";
import { Step4ImagesDescription } from "@/components/inventory/wizard/step-4-images-description";
import { Step5Review } from "@/components/inventory/wizard/step-5-review";
import { useVehicleWizard } from "@/lib/hooks/use-vehicle-wizard";
import { getDraftSavedTime } from "@/lib/services/vehicle-form.service";
import { useState, useEffect } from "react";

const STEPS = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Specifications" },
  { number: 3, label: "Pricing" },
  { number: 4, label: "Images & Description" },
  { number: 5, label: "Review" },
];

export function AddVehicleWizard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    step,
    formData,
    errors,
    isLoading,
    updateField,
    updateMultipleFields,
    validateAndGoNext,
    goBack,
    submitForm,
    resetForm,
  } = useVehicleWizard();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Your draft will be saved.",
      )
    ) {
      router.push("/inventory");
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForm(() => {
        router.push("/inventory?status=success");
      });
    } catch (error) {
      console.error("Error submitting vehicle:", error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading">Add New Vehicle</h1>
          <p className="text-muted mt-2">
            Complete all steps to add a new vehicle to your inventory
          </p>
        </div>

        {/* Stepper */}
        <Stepper steps={STEPS} currentStep={step} onStepClick={goBack} />

        {/* Form Content */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
          {step === 1 && (
            <Step1BasicInfo
              data={formData}
              errors={errors}
              onUpdate={updateField}
              onUpdateMultiple={updateMultipleFields}
              onNext={validateAndGoNext}
              onCancel={handleCancel}
            />
          )}

          {step === 2 && (
            <Step2Specifications
              data={formData}
              errors={errors}
              onUpdate={updateField}
              onBack={goBack}
              onNext={validateAndGoNext}
            />
          )}

          {step === 3 && (
            <Step3Pricing
              data={formData}
              errors={errors}
              onUpdate={updateField}
              onBack={goBack}
              onNext={validateAndGoNext}
            />
          )}

          {step === 4 && (
            <Step4ImagesDescription
              data={formData}
              onUpdate={updateField}
              onBack={goBack}
              onNext={validateAndGoNext}
            />
          )}

          {step === 5 && (
            <Step5Review
              data={formData}
              draftSavedAt={getDraftSavedTime() || undefined}
              onBack={goBack}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-muted">
          <p>💾 Your progress is being saved automatically every 30 seconds</p>
        </div>
      </div>
    </div>
  );
}
