"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";

const reportTypes = [
  "Sales Summary",
  "Inventory Aging",
  "Financial Summary",
  "Salesperson Performance",
  "Customer Analytics",
  "Custom Report",
];

export default function ReportsPage() {
  const convex = useConvex();
  const [reportType, setReportType] = useState("Sales Summary");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
    preset: "This Month",
  });
  const [filters, setFilters] = useState({
    salesperson: "",
    vehicleMake: "",
    status: "",
  });
  const [showOutput, setShowOutput] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const { data: salesData, isLoading: loadingSales } = useQuery({
    queryKey: ["salesSummary", dateRange.from, dateRange.to],
    queryFn: async () => {
      return await convex.query(api.reports.getSalesSummary, {
        startDate: dateRange.from || undefined,
        endDate: dateRange.to || undefined,
      });
    },
  });

  const { data: inventoryData, isLoading: loadingInventory } = useQuery({
    queryKey: ["inventoryAging"],
    queryFn: async () => {
      return await convex.query(api.reports.getInventoryAging);
    },
  });

  const { data: financialData, isLoading: loadingFinancial } = useQuery({
    queryKey: ["financialSummary", dateRange.from, dateRange.to],
    queryFn: async () => {
      return await convex.query(api.reports.getFinancialSummary, {
        startDate: dateRange.from || undefined,
        endDate: dateRange.to || undefined,
      });
    },
  });

  const { data: salespersonData, isLoading: loadingSalesperson } = useQuery({
    queryKey: ["salespersonPerformance"],
    queryFn: async () => {
      return await convex.query(api.reports.getSalespersonPerformance);
    },
  });

  const { data: customerData, isLoading: loadingCustomer } = useQuery({
    queryKey: ["customerAnalytics"],
    queryFn: async () => {
      return await convex.query(api.reports.getCustomerAnalytics);
    },
  });

  const handlePrint = useReactToPrint({
    contentRef: outputRef,
    documentTitle: `${reportType} Report`,
  });

  const handlePrintReport = () => {
    if (!outputRef.current) {
      setShowOutput(true);
      setTimeout(() => {
        handlePrint();
      }, 0);
      return;
    }
    handlePrint();
  };

  const handleExportExcel = () => {
    const rows: string[][] = [
      ["Report Type", reportType],
      ["Date Range", dateRange.preset || "Custom"],
      ["From", dateRange.from || ""],
      ["To", dateRange.to || ""],
      ["Salesperson", filters.salesperson || "All"],
      ["Vehicle Make", filters.vehicleMake || "All"],
      ["Status", filters.status || "All"],
      [],
      ["Metric", "Value"],
    ];

    if (salesData) {
      rows.push(
        ["Total Deals", salesData.totalDeals.toString()],
        ["Total Revenue", `$${salesData.totalRevenue.toLocaleString()}`],
        ["Avg Deal", `$${salesData.avgDeal.toLocaleString()}`],
      );
    }

    if (salespersonData && salespersonData.length > 0) {
      const topSP = salespersonData[0];
      rows.push(["Top Salesperson", `${topSP.name} - ${topSP.deals} deals`]);
    }

    if (salesData?.topMake) {
      rows.push(["Top Vehicle", `${salesData.topMake.make} - ${salesData.topMake.count} sold`]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    handlePrintReport();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isLoading = loadingSales || loadingInventory || loadingFinancial || loadingSalesperson || loadingCustomer;

  const renderReportContent = () => {
    switch (reportType) {
      case "Sales Summary":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">{formatCurrency(salesData?.totalRevenue || 0)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Deals</div>
                <div className="text-2xl font-bold">{salesData?.totalDeals || 0}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Avg Deal Size</div>
                <div className="text-2xl font-bold">{formatCurrency(salesData?.avgDeal || 0)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Invoices</div>
                <div className="text-2xl font-bold">{salesData?.invoiceCount || 0}</div>
              </div>
            </div>
            {salesData?.topMake && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Top Selling Make</div>
                <div className="text-xl font-semibold">{salesData.topMake.make} ({salesData.topMake.count} sold)</div>
              </div>
            )}
          </div>
        );

      case "Inventory Aging":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-muted-foreground">0-30 Days</div>
                <div className="text-2xl font-bold">{inventoryData?.agingBuckets?.["0-30"] || 0}</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-muted-foreground">31-60 Days</div>
                <div className="text-2xl font-bold">{inventoryData?.agingBuckets?.["31-60"] || 0}</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-muted-foreground">61-90 Days</div>
                <div className="text-2xl font-bold">{inventoryData?.agingBuckets?.["61-90"] || 0}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-muted-foreground">90+ Days</div>
                <div className="text-2xl font-bold">{inventoryData?.agingBuckets?.["90+"] || 0}</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Inventory</div>
                <div className="text-xl font-bold">{inventoryData?.totalInventory || 0}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-xl font-bold">{formatCurrency(inventoryData?.totalValue || 0)}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Potential Profit</div>
                <div className="text-xl font-bold">{formatCurrency(inventoryData?.potentialProfit || 0)}</div>
              </div>
            </div>
          </div>
        );

      case "Financial Summary":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Income</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(financialData?.totalIncome || 0)}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Expenses</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(financialData?.totalExpenses || 0)}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Net Profit</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(financialData?.netProfit || 0)}</div>
              </div>
            </div>
            {financialData?.expensesByCategory && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="font-semibold mb-2">Expenses by Category</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {financialData.expensesByCategory.map((cat) => (
                    <div key={cat.category} className="flex justify-between">
                      <span>{cat.category}</span>
                      <span className="font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "Salesperson Performance":
        return (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-right p-2">Deals</th>
                    <th className="text-right p-2">Revenue</th>
                    <th className="text-right p-2">Leads</th>
                    <th className="text-right p-2">Test Drives</th>
                  </tr>
                </thead>
                <tbody>
                  {salespersonData?.map((sp, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{sp.name}</td>
                      <td className="text-right p-2">{sp.deals}</td>
                      <td className="text-right p-2">{formatCurrency(sp.revenue)}</td>
                      <td className="text-right p-2">{sp.leads}</td>
                      <td className="text-right p-2">{sp.testDrives}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Customer Analytics":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Customers</div>
                <div className="text-2xl font-bold">{customerData?.totalCustomers || 0}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Active</div>
                <div className="text-2xl font-bold">{customerData?.activeCustomers || 0}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">{formatCurrency(customerData?.totalRevenue || 0)}</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Avg Value</div>
                <div className="text-2xl font-bold">{formatCurrency(customerData?.avgCustomerValue || 0)}</div>
              </div>
            </div>
            {customerData?.leadsBySource && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="font-semibold mb-2">Leads by Source</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {customerData.leadsBySource.map((source) => (
                    <div key={source.source} className="flex justify-between">
                      <span>{source.source}</span>
                      <span className="font-medium">{source.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-muted-foreground">Select a report type to generate</div>;
    }
  };

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Reports</h1>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Select Report Type</Label>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {reportTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="report-type"
                      value={type}
                      checked={reportType === type}
                      onChange={(event) => setReportType(event.target.value)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Date Range</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(event) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: event.target.value,
                      }))
                    }
                  />
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(event) =>
                      setDateRange((prev) => ({
                        ...prev,
                        to: event.target.value,
                      }))
                    }
                  />
                </div>
                <Select
                  value={dateRange.preset}
                  onChange={(event) =>
                    setDateRange((prev) => ({
                      ...prev,
                      preset: event.target.value,
                    }))
                  }
                >
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="This Quarter">This Quarter</option>
                  <option value="This Year">This Year</option>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Filters</Label>
                <div className="grid gap-2">
                  <Select
                    value={filters.salesperson}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        salesperson: event.target.value,
                      }))
                    }
                  >
                    <option value="">Salesperson</option>
                    <option value="Jamie Lee">Jamie Lee</option>
                    <option value="Alex Martinez">Alex Martinez</option>
                    <option value="Sam Patel">Sam Patel</option>
                  </Select>
                  <Select
                    value={filters.vehicleMake}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        vehicleMake: event.target.value,
                      }))
                    }
                  >
                    <option value="">Vehicle Make</option>
                    <option value="Audi">Audi</option>
                    <option value="BMW">BMW</option>
                    <option value="Lexus">Lexus</option>
                  </Select>
                  <Select
                    value={filters.status}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                  >
                    <option value="">Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Button variant="primary" onClick={() => setShowOutput(true)}>
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showOutput && (
        <Card>
          <CardContent className="space-y-4">
            <div className="text-sm font-semibold text-muted-foreground">
              Report Output {isLoading && "(Loading...)"}
            </div>

            <div
              ref={outputRef}
              className="space-y-3 rounded-lg border bg-background p-4 text-sm"
            >
              <div className="space-y-1">
                <div className="font-semibold">{reportType}</div>
                <div className="text-muted-foreground">
                  {dateRange.preset || `${dateRange.from || "Start"} - ${dateRange.to || "End"}`}
                </div>
              </div>

              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading report data...</div>
              ) : (
                renderReportContent()
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleExportPdf}>
                Export PDF
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExportExcel}>
                Export Excel
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrintReport}>
                Print
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
