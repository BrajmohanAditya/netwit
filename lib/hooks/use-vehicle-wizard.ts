// Custom hook for Add Vehicle Wizard state management
"use client";

import { useState, useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  VehicleFormData,
  createEmptyFormData,
  saveDraftToStorage,
  loadDraftFromStorage,
  clearDraftFromStorage,
  validateStep1,
  validateStep2,
  validateStep3,
  ValidationErrors,
} from "@/lib/services/vehicle-form.service";
import { generateStockNumber } from "@/lib/services/vin-decoder.service";
import toast from "react-hot-toast";

export function useVehicleWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>(() =>
    createEmptyFormData(generateStockNumber()),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const createVehicle = useMutation(api.vehicles.create);

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
        const conditionMap: Record<
          VehicleFormData["condition"],
          "New" | "Used" | "Certified Pre-Owned"
        > = {
          new: "New",
          used: "Used",
          cpo: "Certified Pre-Owned",
        };

        const uploadedImages: string[] = (formData.images ?? []).filter(
          (image) => typeof image === "string" && image.length > 0,
        );

        await createVehicle({
          stockNo: formData.stockNumber || generateStockNumber(),
          vin: formData.vin,
          year: formData.year ?? new Date().getFullYear(),
          make: formData.make,
          model: formData.model,
          trim: formData.trim || undefined,
          status: "Available",
          price: formData.retailPrice ?? 0,
          cost: formData.purchasePrice ?? undefined,
          mileage: formData.odometer ?? 0,
          color: formData.exteriorColor || "Unknown",
          images: uploadedImages,
          features: [],
          description: formData.description || undefined,
        });

        clearDraftFromStorage();
        toast.success("Vehicle added successfully.");
        onSuccess?.(formData);
      } catch (error) {
        console.error("Failed to submit form:", error);
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          (error as { code?: string }).code === "23505"
        ) {
          toast.error("A vehicle with this VIN already exists.");
        } else {
          toast.error("Failed to add vehicle. Please try again.");
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [createVehicle, formData],
  );

  const resetForm = useCallback(() => {
    setFormData(createEmptyFormData(generateStockNumber()));
    setStep(1);
    setErrors({});
    clearDraftFromStorage();
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
