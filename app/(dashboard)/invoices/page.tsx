"use client";

import { useMemo, useState } from "react";
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

const invoiceRows: InvoiceRow[] = [
  {
    id: "inv-0011",
    invoiceNumber: "INV-0011",
    packageName: "Libra",
    customer: "Amelia Brooks",
    date: "Jan 10, 2026",
    dueDate: "Jan 30, 2026",
    amount: 157.5,
    paid: true,
    status: "Paid",
  },
  {
    id: "inv-0012",
    invoiceNumber: "INV-0012",
    packageName: "Orion",
    customer: "Caleb Owens",
    date: "Jan 12, 2026",
    dueDate: "Feb 01, 2026",
    amount: 220,
    paid: false,
    status: "Pending",
  },
  {
    id: "inv-0013",
    invoiceNumber: "INV-0013",
    packageName: "Vega",
    customer: "Harper Sloan",
    date: "Jan 05, 2026",
    dueDate: "Jan 20, 2026",
    amount: 95,
    paid: false,
    status: "Overdue",
  },
];

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-green-100 text-green-900",
  Pending: "bg-yellow-100 text-yellow-900",
  Overdue: "bg-red-100 text-red-900",
  Draft: "bg-slate-100 text-slate-900",
};

export default function InvoicesPage() {
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

  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      const amount = Number(item.amount || 0);
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);
  }, [lineItems]);

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

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

      <Card>
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
              {invoiceRows.map((invoice) => (
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
                      checked={invoice.paid}
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
                      <Button variant="ghost" size="sm">
                        Print
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print Selected
        </Button>
      </div>

      <Card>
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
            <Button variant="secondary" size="sm">
              Print
            </Button>
            <Button variant="secondary" size="sm">
              Download PDF
            </Button>
            <Button variant="primary" size="sm">
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>

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
              <Button variant="secondary">Save</Button>
              <Button variant="primary">Save &amp; Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
