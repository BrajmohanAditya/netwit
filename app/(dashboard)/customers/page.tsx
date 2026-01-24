"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { CustomerForm } from "@/components/customers/customer-form";
import type { CustomerFormData } from "@/types/customers";

// Mock data - Replace with actual data from Supabase
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    phone: "555-0100",
    email: "john@example.com",
    type: "Retail",
    status: "Active",
    lastContact: "2026-01-20",
    totalDeals: { count: 4, value: 128000 },
    duplicateFlags: [],
  },
  {
    id: "2",
    name: "John Doe",
    phone: "555-0200",
    email: "jdoe@example.com",
    type: "Retail",
    status: "Active",
    lastContact: "2026-01-18",
    totalDeals: { count: 2, value: 54000 },
    duplicateFlags: ["Name"],
  },
  {
    id: "3",
    name: "Jane Smith",
    phone: "555-0100",
    email: "jane@example.com",
    type: "Wholesale",
    status: "Active",
    lastContact: "2026-01-12",
    totalDeals: { count: 7, value: 245000 },
    duplicateFlags: ["Phone"],
  },
  {
    id: "4",
    name: "Avery Chen",
    phone: "555-0430",
    email: "avery.chen@example.com",
    type: "Corporate",
    status: "Inactive",
    lastContact: "2025-12-18",
    totalDeals: { count: 1, value: 32000 },
    duplicateFlags: ["Email"],
  },
  {
    id: "5",
    name: "Summit Auto Group",
    phone: "555-0771",
    email: "purchasing@summitauto.com",
    type: "Corporate",
    status: "Active",
    lastContact: "2026-01-22",
    totalDeals: { count: 12, value: 780000 },
    duplicateFlags: ["Name", "Email"],
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState(mockCustomers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    more: "",
  });
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const handleAddCustomer = async (data: CustomerFormData) => {
    // TODO: Integrate with Supabase
    console.log("Adding customer:", data);
    // Check for duplicates by name and phone
    setIsAddDialogOpen(false);
  };

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search) ||
        customer.phone?.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search);
      if (!matchesSearch) return false;
      if (filters.type && customer.type !== filters.type) return false;
      if (filters.status && customer.status !== filters.status) return false;
      if (
        filters.more === "Has Duplicates" &&
        customer.duplicateFlags.length === 0
      )
        return false;
      return true;
    });
  }, [customers, filters, searchTerm]);

  const activeFilterChips = [filters.type, filters.status, filters.more].filter(
    Boolean,
  );

  const isAllSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every((customer) =>
      selectedCustomers.includes(customer.id),
    );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCustomers([]);
      return;
    }
    setSelectedCustomers(filteredCustomers.map((customer) => customer.id));
  };

  const toggleSelection = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearAllFilters = () => {
    setFilters({ type: "", status: "", more: "" });
    setSearchTerm("");
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Customers</h1>
          <p className="text-sm text-muted">Customer Directory</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <span className="font-medium text-gray-900">127</span>
        <span>customers</span>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_repeat(3,0.7fr)]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
              <Input
                placeholder="Search customers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={filters.type}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, type: event.target.value }))
              }
            >
              <option value="">Type</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Corporate">Corporate</option>
            </Select>
            <Select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
            <Select
              value={filters.more}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, more: event.target.value }))
              }
            >
              <option value="">More</option>
              <option value="Has Duplicates">Has Duplicates</option>
              <option value="Recently Contacted">Recently Contacted</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-semibold text-gray-700">Active:</span>
            {activeFilterChips.length === 0 ? (
              <span>No filters applied</span>
            ) : (
              activeFilterChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {chip}
                </span>
              ))
            )}
            <button
              className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base">Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all customers"
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Total Deals</TableHead>
                <TableHead>Duplicate Flags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => {
                  const initials = customer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => toggleSelection(customer.id)}
                          aria-label={`Select ${customer.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-sm font-semibold text-gray-700">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-heading">
                              {customer.name}
                            </div>
                            <div className="text-xs text-muted">
                              {customer.type}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {customer.type}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {customer.phone || "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {customer.email || "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {customer.lastContact}
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-900 font-semibold">
                          {customer.totalDeals.count} deals
                        </div>
                        <div className="text-xs text-muted">
                          ${customer.totalDeals.value.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.duplicateFlags.includes("Phone") && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                              Phone
                            </span>
                          )}
                          {customer.duplicateFlags.includes("Name") && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              Name
                            </span>
                          )}
                          {customer.duplicateFlags.includes("Email") && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Email
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/customers/${customer.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          {customer.duplicateFlags.length > 0 && (
                            <Button variant="outline" size="sm">
                              Merge
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleAddCustomer}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
