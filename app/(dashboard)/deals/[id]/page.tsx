"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";

const mockDeal = {
  id: "D-042",
  status: "In Negotiation",
  customer: {
    name: "John Smith",
    meta: "Recent deals: 2 • Credit: 720",
  },
  vehicle: {
    name: "2021 Ford Mustang",
    meta: "Stock #STK-1042 • $34,500",
  },
  timeline: [
    { label: "Created", date: "Jan 20, 2026" },
    { label: "Negotiated", date: "Jan 22, 2026" },
    { label: "DP Received", date: "Pending" },
  ],
  financialSummary: [
    { label: "Vehicle Price", value: "$34,500" },
    { label: "Discount", value: "-$1,000" },
    { label: "Trade-In", value: "-$8,500" },
    { label: "Additional Costs", value: "$1,700" },
    { label: "Tax", value: "$3,264" },
    { label: "Total", value: "$30,964" },
  ],
  financingDetails: [
    { label: "Down Payment", value: "$5,000" },
    { label: "Loan", value: "$24,904" },
    { label: "Rate", value: "5.99%" },
    { label: "Term", value: "60 months" },
    { label: "Monthly", value: "$484" },
  ],
  addOns: [
    { label: "Warranty", value: "$2,500" },
    { label: "Insurance", value: "$1,200/yr" },
    { label: "Winter Tires", value: "$1,200" },
    { label: "Remote Start", value: "$450" },
  ],
  commission: [
    { label: "Salesperson", value: "Ava Carter" },
    { label: "Base", value: "$1,000" },
    { label: "Add-on", value: "$650" },
    { label: "Total", value: "$1,650" },
  ],
  dates: [
    { label: "Deal Date", value: "Jan 20, 2026" },
    { label: "Expected Delivery", value: "Jan 28, 2026" },
  ],
};

export default function DealDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const deal = useQuery(api.deals.getByIdOrNumber, { id: params.id });
  const deleteDeal = useMutation(api.deals.deleteDeal);

  if (deal === undefined) {
    return (
      <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
        <div className="text-sm text-muted-foreground">Loading deal...</div>
      </div>
    );
  }

  if (deal === null) {
    return (
      <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
        <div className="text-sm text-muted-foreground">Deal not found.</div>
        <Link
          href="/deals"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          ← Back to Deals
        </Link>
      </div>
    );
  }

  const formatStatus = (status: string) =>
    status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const dealId = deal.dealNumber ?? deal._id.toString();
  const dealData = {
    ...mockDeal,
    id: dealId,
    status: formatStatus(deal.status),
    customer: {
      ...mockDeal.customer,
      name: deal.customer,
    },
    vehicle: {
      ...mockDeal.vehicle,
      name: deal.title,
      meta: `Value: $${deal.value.toLocaleString()}`,
    },
  };

  const handleDelete = async () => {
    if (!confirm("Delete this deal? This cannot be undone.")) return;
    await deleteDeal({ id: deal._id });
    router.push("/deals");
  };

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-heading">
                Deal #{dealId}
              </h1>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                {dealData.status}
              </Badge>
            </div>
            <p className="text-sm text-muted mt-1">Deal details and activity</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Move Stage</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        <Link
          href="/deals"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          ← Back to Deals
        </Link>
      </div>

      {/* Customer & Vehicle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xl font-semibold text-heading">
              {dealData.customer.name}
            </p>
            <p className="text-sm text-muted">{dealData.customer.meta}</p>
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xl font-semibold text-heading">
              {dealData.vehicle.name}
            </p>
            <p className="text-sm text-muted">{dealData.vehicle.meta}</p>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {dealData.timeline.map((step, index) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-medium text-heading">
                    {step.label}
                  </p>
                  <p className="text-xs text-muted">{step.date}</p>
                </div>
                {index < dealData.timeline.length - 1 && (
                  <div className="hidden sm:block h-px w-12 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="summary">
        <TabsList className="w-full flex flex-wrap justify-start">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {dealData.financialSummary.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-heading">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Financing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {dealData.financingDetails.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-heading">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Add-ons & Extras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {mockDeal.addOns.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-heading">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">
                  Salesperson & Commission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {mockDeal.commission.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-heading">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {mockDeal.dates.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-heading">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Down Payment</span>
                  <span className="font-medium">$5,000 • Jan 20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Installment #1</span>
                  <span className="font-medium">$484 • Feb 20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Installment #2</span>
                  <span className="font-medium">$484 • Mar 20</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-xs text-muted">
                Payment schedule (if financing)
              </div>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                + Record Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Contract</span>
                <Button variant="outline" size="sm">
                  Send for Signature
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Financing Docs</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Trade-in Appraisal</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Checklist</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>Jan 22 • Negotiation update sent to customer</div>
                <div>Jan 21 • Credit check completed</div>
                <div>Jan 20 • Deal created</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>Customer wants delivery before end of month.</p>
                <p>Waiting for trade-in appraisal approval.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
