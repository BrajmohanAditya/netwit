"use server";

import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validations/lead";
import { revalidatePath } from "next/cache";

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
  const supabase = createClient();

  // Extract and validate data
  const rawData = {
    full_name: String(formData.get("full_name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    company: String(formData.get("company") || ""),
    source: String(formData.get("source") || ""),
    status: String(formData.get("status") || ""),
    vehicle_interest_id:
      String(formData.get("vehicle_interest_id") || "") || undefined,
    assigned_to: String(formData.get("assigned_to") || "") || undefined,
    notes: String(formData.get("notes") || ""),
  };

  const validatedFields = leadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    full_name,
    email,
    phone,
    company,
    source,
    status,
    vehicle_interest_id,
    assigned_to,
    notes,
  } = validatedFields.data;

  try {
    // 1. Check if customer exists, or create new one
    let customerId: string | null = null;
    let customerQuery = supabase.from("customers").select("id").limit(1);

    if (email) {
      customerQuery = customerQuery.eq("email", email);
    } else if (phone) {
      customerQuery = customerQuery.eq("phone", phone);
    } else {
      // Fallback: search by name? Or just always create?
      // For now, if no email/phone, maybe check name?
      // But schema constraint says valid_contact: phone OR email IS NOT NULL.
      // Wait, schema.sql: CONSTRAINT valid_contact CHECK (phone IS NOT NULL OR email IS NOT NULL)
      // Our schema allows both optional. We should probably enforce at least one in Zod if creating new customer.
      // But for searching, if both empty, we can't find existing customer easily.
    }

    // Actually, create lead needs a customer_id.
    // We should create a customer record first.

    // Search existing
    const { data: existingCustomers } = await customerQuery;

    if (existingCustomers && existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: full_name,
          email: email || null,
          phone: phone || null,
          notes: company ? `Company: ${company}` : undefined,
        })
        .select("id")
        .single();

      if (customerError) {
        console.error("Error creating customer:", customerError);
        return { success: false, message: "Failed to create customer record." };
      }
      customerId = newCustomer.id;
    }

    if (!customerId) {
      return {
        success: false,
        message: "Could not identify or create customer.",
      };
    }

    // 2. Create Lead
    const { error: leadError } = await supabase.from("leads").insert({
      customer_id: customerId,
      source: source,
      status: status,
      interest_vehicle_id: vehicle_interest_id || null, // handle undefined vs null for uuid
      assigned_to: assigned_to || null,
      notes: notes,
    });

    if (leadError) {
      console.error("Error creating lead:", leadError);
      return { success: false, message: "Failed to create lead." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/leads");

    return {
      success: true,
      message: "Lead created successfully.",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteLead(leadId: string): Promise<ActionState> {
  const supabase = createClient();

  try {
    const { error } = await supabase.from("leads").delete().eq("id", leadId);

    if (error) {
      console.error("Error deleting lead:", error);
      return { success: false, message: "Failed to delete lead." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/leads");

    return {
      success: true,
      message: "Lead deleted successfully.",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
