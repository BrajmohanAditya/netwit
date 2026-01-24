// Custom hook for Add Vehicle Wizard state management
"use client";

import { useState, useCallback, useEffect } from "react";
import {
  VehicleFormData,
  createEmptyFormData,
  saveDraftToStorage,
  loadDraftFromStorage,
  validateStep1,
  validateStep2,
  validateStep3,
  ValidationErrors,
} from "@/lib/services/vehicle-form.service";
import { generateStockNumber } from "@/lib/services/vin-decoder.service";

export function useVehicleWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>(() =>
    createEmptyFormData(generateStockNumber()),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage only on client-side mount
  useEffect(() => {
    const draft = loadDraftFromStorage();
    if (draft) {
      setFormData(draft);
    }
    setMounted(true);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      saveDraftToStorage(formData);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, mounted]);

  const updateField = useCallback(
    (field: keyof VehicleFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const updateMultipleFields = useCallback(
    (updates: Partial<VehicleFormData>) => {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [],
  );

  const validateAndGoNext = useCallback(() => {
    let stepErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        stepErrors = validateStep1(formData);
        break;
      case 2:
        stepErrors = validateStep2(formData);
        break;
      case 3:
        stepErrors = validateStep3(formData);
        break;
      default:
        break;
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, 5));
    saveDraftToStorage(formData);
    return true;
  }, [step, formData]);

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const goToStep = useCallback((targetStep: number) => {
    setStep(targetStep);
    setErrors({});
  }, []);

  const submitForm = useCallback(
    async (onSuccess?: (data: VehicleFormData) => void) => {
      setIsLoading(true);
      try {
        // Here you would typically send the data to your backend
        console.log("Submitting vehicle form:", formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear draft on success
        loadDraftFromStorage(); // Just clear it
        localStorage.removeItem("vehicle_form_draft");
        localStorage.removeItem("vehicle_form_draft_timestamp");

        onSuccess?.(formData);
      } catch (error) {
        console.error("Failed to submit form:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [formData],
  );

  const resetForm = useCallback(() => {
    setFormData(createEmptyFormData(generateStockNumber()));
    setStep(1);
    setErrors({});
    localStorage.removeItem("vehicle_form_draft");
    localStorage.removeItem("vehicle_form_draft_timestamp");
  }, []);

  return {
    step,
    formData,
    errors,
    isLoading,
    showUnsavedWarning,
    updateField,
    updateMultipleFields,
    validateAndGoNext,
    goBack,
    goToStep,
    submitForm,
    resetForm,
    setShowUnsavedWarning,
  };
}
