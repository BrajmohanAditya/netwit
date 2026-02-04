"use server";

import { leadSchema } from "@/lib/validations/lead";

export type ActionState = {
  success?: boolean;
  message?: string | null;
  errors?: {
    [K in keyof typeof leadSchema.shape]?: string[];
  };
};

export async function createLead(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return {
    success: false,
    message: 'Lead creation requires Convex integration',
  };
}

export async function deleteLead(leadId: string): Promise<ActionState> {
  return {
    success: false,
    message: 'Lead deletion requires Convex integration',
  };
}
