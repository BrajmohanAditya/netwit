"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DealFormData,
  createEmptyDealFormData,
  saveDealDraft,
  loadDealDraft,
  clearDealDraft,
  validateStep1,
  validateStep2,
  validateStep3,
  DealValidationErrors,
} from "@/lib/services/deal-form.service";

export function useDealWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DealFormData>(() =>
    createEmptyDealFormData(),
  );
  const [errors, setErrors] = useState<DealValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const draft = loadDealDraft();
    if (draft) setFormData(draft);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => saveDealDraft(formData), 30000);
    return () => clearInterval(interval);
  }, [formData, mounted]);

  const updateField = useCallback(
    <K extends keyof DealFormData>(key: K, value: DealFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key as string];
          return next;
        });
      }
    },
    [errors],
  );

  const updateMultiple = useCallback((updates: Partial<DealFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const validateAndNext = useCallback(() => {
    let stepErrors: DealValidationErrors = {};
    if (step === 1) stepErrors = validateStep1(formData);
    if (step === 2) stepErrors = validateStep2(formData);
    if (step === 3) stepErrors = validateStep3(formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, 5));
    saveDealDraft(formData);
    return true;
  }, [step, formData]);

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const goToStep = useCallback((target: number) => {
    setStep(target);
    setErrors({});
  }, []);

  const submit = useCallback(
    async (onSuccess?: (data: DealFormData) => void) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        clearDealDraft();
        onSuccess?.(formData);
      } finally {
        setIsLoading(false);
      }
    },
    [formData],
  );

  return {
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
  };
}
