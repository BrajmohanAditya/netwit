"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Printer, Eye, Send } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
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
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Declined" | "Expired";

interface QuoteRow {
  id: string;
  quoteNumber: string;
  customer: string;
  vehicle: string;
  date: string;
  expiryDate: string;
  amount: number;
  status: QuoteStatus;
}

const getBadgeVariant = (status: QuoteStatus) => {
  switch (status) {
    case "Draft":
      return "outline";
    case "Sent":
      return "secondary";
    case "Accepted":
      return "default";
    case "Declined":
      return "destructive";
    case "Expired":
      return "secondary";
    default:
      return "secondary";
  }
};

export default function QuotationsPage() {
  const [filters, setFilters] = useState({
    status: "All",
    search: "",
  });
  const [selectedIds, setSelectedIds] = useState<Id<"quotations">[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const quotesQuery = useQuery(api.quotations.get);
  const createQuote = useMutation(api.quotations.create);
  const quotes = useMemo(() => quotesQuery ?? [], [quotesQuery]);
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    vehicle: "",
    expiryDate: "",
    amount: "",
    notes: "",
  });

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const status = (q.status as QuoteStatus) ?? "Draft";
      const matchStatus = filters.status === "All" || status === filters.status;
      const matchSearch =
        q.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.quoteNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.vehicle.toLowerCase().includes(filters.search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [quotes, filters]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredQuotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuotes.map((q) => q._id));
    }
  };

  const toggleSelect = (id: Id<"quotations">) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const exportQuotes = () => {
    const rows = selectedIds.length
      ? filteredQuotes.filter((q) => selectedIds.includes(q._id))
      : filteredQuotes;

    if (rows.length === 0) {
      alert("No quotations to export.");
      return;
    }

    const header = [
      "Quote #",
      "Customer",
      "Vehicle",
      "Date",
      "Expiry Date",
      "Amount",
      "Status",
    ];
    const csvRows = rows.map((q) => [
      q.quoteNumber,
      q.customer,
      q.vehicle,
      q.date,
      q.expiryDate,
      q.amount.toFixed(2),
      q.status,
    ]);

    const csvContent = [header, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quotations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${rows.length} quotations.`);
  };

  const handleCreateQuote = async () => {
    if (!formData.customer || !formData.vehicle || !formData.amount) {
      alert("Customer, Vehicle, and Amount are required.");
      return;
    }

    const quoteNumber = `QT-${Date.now().toString().slice(-6)}`;

    await createQuote({
      quoteNumber,
      customer: formData.customer,
      vehicle: formData.vehicle,
      amount: Number(formData.amount),
      expiryDate: formData.expiryDate,
      date: new Date().toISOString().split("T")[0],
      status: "Draft",
      notes: formData.notes,
    });

    alert("Quote created successfully!");
    setIsCreateOpen(false);
    setFormData({
      customer: "",
      customerEmail: "",
      vehicle: "",
      expiryDate: "",
      amount: "",
      notes: "",
    });
  };

  return (
    <div className="flex-1 space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Quotations</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={exportQuotes}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Label className="sm:w-auto min-w-16">Search</Label>
              <Input
                placeholder="Customer, Quote #..."
                className="w-full sm:w-64"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Label className="sm:w-auto min-w-16">Status</Label>
              <Select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Expired">Expired</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredQuotes.length > 0 &&
                        selectedIds.length === filteredQuotes.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[100px]">Quote #</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[200px]">
                    Vehicle/Service
                  </TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[120px]">Expiry</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(quote._id)}
                        onChange={() => toggleSelect(quote._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {quote.quoteNumber}
                    </TableCell>
                    <TableCell>{quote.customer}</TableCell>
                    <TableCell>{quote.vehicle}</TableCell>
                    <TableCell>{quote.date}</TableCell>
                    <TableCell>{quote.expiryDate}</TableCell>
                    <TableCell>${quote.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getBadgeVariant(
                          (quote.status as QuoteStatus) ?? "Draft",
                        )}
                      >
                        {(quote.status as QuoteStatus) ?? "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Send Email">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Print">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQuotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No quotations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="mx-auto w-[92vw] max-w-[92vw] sm:w-[640px] sm:max-w-[640px] md:w-[720px] md:max-w-[720px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>Create New Quotation</DialogTitle>
            <DialogDescription>
              Create a new sales quote for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  placeholder="Enter customer name"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customer: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerEmail: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vehicle / Subject</Label>
              <Input
                placeholder="e.g. 2024 Toyota Camry"
                value={formData.vehicle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vehicle: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuote}>Create Draft</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
