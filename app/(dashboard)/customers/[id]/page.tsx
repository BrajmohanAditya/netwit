"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useModal,
} from "@/components/ui/modal";

const customers = [
  {
    id: "1",
    name: "John Smith",
    type: "Retail",
    phone: "(604) 555-0100",
    email: "john.smith@example.com",
    address: "123 Main Street, Vancouver, BC",
    license: "B1234-56789",
    creditScore: 738,
    creditStatus: "Prime",
    quickStats: { deals: 3, spent: 142000, avg: 47000, last: "45d" },
  },
  {
    id: "2",
    name: "Avery Chen",
    type: "Corporate",
    phone: "(604) 555-0133",
    email: "avery.chen@example.com",
    address: "98 Main Street, Burnaby, BC",
    license: "C9922-31331",
    creditScore: 710,
    creditStatus: "Prime",
    quickStats: { deals: 2, spent: 86000, avg: 43000, last: "22d" },
  },
];

const deals = [
  {
    id: "DL-101",
    vehicle: "2021 Ford Mustang",
    date: "2026-01-12",
    status: "Closed Won",
    amount: 52000,
    salesperson: "Ava Carter",
  },
  {
    id: "DL-102",
    vehicle: "2020 Honda Civic LX",
    date: "2025-12-03",
    status: "Closed Won",
    amount: 28000,
    salesperson: "Agam",
  },
  {
    id: "DL-103",
    vehicle: "2019 Toyota RAV4",
    date: "2025-10-18",
    status: "Closed Lost",
    amount: 32000,
    salesperson: "Noah Reed",
  },
];

const ownedVehicles = [
  { id: "OV-1", name: "2021 Ford Mustang", vin: "1FA6P8TH3M5100091" },
  { id: "OV-2", name: "2020 Honda Civic LX", vin: "2HGFC2F69LH000101" },
];

const interestedVehicles = [
  { id: "IV-1", name: "2022 Tesla Model 3", status: "Test Drive" },
  { id: "IV-2", name: "2021 Toyota Camry", status: "Lead" },
];

const communications = [
  {
    id: "COM-1",
    type: "Call",
    date: "2026-01-22",
    summary: "Discussed trade-in options and financing.",
  },
  {
    id: "COM-2",
    type: "Email",
    date: "2026-01-18",
    summary: "Sent updated quote and warranty information.",
  },
];

const documents = [
  {
    id: "DOC-1",
    name: "Driver License",
    category: "License",
    uploaded: "2026-01-10",
  },
  {
    id: "DOC-2",
    name: "Insurance Policy",
    category: "Insurance",
    uploaded: "2026-01-12",
  },
  {
    id: "DOC-3",
    name: "Purchase Contract",
    category: "Contracts",
    uploaded: "2026-01-12",
  },
];

