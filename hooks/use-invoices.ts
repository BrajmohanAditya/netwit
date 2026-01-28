import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { InvoiceFormData } from "@/lib/validations/invoice";

function getSupabase() {
  return createClient();
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          customer:leads(id, full_name, phone, email)
        `,
        )
        .order("invoice_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      invoice: Omit<InvoiceFormData, "customer_id"> & {
        customer_id?: string | null;
        line_items?: any[];
      },
    ) => {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...invoice,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.error || "Failed to create invoice";
        throw new Error(errorMessage);
      }

      return result.data;
    },
    onMutate: async (newInvoice) => {
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      const previousInvoices = queryClient.getQueryData(["invoices"]) || [];
      queryClient.setQueryData(["invoices"], (old: any) => {
        const safeOld = Array.isArray(old) ? old : [];
        return [newInvoice, ...safeOld];
      });

      return { previousInvoices };
    },
    onError: (err, newInvoice, context) => {
      queryClient.setQueryData(["invoices"], context?.previousInvoices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useMarkInvoicePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      createFinancialTransaction,
    }: {
      invoiceId: string;
      createFinancialTransaction: boolean;
    }) => {
      const supabase = getSupabase();
      // Update invoice status
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "Paid" })
        .eq("id", invoiceId)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create financial transaction if requested
      if (createFinancialTransaction && invoice) {
        const { error: transactionError } = await supabase
          .from("financial_transactions")
          .insert({
            transaction_type: "Income",
            category: "Invoice Payment",
            amount: invoice.total,
            description: `Invoice ${invoice.invoice_number} payment`,
            invoice_id: invoiceId,
            transaction_date: new Date().toISOString().split("T")[0],
          });

        if (transactionError) throw transactionError;
      }

      return invoice;
    },
    onMutate: async ({ invoiceId }) => {
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      const previousInvoices = queryClient.getQueryData(["invoices"]);
      queryClient.setQueryData(["invoices"], (old: any) =>
        old.map((inv: any) =>
          inv.id === invoiceId ? { ...inv, status: "Paid" } : inv,
        ),
      );

      return { previousInvoices };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["invoices"], context?.previousInvoices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
    },
  });
}
