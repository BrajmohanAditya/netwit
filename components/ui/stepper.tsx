"use client";

import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <button
              onClick={() => onStepClick?.(step.number)}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step.number === currentStep
                  ? "bg-blue-600 text-white shadow-lg"
                  : step.number < currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </button>

            {/* Step Label - Hidden on small screens */}
            <div className="hidden sm:block ml-2">
              <p
                className={`text-xs sm:text-sm font-medium ${
                  step.number === currentStep
                    ? "text-blue-600"
                    : step.number < currentStep
                      ? "text-green-600"
                      : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-1 sm:mx-3 bg-gray-200">
                <div
                  className={`h-full transition-all ${
                    step.number < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
                  style={{
                    width: step.number < currentStep ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Label */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-medium text-blue-600">
          Step {currentStep}:{" "}
          {steps.find((s) => s.number === currentStep)?.label}
        </p>
      </div>
    </div>
  );
}