const notes = [
  {
    id: "NT-1",
    date: "2026-01-21",
    author: "Agam",
    note: "Customer prefers weekend appointments and email follow-ups.",
  },
  {
    id: "NT-2",
    date: "2026-01-14",
    author: "Ava Carter",
    note: "Interested in premium trims and extended warranty packages.",
  },
];

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id?.toString();
  const mergeModal = useModal(false);
  const customer = useMemo(
    () => customers.find((item) => item.id === customerId) ?? customers[0],
    [customerId],
  );

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/customers" className="hover:text-blue-600">
            Customers
          </Link>
          <span>/</span>
          <span className="text-gray-700">{customer.name}</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heading">{customer.name}</h1>
            <p className="text-sm text-muted">Customer Detail</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Delete</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={mergeModal.open}
            >
              Merge Duplicates
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold">
                {customer.name
                  .split(" ")
                  .map((item) => item[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {customer.name}
                </p>
                <p className="text-sm text-muted">{customer.type}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
              <p>{customer.address}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Call
              </Button>
              <Button variant="outline" size="sm">
                Email
              </Button>
              <Button variant="outline" size="sm">
                Log Note
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Deals</p>
              <p className="text-lg font-semibold">
                {customer.quickStats.deals}
              </p>
            </div>
            <div>
              <p className="text-muted">Spent</p>
              <p className="text-lg font-semibold">
                ${customer.quickStats.spent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted">Avg</p>
              <p className="text-lg font-semibold">
                ${customer.quickStats.avg.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted">Last</p>
              <p className="text-lg font-semibold">
                {customer.quickStats.last}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="text-muted">Name:</span> {customer.name}
                </p>
                <p>
                  <span className="text-muted">Phone:</span> {customer.phone}
                </p>
                <p>
                  <span className="text-muted">Email:</span> {customer.email}
                </p>
                <p>
                  <span className="text-muted">Address:</span>{" "}
                  {customer.address}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Driver License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="text-muted">License #:</span>{" "}
                  {customer.license}
                </p>
                <p>
                  <span className="text-muted">Expiry:</span> 2028-04-30
                </p>
                <p>
                  <span className="text-muted">State:</span> British Columbia
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Credit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="text-muted">Score:</span>{" "}
                  {customer.creditScore}
                </p>
                <p>
                  <span className="text-muted">Tier:</span>{" "}
                  {customer.creditStatus}
                </p>
                <p>
                  <span className="text-muted">Last Pull:</span> 2026-01-12
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deals">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Deal Timeline
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + Create New Deal
              </Button>
            </div>
            <div className="space-y-4">
              {deals.map((deal) => (
                <Card key={deal.id} className="border border-gray-200 bg-white">
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {deal.vehicle}
                      </p>
                      <p className="text-sm text-muted">{deal.date}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <Badge
                        variant={deal.status === "Closed Won" ? "green" : "red"}
                      >
                        {deal.status}
                      </Badge>
                      <span className="text-gray-700">
                        ${deal.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-500">{deal.salesperson}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicles">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Owned Vehicles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ownedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="rounded-lg border border-gray-100 p-3"
                  >
                    <p className="font-semibold text-gray-900">
                      {vehicle.name}
                    </p>
                    <p className="text-xs text-muted">VIN: {vehicle.vin}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Interested In</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interestedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="rounded-lg border border-gray-100 p-3"
                  >
                    <p className="font-semibold text-gray-900">
                      {vehicle.name}
                    </p>
                    <p className="text-xs text-muted">{vehicle.status}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communications">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-base">Communications</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Select className="min-w-[140px]">
                  <option value="">All Types</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="In-person">In-person</option>
                </Select>
                <Button variant="outline">Log Communication</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {communications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{item.type}</p>
                    <p className="text-xs text-muted">{item.date}</p>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{item.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-base">Documents</CardTitle>
              <Button variant="outline">Upload Document</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select>
                  <option value="">Category</option>
                  <option value="License">License</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Invoices">Invoices</option>
                </Select>
                <Input type="file" />
              </div>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-2 rounded-lg border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-xs text-muted">
                        {doc.category} • Uploaded {doc.uploaded}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-base">Notes</CardTitle>
              <Button variant="outline">Add Note</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                rows={4}
                placeholder="Write a note..."
              />
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Note
                </Button>
              </div>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">
                        {note.author}
                      </p>
                      <p className="text-xs text-muted">{note.date}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{note.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal isOpen={mergeModal.isOpen} onClose={mergeModal.close}>
        <ModalHeader title="Merge Duplicate Customers" />
        <ModalBody className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Select master record
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Record A
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="text-muted">Name:</span> John Smith
                </p>
                <p>
                  <span className="text-muted">Phone:</span> (604) 555-0100
                </p>
                <p>
                  <span className="text-muted">Email:</span> john@example.com
                </p>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" name="masterRecord" defaultChecked /> Use
                this
              </label>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Record B
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="text-muted">Name:</span> Jon Smith
                </p>
                <p>
                  <span className="text-muted">Phone:</span> (604) 555-0100
                </p>
                <p>
                  <span className="text-muted">Email:</span> jsmith@example.com
                </p>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" name="masterRecord" /> Use this
              </label>
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">
              All data preserved:
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Deals from both</li>
              <li>• All communications</li>
              <li>• All documents</li>
              <li>• All notes</li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              Record B soft-deleted (30-day recovery)
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={mergeModal.close}>
            Cancel
          </Button>
          <Button variant="outline" onClick={mergeModal.close}>
            Preview
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={mergeModal.close}
          >
            Confirm Merge
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
