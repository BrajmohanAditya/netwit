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
import { useExpenses, useExpenseStats, useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/use-expenses";
import { toast } from "react-hot-toast";

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
  const { data: expenses, isLoading } = useExpenses();
  const { data: stats } = useExpenseStats();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [filters, setFilters] = useState({
    dateRange: "",
    category: "",
    vehicle: "",
  });
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<typeof expenses extends Array<infer T> ? T : never | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    vendor: "",
    vehicle: "",
    receipt: "",
  });
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleView = (expense: typeof expenses extends Array<infer T> ? T : never) => {
    setSelectedExpense(expense);
    setIsViewOpen(true);
  };

  const handleEdit = (expense: typeof expenses extends Array<infer T> ? T : never) => {
    setSelectedExpense(expense);
    setEditForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      vendor: expense.vendor || "",
      vehicle: expense.vehicle || "",
      receipt: expense.receipt || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedExpense) return;
    const parsedAmount = Number(editForm.amount || 0);
    updateExpense.mutate({
      id: selectedExpense._id,
      title: editForm.title,
      category: editForm.category,
      amount: Number.isNaN(parsedAmount) ? 0 : parsedAmount,
      date: editForm.date || selectedExpense.date,
      vendor: editForm.vendor,
      vehicle: editForm.vehicle,
      receipt: editForm.receipt,
    });
    setIsEditOpen(false);
    toast.success("Expense updated");
  };

  const handleDelete = (expense: typeof expenses extends Array<infer T> ? T : never) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense.mutate(expense._id);
      toast.success("Expense deleted");
    }
  };

  const handleRecordExpense = () => {
    const amount = Number(recordForm.amount || 0);
    if (!recordForm.title || !recordForm.category || !amount) {
      toast.error("Please fill in required fields");
      return;
    }
    createExpense.mutate({
      title: recordForm.title,
      category: recordForm.category,
      amount,
      date: recordForm.date || new Date().toISOString().split("T")[0],
      vendor: recordForm.vendor,
      vehicle: recordForm.vehicle,
      receipt: recordForm.receipt,
      description: recordForm.description,
      taxDeductible: recordForm.taxDeductible,
    });
    setIsRecordOpen(false);
    setRecordForm({
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
    toast.success("Expense recorded");
  };

  const filteredExpenses = (expenses || []).filter((expense) => {
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.vehicle && !expense.vehicle?.toLowerCase().includes(filters.vehicle.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Expenses</h1>
              <div className="text-sm text-muted-foreground">
                Stats: [This Month: ${stats?.thisMonth?.toLocaleString() || "0"}] [This Year: ${stats?.thisYear?.toLocaleString() || "0"}] [Avg: ${stats?.averageMonthly?.toLocaleString() || "0"}/mo]
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
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading expenses...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No expenses found</div>
          ) : (
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
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">{expense.title}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-900">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{expense.vendor || "-"}</TableCell>
                    <TableCell>{expense.vehicle || "-"}</TableCell>
                    <TableCell>
                      {expense.receipt ? (
                        <Badge className="bg-blue-50 text-blue-700">
                          {expense.receipt}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(expense)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(expense)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="grid gap-3 text-sm">
              <div>
                <span className="font-semibold">Title:</span> {selectedExpense.title}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {formatDate(selectedExpense.date)}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {selectedExpense.category}
              </div>
              <div>
                <span className="font-semibold">Amount:</span> ${selectedExpense.amount.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Vendor:</span> {selectedExpense.vendor || "-"}
              </div>
              <div>
                <span className="font-semibold">Vehicle:</span> {selectedExpense.vehicle || "-"}
              </div>
              <div>
                <span className="font-semibold">Receipt:</span> {selectedExpense.receipt || "-"}
              </div>
              {selectedExpense.description && (
                <div>
                  <span className="font-semibold">Description:</span> {selectedExpense.description}
                </div>
              )}
              <div>
                <span className="font-semibold">Tax Deductible:</span> {selectedExpense.taxDeductible ? "Yes" : "No"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  id="edit-category"
                  value={editForm.category}
                  onChange={(event) =>
                    setEditForm((prev) => ({
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
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  placeholder="$"
                  type="number"
                  value={editForm.amount}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-vendor">Vendor</Label>
              <Input
                id="edit-vendor"
                value={editForm.vendor}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    vendor: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-vehicle">Vehicle</Label>
              <Input
                id="edit-vehicle"
                value={editForm.vehicle}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    vehicle: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-receipt">Receipt</Label>
              <Input
                id="edit-receipt"
                value={editForm.receipt}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    receipt: event.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
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
                  type="number"
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
              <Label htmlFor="exp-receipt">Receipt Number</Label>
              <Input
                id="exp-receipt"
                value={recordForm.receipt}
                onChange={(event) =>
                  setRecordForm((prev) => ({
                    ...prev,
                    receipt: event.target.value,
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
              <Button variant="primary" onClick={handleRecordExpense}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
