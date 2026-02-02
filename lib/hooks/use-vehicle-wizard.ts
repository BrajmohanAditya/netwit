// Custom hook for Add Vehicle Wizard state management
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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
import { createClient } from "@/lib/supabase/client";
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
  const supabase = useMemo(() => createClient(), []);
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

        const uploadedImages: string[] = [];

        // Handle images: Upload Base64 images to Supabase Storage
        for (const image of formData.images ?? []) {
          if (image.startsWith("http")) {
            uploadedImages.push(image);
          } else if (image.startsWith("data:")) {
            try {
              // Convert Base64 to Blob
              const response = await fetch(image);
              const blob = await response.blob();

              const fileExt = image.substring(
                "data:image/".length,
                image.indexOf(";"),
              );
              const fileName = `${formData.vin}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
              const filePath = `${fileName}`;

              const { error: uploadError } = await supabase.storage
                .from("vehicles")
                .upload(filePath, blob);

              if (uploadError) {
                console.error("Error uploading image:", uploadError);
                if (uploadError.message.includes("Bucket not found")) {
                  toast.error(
                    "Storage bucket 'vehicles' not found. Please create it in Supabase Dashboard.",
                  );
                }
                // If bucket doesn't exist or other error, skip this image
                continue;
              }

              const {
                data: { publicUrl },
              } = supabase.storage.from("vehicles").getPublicUrl(filePath);

              // Detect if we are using the mock client (which returns a specific Splash ID or "mock.com" etc)
              // If so, and we have the original base64, prefer the base64 so user sees their actual image.
              // The mock client currently returns an Unsplash URL.
              // We check if it matches the mock return value pattern.
              const isMockUrl =
                publicUrl.includes("images.unsplash.com/photo-1492144534655") ||
                publicUrl.includes("placehold.co");

              if (isMockUrl) {
                // Use the base64 string directly
                uploadedImages.push(image);
              } else {
                uploadedImages.push(publicUrl);
              }
            } catch (imageError) {
              console.error("Error processing image:", imageError);
            }
          }
        }

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
    [formData, supabase],
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
