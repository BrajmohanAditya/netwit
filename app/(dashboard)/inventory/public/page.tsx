"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function PurchaseFromPublicPage() {
  const [sellerType, setSellerType] = useState<"individual" | "company">(
    "individual",
  );
  const [historyFilters, setHistoryFilters] = useState({
    dateFrom: "",
    dateTo: "",
    priceMin: "",
    priceMax: "",
    sellerType: "",
    staff: "",
  });
  const [selectedPurchases, setSelectedPurchases] = useState<string[]>([]);

  const purchaseHistory = [
    {
      id: "PH-001",
      date: "2026-01-20",
      vehicle: "2020 Honda Civic LX",
      vin: "2HGFC2F69LH000101",
      price: 12850,
      seller: "Jordan Miles",
      sellerType: "Individual",
      acceptedBy: "Agam",
      status: "Completed",
    },
    {
      id: "PH-002",
      date: "2026-01-18",
      vehicle: "2019 Ford Escape SE",
      vin: "1FMCU0GD7KUA11321",
      price: 15400,
      seller: "Summit Auto Group",
      sellerType: "Company",
      acceptedBy: "Ava Carter",
      status: "Pending Docs",
    },
    {
      id: "PH-003",
      date: "2026-01-12",
      vehicle: "2021 Toyota Corolla LE",
      vin: "5YFB4MDE6MP123456",
      price: 14350,
      seller: "Avery Chen",
      sellerType: "Individual",
      acceptedBy: "Noah Reed",
      status: "Inspection",
    },
    {
      id: "PH-004",
      date: "2026-01-08",
      vehicle: "2018 Jeep Wrangler Sport",
      vin: "1C4GJXAG2JW102938",
      price: 22500,
      seller: "North Ridge Motors",
      sellerType: "Company",
      acceptedBy: "Agam",
      status: "Completed",
    },
  ];

  const filteredHistory = useMemo(() => {
    return purchaseHistory.filter((item) => {
      if (historyFilters.dateFrom && item.date < historyFilters.dateFrom) {
        return false;
      }
      if (historyFilters.dateTo && item.date > historyFilters.dateTo) {
        return false;
      }
      if (
        historyFilters.priceMin &&
        item.price < Number(historyFilters.priceMin)
      ) {
        return false;
      }
      if (
        historyFilters.priceMax &&
        item.price > Number(historyFilters.priceMax)
      ) {
        return false;
      }
      if (
        historyFilters.sellerType &&
        item.sellerType !== historyFilters.sellerType
      ) {
        return false;
      }
      if (historyFilters.staff && item.acceptedBy !== historyFilters.staff) {
        return false;
      }
      return true;
    });
  }, [historyFilters, purchaseHistory]);

  const isAllSelected =
    filteredHistory.length > 0 &&
    filteredHistory.every((item) => selectedPurchases.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPurchases([]);
      return;
    }
    setSelectedPurchases(filteredHistory.map((item) => item.id));
  };

  const toggleSelection = (id: string) => {
    setSelectedPurchases((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const exportCsv = () => {
    const rows = selectedPurchases.length
      ? filteredHistory.filter((item) => selectedPurchases.includes(item.id))
      : filteredHistory;

    if (rows.length === 0) return;

    const header = [
      "Date",
      "Vehicle",
      "VIN",
      "Price",
      "Seller",
      "Seller Type",
      "Accepted By",
      "Status",
    ];
    const csvRows = rows.map((item) => [
      item.date,
      item.vehicle,
      item.vin,
      item.price.toFixed(2),
      item.seller,
      item.sellerType,
      item.acceptedBy,
      item.status,
    ]);

    const csvContent = [header, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `purchase-history-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printForms = () => {
    const rows = selectedPurchases.length
      ? filteredHistory.filter((item) => selectedPurchases.includes(item.id))
      : filteredHistory;

    if (rows.length === 0) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Purchase Forms</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
            .letterhead { border-bottom: 2px solid #1d4ed8; padding-bottom: 12px; margin-bottom: 24px; }
            .letterhead h1 { margin: 0; font-size: 22px; }
            .letterhead p { margin: 4px 0 0; color: #6b7280; }
            .form { page-break-after: always; padding-bottom: 24px; }
            .section-title { font-weight: 600; margin: 16px 0 8px; font-size: 14px; text-transform: uppercase; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 6px 0; font-size: 14px; }
            .signature { display: flex; gap: 40px; margin-top: 32px; }
            .sig-line { border-top: 1px solid #9ca3af; width: 260px; padding-top: 8px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          ${rows
            .map(
              (item) => `
            <div class="form">
              <div class="letterhead">
                <h1>Adaptus Motors</h1>
                <p>1234 Main Street, Vancouver, BC • (604) 555-0100</p>
              </div>
              <h2>Purchase from Public Form</h2>
              <div class="section-title">Vehicle</div>
              <table>
                <tr><td><strong>Vehicle</strong></td><td>${item.vehicle}</td></tr>
                <tr><td><strong>VIN</strong></td><td>${item.vin}</td></tr>
                <tr><td><strong>Purchase Date</strong></td><td>${item.date}</td></tr>
                <tr><td><strong>Purchase Price</strong></td><td>$${item.price.toLocaleString()}</td></tr>
              </table>
              <div class="section-title">Seller</div>
              <table>
                <tr><td><strong>Seller</strong></td><td>${item.seller}</td></tr>
                <tr><td><strong>Seller Type</strong></td><td>${item.sellerType}</td></tr>
                <tr><td><strong>Accepted By</strong></td><td>${item.acceptedBy}</td></tr>
                <tr><td><strong>Status</strong></td><td>${item.status}</td></tr>
              </table>
              <div class="signature">
                <div class="sig-line">Seller Signature</div>
                <div class="sig-line">Dealership Representative</div>
              </div>
            </div>
          `,
            )
            .join("")}
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/inventory" className="hover:text-blue-600">
              Inventory
            </Link>
            <span>/</span>
            <span className="text-gray-700">Purchase from Public</span>
          </div>
          <h1 className="text-3xl font-bold text-heading">
            Purchase from Public
          </h1>
          <p className="text-sm text-muted">
            Capture vehicle, seller, and documentation details for a public
            purchase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Vehicle info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr,0.6fr]">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    VIN
                  </label>
                  <Input placeholder="Enter VIN" className="mt-1" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Decode VIN
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Year
                  </label>
                  <Input placeholder="Auto-filled" className="mt-1" disabled />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Make
                  </label>
                  <Input placeholder="Auto-filled" className="mt-1" disabled />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Model
                  </label>
                  <Input placeholder="Auto-filled" className="mt-1" disabled />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Odometer
                  </label>
                  <Input placeholder="Enter mileage" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Condition
                  </label>
                  <Select className="mt-1">
                    <option value="">Select condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Work">Needs Work</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Purchase details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Purchase Date
                  </label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Purchase Price
                  </label>
                  <Input placeholder="$0.00" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Source
                  </label>
                  <Select className="mt-1">
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone">Phone</option>
                    <option value="Online">Online</option>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Notes
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    rows={4}
                    placeholder="Add purchase notes"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Seller info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="seller-type"
                    value="individual"
                    checked={sellerType === "individual"}
                    onChange={() => setSellerType("individual")}
                  />
                  Individual
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="seller-type"
                    value="company"
                    checked={sellerType === "company"}
                    onChange={() => setSellerType("company")}
                  />
                  Company
                </label>
              </div>

              {sellerType === "individual" ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      First Name
                    </label>
                    <Input placeholder="First name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Last Name
                    </label>
                    <Input placeholder="Last name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Phone
                    </label>
                    <Input placeholder="(604) 123-4567" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Email
                    </label>
                    <Input placeholder="name@example.com" className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Address
                    </label>
                    <Input placeholder="Street address" className="mt-1" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Company Name
                    </label>
                    <Input placeholder="Company name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Contact Person
                    </label>
                    <Input placeholder="Contact person" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Phone
                    </label>
                    <Input placeholder="(604) 123-4567" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Email
                    </label>
                    <Input placeholder="name@example.com" className="mt-1" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Upload Bill of Sale
                </label>
                <Input type="file" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Upload Ownership
                </label>
                <Input type="file" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Upload Insurance
                </label>
                <Input type="file" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Other Documents
                </label>
                <Input type="file" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Internal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Accepted By
                </label>
                <Select className="mt-1">
                  <option value="">Select staff</option>
                  <option value="Agam">Agam</option>
                  <option value="Ava Carter">Ava Carter</option>
                  <option value="Noah Reed">Noah Reed</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Internal Notes
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  rows={4}
                  placeholder="Add internal notes"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Next Steps
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Checkbox /> Inspection completed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Checkbox /> Reconditioning needed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Checkbox /> Photos taken
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Checkbox /> Listed in inventory
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link href="/inventory">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button variant="outline">Save Draft</Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Complete Purchase
        </Button>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Purchase History</CardTitle>
            <p className="text-sm text-muted mt-1">
              Review purchases and generate paperwork in batch.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={printForms}
            >
              Print Forms
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Date From
              </label>
              <Input
                type="date"
                className="mt-1"
                value={historyFilters.dateFrom}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    dateFrom: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Date To
              </label>
              <Input
                type="date"
                className="mt-1"
                value={historyFilters.dateTo}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    dateTo: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Price Min
              </label>
              <Input
                type="number"
                placeholder="0"
                className="mt-1"
                value={historyFilters.priceMin}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    priceMin: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Price Max
              </label>
              <Input
                type="number"
                placeholder="0"
                className="mt-1"
                value={historyFilters.priceMax}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    priceMax: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Seller Type
              </label>
              <Select
                className="mt-1"
                value={historyFilters.sellerType}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    sellerType: event.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Staff
              </label>
              <Select
                className="mt-1"
                value={historyFilters.staff}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    staff: event.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="Agam">Agam</option>
                <option value="Ava Carter">Ava Carter</option>
                <option value="Noah Reed">Noah Reed</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-gray-200">
                  <th className="py-3 pr-4">
                    <Checkbox
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all purchases"
                    />
                  </th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Vehicle</th>
                  <th className="py-3 pr-4">VIN</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Seller</th>
                  <th className="py-3 pr-4">Accepted By</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <Checkbox
                        checked={selectedPurchases.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        aria-label={`Select ${item.vehicle}`}
                      />
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{item.date}</td>
                    <td className="py-3 pr-4 font-medium text-heading">
                      {item.vehicle}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{item.vin}</td>
                    <td className="py-3 pr-4 text-gray-700">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-gray-700">{item.seller}</div>
                      <div className="text-xs text-muted">
                        {item.sellerType}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {item.acceptedBy}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredHistory.length === 0 && (
              <div className="py-10 text-center text-sm text-muted">
                No purchases match the selected filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
