"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const reportTypes = [
  "Sales Summary",
  "Inventory Aging",
  "Financial Summary",
  "Salesperson Performance",
  "Customer Analytics",
  "Custom Report",
];

export default function ReportsPage() {
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

  const handlePrint = useReactToPrint({
    content: () => outputRef.current as any,
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
    const rows = [
      ["Report Type", reportType],
      ["Date Range", dateRange.preset || "Custom"],
      ["From", dateRange.from || ""],
      ["To", dateRange.to || ""],
      ["Salesperson", filters.salesperson || "All"],
      ["Vehicle Make", filters.vehicleMake || "All"],
      ["Status", filters.status || "All"],
      [],
      ["Metric", "Value"],
      ["Total Deals", "12"],
      ["Total Revenue", "$450K"],
      ["Avg Deal", "$37.5K"],
      ["Commission", "$18K"],
      ["Top Salesperson", "Agam Chawla - 5 deals"],
      ["Top Vehicle", "Ford Mustang - 3 sold"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.join(",")).join("\n");

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
              Report Output
            </div>

            <div
              ref={outputRef}
              className="space-y-3 rounded-lg border bg-background p-4 text-sm"
            >
              <div className="space-y-1">
                <div className="font-semibold">{reportType}</div>
                <div className="text-muted-foreground">
                  Jan 1 - Jan 31, 2026
                </div>
              </div>

              <div className="grid gap-2 text-muted-foreground sm:grid-cols-2">
                <div>Total Deals: 12</div>
                <div>Total Revenue: $450K</div>
                <div>Avg Deal: $37.5K</div>
                <div>Commission: $18K</div>
              </div>

              <div className="space-y-1 text-muted-foreground">
                <div>Top Salesperson: Agam Chawla - 5 deals</div>
                <div>Top Vehicle: Ford Mustang - 3 sold</div>
              </div>

              <div className="space-y-1 text-muted-foreground">
                <div className="font-semibold text-slate-600">Charts:</div>
                <div>Revenue by Week</div>
                <div>Deals by Status</div>
                <div>Top 5 Vehicles</div>
              </div>
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
