"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

interface ExpenseRow {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  vendor: string;
  vehicle: string;
  receipt: string;
}

const expenses: ExpenseRow[] = [
  {
    id: "exp-1",
    date: "Jan 20, 2026",
    title: "Detailing",
    category: "Detailing",
    amount: 450,
    vendor: "Sparkle Auto",
    vehicle: "2025 Audi Q5",
    receipt: "REC-1001",
  },
  {
    id: "exp-2",
    date: "Jan 18, 2026",
    title: "Oil Change",
    category: "Repairs",
    amount: 120,
    vendor: "Quick Lube",
    vehicle: "2026 BMW X3",
    receipt: "REC-1002",
  },
  {
    id: "exp-3",
    date: "Jan 12, 2026",
    title: "Ad Spend",
    category: "Marketing",
    amount: 980,
    vendor: "Meta Ads",
    vehicle: "-",
    receipt: "REC-1003",
  },
];

const expenseCategories = [
  "Vehicle Purchase",
  "Reconditioning",
  "Detailing",
  "Repairs",
  "Marketing",
  "Office Supplies",
  "Utilities",
  "Salaries",
  "Rent",
  "Insurance",
  "Taxes",
  "Professional Services",
  "Miscellaneous",
];

export default function ExpensesPage() {
  const [filters, setFilters] = useState({
    dateRange: "",
    category: "",
    vehicle: "",
  });
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    vendor: "",
    description: "",
    vehicle: "",
    receipt: "",
    taxDeductible: false,
  });

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Expenses</h1>
              <div className="text-sm text-muted-foreground">
                Stats: [This Month: $45K] [This Year: $520K] [Avg: $43K/mo]
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsRecordOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Record
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              value={filters.dateRange}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: event.target.value,
                }))
              }
            >
              <option value="">Date Range</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </Select>
            <Select
              value={filters.category}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
            >
              <option value="">Category</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Vehicle"
              value={filters.vehicle}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  vehicle: event.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground">
            Categories
          </div>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map((category) => (
              <li key={category} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>
                    <Badge className="bg-slate-100 text-slate-900">
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>{expense.vehicle}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-50 text-blue-700">
                      {expense.receipt}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Expense</DialogTitle>
            <DialogDescription>Add a new expense entry.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exp-title">Title</Label>
              <Input
                id="exp-title"
                value={recordForm.title}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="exp-category">Category</Label>
                <Select
                  id="exp-category"
                  value={recordForm.category}
                  onChange={(event) =>
                    setRecordForm((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exp-amount">Amount</Label>
                <Input
                  id="exp-amount"
                  placeholder="$"
                  value={recordForm.amount}
                  onChange={(event) =>
                    setRecordForm((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-date">Date</Label>
              <Input
                id="exp-date"
                type="date"
                value={recordForm.date}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-vendor">Vendor</Label>
              <Input
                id="exp-vendor"
                value={recordForm.vendor}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    vendor: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-description">Description</Label>
              <Input
                id="exp-description"
                value={recordForm.description}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-vehicle">Vehicle</Label>
              <Input
                id="exp-vehicle"
                placeholder="Search (optional)"
                value={recordForm.vehicle}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    vehicle: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-receipt">Upload Receipt</Label>
              <Input
                id="exp-receipt"
                type="file"
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    receipt: event.target.files?.[0]?.name ?? "",
                  }))
                }
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={recordForm.taxDeductible}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    taxDeductible: event.target.checked,
                  }))
                }
              />
              Tax Deductible
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsRecordOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsRecordOpen(false)}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
