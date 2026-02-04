import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { InvoiceFormData } from "@/lib/validations/invoice";

type CreateInvoiceInput = Omit<InvoiceFormData, "customer_id"> & {
  customer_id?: Id<"customers"> | null;
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
  const [isPending, setIsPending] = useState(false);

  const mutate = (
    invoice: CreateInvoiceInput,
    options?: {
      onSuccess?: (data: unknown) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    setIsPending(true);
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
      invoice_date: invoiceDate,
      due_date: dueDate,
      line_items: invoice.line_items?.map((item) => ({
        description: item.description,
        amount: Number(item.amount) || 0,
      })),
    })
      .then((result) => {
        setIsPending(false);
        options?.onSuccess?.(result);
      })
      .catch((error) => {
        setIsPending(false);
        options?.onError?.(error);
      });
  };

  return { mutate, isPending };
}

export function useMarkInvoicePaid() {
  const markPaid = useMutation(api.invoices.markPaid);

  const mutate = (
    invoiceId: string,
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    markPaid({ id: invoiceId as Id<"invoices"> })
      .then(() => options?.onSuccess?.())
      .catch((error) => options?.onError?.(error));
  };

  return { mutate };
}
