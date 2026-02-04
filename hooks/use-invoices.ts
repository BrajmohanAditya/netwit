import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { InvoiceFormData } from "@/lib/validations/invoice";

type CreateInvoiceInput = Omit<InvoiceFormData, "customer_id"> & {
  customer_id?: string | null;
  customer_name?: string;
  line_items?: { description: string; amount: number }[];
};

export function useInvoices() {
  const data = useQuery(api.invoices.list);
  return {
    data: data ?? [],
    isLoading: data === undefined,
    isError: false,
  };
}

export function useCreateInvoice() {
  const createInvoice = useMutation(api.invoices.create);

  return {
    mutate: (
      invoice: CreateInvoiceInput,
      options?: {
        onSuccess?: (data: unknown) => void;
        onError?: (error: unknown) => void;
      },
    ) => {
      const invoiceDate =
        invoice.invoice_date instanceof Date
          ? invoice.invoice_date.toISOString()
          : new Date(invoice.invoice_date).toISOString();
      const dueDate =
        invoice.due_date instanceof Date
          ? invoice.due_date.toISOString()
          : new Date(invoice.due_date).toISOString();

      createInvoice({
        ...invoice,
        customer_id: invoice.customer_id ?? undefined,
        invoice_date: invoiceDate,
        due_date: dueDate,
        line_items: invoice.line_items?.map((item) => ({
          description: item.description,
          amount: Number(item.amount) || 0,
        })),
      })
        .then((result) => options?.onSuccess?.(result))
        .catch((error) => options?.onError?.(error));
    },
  };
}

export function useMarkInvoicePaid() {
  const markPaid = useMutation(api.invoices.markPaid);

  return {
    mutate: (
      {
        invoiceId,
      }: {
        invoiceId: string;
        createFinancialTransaction: boolean;
      },
      options?: {
        onSuccess?: () => void;
        onError?: (error: unknown) => void;
      },
    ) => {
      markPaid({ id: invoiceId as Id<"invoices"> })
        .then(() => options?.onSuccess?.())
        .catch((error) => options?.onError?.(error));
    },
  };
}
