"use client";

import { useMemo, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { Download, Plus, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateInvoice, useInvoices } from "@/hooks/use-invoices";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  packageName: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: boolean;
  status: InvoiceStatus;
}

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-green-100 text-green-900",
  Pending: "bg-yellow-100 text-yellow-900",
  Overdue: "bg-red-100 text-red-900",
  Draft: "bg-slate-100 text-slate-900",
};

export default function InvoicesPage() {
  const { data: invoicesData, isLoading, isError } = useInvoices();
  const createInvoice = useCreateInvoice();
  const [localDrafts, setLocalDrafts] = useState<InvoiceRow[]>([]);
  const [filters, setFilters] = useState({
    year: "2026",
    month: "All",
    status: "",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [lineItems, setLineItems] = useState([
    { id: "line-1", description: "", amount: "" },
  ]);
  const [createForm, setCreateForm] = useState({
    year: "2026",
    month: "January",
    packageName: "Libra",
    customer: "",
    dueDate: "",
    paymentTerms: "Net 30",
  });

  const tableRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const handlePrintTable = useReactToPrint({
    content: () => tableRef.current as any,
    documentTitle: "Invoices List",
  });

  const handlePrintSelectedList = useReactToPrint({
    content: () => selectedRef.current as any,
    documentTitle: "Selected Invoices",
  });

  const handlePrintDetail = useReactToPrint({
    content: () => detailRef.current as any,
    documentTitle: "Invoice #INV-001",
  });

  const handleExport = () => {
    const headers = [
      "Invoice Number",
      "Package",
      "Customer",
      "Date",
      "Due Date",
      "Amount",
      "Status",
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      filteredInvoices
        .map((row) =>
          [
            row.invoiceNumber,
            row.packageName,
            row.customer,
            row.date,
            row.dueDate,
            row.amount,
            row.status,
          ].join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoices exported successfully");
  };

  const handlePrintSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one invoice to print");
      return;
    }
    handlePrintSelectedList();
  };

  const handleDownloadPDF = () => {
    handlePrintDetail();
    toast.success("Please save as PDF in the print dialog");
  };

  const handleEmail = (message?: string | React.SyntheticEvent) => {
    if (typeof message !== "string") {
      toast.success("Invoice sent to customer email");
      return;
    }
    toast.success(message);
  };

  const formatDisplayDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const getNextInvoiceNumber = () => {
    const draftNumbers = localDrafts.map((invoice) => invoice.invoiceNumber);
    const dbNumbers = (invoicesData || []).map(
      (invoice: any) => invoice.invoice_number,
    );

    const lastNumber = [...draftNumbers, ...dbNumbers]
      .map((number) => Number((number || "").replace("INV-", "")))
      .filter((value) => !Number.isNaN(value))
      .sort((a, b) => b - a)[0];

    const nextNumber = (lastNumber || 0) + 1;
    return `INV-${nextNumber.toString().padStart(4, "0")}`;
  };

  const handleSaveInvoice = (shouldSend: boolean) => {
    if (
      !createForm.packageName &&
      lineItems.every((item) => !item.description)
    ) {
      toast.error("Add a package or at least one line item");
      return;
    }

    if (!createForm.dueDate) {
      toast.error("Select a due date");
      return;
    }

    if (total <= 0) {
      toast.error("Invoice total must be greater than $0.00");
      return;
    }

    const invoiceDate = new Date();
    const dueDate = new Date(createForm.dueDate);
    const invoiceNumber = getNextInvoiceNumber();

    const payload = {
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      due_date: dueDate,
      customer_id: null,
      package_name: createForm.packageName || "Custom",
      payment_amount: subtotal,
      tax_rate: 5,
      tax_amount: tax,
      total,
      status: "Pending" as const,
      notes: createForm.customer
        ? `Customer: ${createForm.customer}`
        : undefined,
    };

    createInvoice.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setLineItems([{ id: "line-1", description: "", amount: "" }]);
        setCreateForm({
          year: "2026",
          month: "January",
          packageName: "Libra",
          customer: "",
          dueDate: "",
          paymentTerms: "Net 30",
        });

        if (shouldSend) {
          handleEmail("Invoice saved and sent");
        } else {
          toast.success("Invoice saved");
        }
      },
      onError: (err) => {
        const fallback: InvoiceRow = {
          id: `inv-${Date.now()}`,
          invoiceNumber,
          packageName: createForm.packageName || "Custom",
          customer: createForm.customer || "Walk-in Customer",
          date: formatDisplayDate(invoiceDate),
          dueDate: formatDisplayDate(dueDate),
          amount: total,
          paid: false,
          status: "Pending",
        };
        setLocalDrafts((prev) => [fallback, ...prev]);
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Database save failed, stored locally only";
        toast.error(message);
      },
    });
  };

  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      const amount = Number(item.amount || 0);
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);
  }, [lineItems]);

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const normalizeStatus = (status?: string): InvoiceStatus => {
    if (status === "Paid" || status === "Pending" || status === "Overdue") {
      return status;
    }
    return "Draft";
  };

  const mappedInvoices = useMemo<InvoiceRow[]>(() => {
    const rows = (invoicesData || []).map((invoice: any, index: number) => {
      const invoiceDate = invoice.invoice_date
        ? new Date(invoice.invoice_date)
        : new Date();
      const dueDate = invoice.due_date
        ? new Date(invoice.due_date)
        : invoiceDate;

      return {
        id: invoice.id || invoice.invoice_number || `tmp-${index}`,
        invoiceNumber: invoice.invoice_number || "INV-0000",
        packageName: invoice.package_name || "Custom",
        customer: invoice.customer?.full_name || "Unknown",
        date: formatDisplayDate(invoiceDate),
        dueDate: formatDisplayDate(dueDate),
        amount: Number(invoice.total ?? invoice.payment_amount ?? 0),
        paid: invoice.status === "Paid",
        status: normalizeStatus(invoice.status),
      };
    });

    return [...localDrafts, ...rows];
  }, [invoicesData, localDrafts]);

  const filteredInvoices = useMemo(() => {
    return mappedInvoices.filter((invoice) => {
      const date = new Date(invoice.date);
      const yearMatches =
        filters.year === "All" ||
        date.getFullYear().toString() === filters.year;
      const monthMatches =
        filters.month === "All" ||
        date.toLocaleString("en-US", { month: "long" }) === filters.month;
      const statusMatches =
        !filters.status || invoice.status === filters.status;

      return yearMatches && monthMatches && statusMatches;
    });
  }, [mappedInvoices, filters]);

  const selectedInvoices = useMemo(() => {
    if (selectedIds.length === 0) return [];
    return filteredInvoices.filter((invoice) =>
      selectedIds.includes(invoice.id),
    );
  }, [filteredInvoices, selectedIds]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Invoices</h1>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              value={filters.year}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, year: event.target.value }))
              }
            >
              <option value="2026">Year: 2026</option>
              <option value="2025">Year: 2025</option>
              <option value="2024">Year: 2024</option>
            </Select>
            <Select
              value={filters.month}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, month: event.target.value }))
              }
            >
              <option value="All">Month: All</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
            </Select>
            <Select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              <option value="">Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card ref={tableRef}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Package/Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{invoice.packageName}</div>
                    <div className="text-xs text-muted-foreground">
                      {invoice.customer}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(invoice.id)}
                      onChange={() => toggleSelected(invoice.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge className={statusStyles[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrintDetail}
                      >
                        Print
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="px-6 py-4 text-sm text-muted-foreground">
              Loading invoices...
            </div>
          )}
          {isError && (
            <div className="px-6 py-4 text-sm text-destructive">
              Unable to load invoices from the database.
            </div>
          )}
          {!isLoading && !isError && filteredInvoices.length === 0 && (
            <div className="px-6 py-4 text-sm text-muted-foreground">
              No invoices found.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" size="sm" onClick={handlePrintSelected}>
          <Printer className="mr-2 h-4 w-4" />
          Print Selected
        </Button>
      </div>

      <Card ref={detailRef}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[160px_1fr]">
            <div className="h-16 w-32 rounded border border-dashed bg-slate-50 flex items-center justify-center text-xs text-muted-foreground">
              Logo
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold">INVOICE #INV-001</div>
              <div className="grid gap-1 text-sm text-muted-foreground">
                <div>Invoice Date: Jan 1</div>
                <div>Due Date: Jan 15</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm">
              <div className="font-semibold">Bill To:</div>
              <div className="text-muted-foreground">Customer Name</div>
              <div className="text-muted-foreground">Address</div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="font-semibold">Items:</div>
              <div className="text-muted-foreground">Libra Package $150.00</div>
            </div>
          </div>

          <div className="grid gap-1 text-sm text-muted-foreground">
            <div>Subtotal: $150.00</div>
            <div>Tax (5%): $7.50</div>
            <div className="font-semibold text-foreground">Total: $157.50</div>
          </div>

          <div className="text-sm">
            <span className="font-semibold">Payment Status:</span> Paid
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrintDetail}>
              Print
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleEmail()}>
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="absolute -left-[9999px] top-0">
        <Card ref={selectedRef}>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Package/Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedInvoices.map((invoice) => (
                  <TableRow key={`selected-${invoice.id}`}>
                    <TableCell className="font-mono font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{invoice.packageName}</div>
                      <div className="text-xs text-muted-foreground">
                        {invoice.customer}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[invoice.status]}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Invoice #: INV-0011 (auto)</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Year</Label>
                <Select
                  value={createForm.year}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      year: event.target.value,
                    }))
                  }
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Month</Label>
                <Select
                  value={createForm.month}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      month: event.target.value,
                    }))
                  }
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Package</Label>
              <Select
                value={createForm.packageName}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    packageName: event.target.value,
                  }))
                }
              >
                <option value="Libra">Libra</option>
                <option value="Orion">Orion</option>
                <option value="Vega">Vega</option>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Or Custom Items</Label>
              {lineItems.map((item) => (
                <div key={item.id} className="grid gap-2 sm:grid-cols-5">
                  <Input
                    className="sm:col-span-3"
                    placeholder="Description"
                    value={item.description}
                    onChange={(event) =>
                      setLineItems((prev) =>
                        prev.map((line) =>
                          line.id === item.id
                            ? { ...line, description: event.target.value }
                            : line,
                        ),
                      )
                    }
                  />
                  <Input
                    className="sm:col-span-2"
                    placeholder="$"
                    value={item.amount}
                    onChange={(event) =>
                      setLineItems((prev) =>
                        prev.map((line) =>
                          line.id === item.id
                            ? { ...line, amount: event.target.value }
                            : line,
                        ),
                      )
                    }
                  />
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setLineItems((prev) => [
                    ...prev,
                    {
                      id: `line-${prev.length + 1}`,
                      description: "",
                      amount: "",
                    },
                  ])
                }
              >
                + Add Line
              </Button>
            </div>

            <div className="grid gap-2">
              <Label>Customer (optional)</Label>
              <Input
                placeholder="Search"
                value={createForm.customer}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    customer: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={createForm.dueDate}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Payment Terms</Label>
                <Select
                  value={createForm.paymentTerms}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      paymentTerms: event.target.value,
                    }))
                  }
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-1">
              <div>Subtotal: ${subtotal.toFixed(2)}</div>
              <div>Tax (5%): ${tax.toFixed(2)}</div>
              <div className="font-semibold">Total: ${total.toFixed(2)}</div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSaveInvoice(false)}
              >
                Save
              </Button>
              <Button variant="primary" onClick={() => handleSaveInvoice(true)}>
                Save &amp; Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
