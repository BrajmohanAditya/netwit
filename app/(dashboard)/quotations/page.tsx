"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Printer, Eye, Send } from "lucide-react";
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

const quoteRows: QuoteRow[] = [
  {
    id: "q-1001",
    quoteNumber: "Q-1001",
    customer: "John Smith",
    vehicle: "2024 Toyota Camry",
    date: "Jan 15, 2026",
    expiryDate: "Feb 15, 2026",
    amount: 32500,
    status: "Sent",
  },
  {
    id: "q-1002",
    quoteNumber: "Q-1002",
    customer: "Sarah Johnson",
    vehicle: "2023 Honda CR-V",
    date: "Jan 20, 2026",
    expiryDate: "Feb 20, 2026",
    amount: 28900,
    status: "Draft",
  },
  {
    id: "q-1003",
    quoteNumber: "Q-1003",
    customer: "Michael Brown",
    vehicle: "2025 Ford F-150",
    date: "Jan 10, 2026",
    expiryDate: "Jan 25, 2026",
    amount: 55000,
    status: "Accepted",
  },
];

const getBadgeVariant = (status: QuoteStatus) => {
  switch (status) {
    case "Draft":
      return "gray";
    case "Sent":
      return "blue";
    case "Accepted":
      return "green";
    case "Declined":
      return "red";
    case "Expired":
      return "yellow";
    default:
      return "gray";
  }
};

export default function QuotationsPage() {
  const [filters, setFilters] = useState({
    status: "All",
    search: "",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRow[]>(quoteRows);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchStatus =
        filters.status === "All" || q.status === filters.status;
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
      setSelectedIds(filteredQuotes.map((q) => q.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="flex-1 space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Quotations</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
              <Label className="sm:w-auto">Search</Label>
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
              <Label className="sm:w-auto">Status</Label>
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
                  <TableHead>Quote #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle/Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(quote.id)}
                        onChange={() => toggleSelect(quote.id)}
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
                      <Badge variant={getBadgeVariant(quote.status)}>
                        {quote.status}
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
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Quotation</DialogTitle>
            <DialogDescription>
              Create a new sales quote for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="customer@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vehicle / Subject</Label>
              <Input placeholder="e.g. 2024 Toyota Camry" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input placeholder="Additional notes..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>Create Draft</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
