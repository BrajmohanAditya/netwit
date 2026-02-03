"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateDealWizard } from "@/components/deals/wizard/create-deal-wizard";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

const fallbackDealCard = {
  id: "D-001",
  client: "John Smith",
  contact: "john.smith@adaptus.com",
  vehicle: "2021 Ford Mustang",
  value: "$34,500",
  date: "Jan 15, 2026",
  salesperson: "Ava Carter",
  progress: 60,
  stuckDays: 5,
};

const funnelStages = [
  { label: "New", count: 50, percent: 100 },
  { label: "Contacted", count: 40, percent: 80 },
  { label: "Qualified", count: 30, percent: 60 },
  { label: "Negotiation", count: 20, percent: 40 },
  { label: "Closed", count: 13, percent: 26 },
];

const revenueTrend = {
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  actual: [42, 38, 45, 52, 49, 60, 58, 63, 70, 68, 74, 80],
  forecast: [40, 41, 44, 50, 53, 57, 61, 65, 69, 72, 76, 82],
  target: [45, 46, 48, 54, 58, 62, 66, 70, 74, 78, 82, 86],
};

const buildLinePoints = (values: number[], height: number, width: number) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
};

export default function DealsPage() {
  const wizardRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const createdStatus = searchParams.get("status") === "created";
  const deals = useQuery(api.deals.get, {}) || [];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const stats = useMemo(() => {
    const closedDeals = deals.filter((deal) => deal.status === "paid-off");
    const activeDeals = deals.filter((deal) => deal.status !== "paid-off");
    const pipelineValue = activeDeals.reduce(
      (sum, deal) => sum + deal.value,
      0,
    );
    const avgValue = activeDeals.length
      ? pipelineValue / activeDeals.length
      : 0;
    const closeRate = deals.length
      ? Math.round((closedDeals.length / deals.length) * 100)
      : 0;

    return [
      { label: "Active", value: String(activeDeals.length) },
      { label: "Pipeline", value: formatCurrency(pipelineValue) },
      { label: "Avg", value: formatCurrency(avgValue) },
      { label: "Closed", value: String(closedDeals.length) },
      { label: "Rate", value: `${closeRate}%` },
    ];
  }, [deals]);

  const pipelineColumns = useMemo(() => {
    const columns: {
      id: string;
      title: string;
      cards: Doc<"deals">[];
      count: number;
      total: number;
    }[] = [
      { id: "new", title: "New / Inbound", cards: [], count: 0, total: 0 },
      {
        id: "negotiation",
        title: "In Negotiation",
        cards: [],
        count: 0,
        total: 0,
      },
      {
        id: "down-payment",
        title: "Down Payment",
        cards: [],
        count: 0,
        total: 0,
      },
      { id: "financing", title: "Financing", cards: [], count: 0, total: 0 },
      {
        id: "paid-off",
        title: "Paid Off",
        cards: [],
        count: 0,
        total: 0,
      },
    ];

    const columnMap = new Map(columns.map((col) => [col.id, col]));

    deals.forEach((deal) => {
      let status = deal.status.toLowerCase();
      if (status === "created") status = "new";
      const column = columnMap.get(status) ?? columnMap.get("new");
      column?.cards.push(deal);
    });

    columns.forEach((column) => {
      column.count = column.cards.length;
      column.total = column.cards.reduce((sum, deal) => sum + deal.value, 0);
    });

    return columns;
  }, [deals]);

  const featuredDeal = deals[0] ?? null;

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading">Deals Pipeline</h1>
          <p className="text-sm text-muted mt-1">
            Track active deals and sales performance
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredDeal ? (
            <Link
              href={`/deals/${featuredDeal.dealNumber ?? featuredDeal._id}`}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-heading hover:bg-gray-50"
            >
              View Deal
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-muted-foreground">
              No deals yet
            </span>
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              wizardRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            + New
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-gray-200 bg-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium text-muted">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-heading">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured Deal */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Featured Deal</CardTitle>
          </CardHeader>
          <CardContent>
            {featuredDeal ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-heading">
                      {featuredDeal.customer}
                    </h3>
                    <p className="text-xs text-muted">
                      #{featuredDeal.dealNumber ?? featuredDeal._id}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                    {featuredDeal.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted">Vehicle</p>
                  <p className="text-sm font-medium text-heading">
                    {featuredDeal.title}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-heading">
                    {formatCurrency(featuredDeal.value)}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(featuredDeal.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link
                    href={`/deals/${featuredDeal.dealNumber ?? featuredDeal._id}`}
                  >
                    View Details
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No active deals.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Funnel */}
        <Card className="border border-gray-200 bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-heading font-medium">
                    {stage.label} ({stage.count})
                  </div>
                  <div className="text-muted">{stage.percent}%</div>
                </div>
                <div className="h-3 rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-muted mb-4">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Actual
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Forecast
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Target
            </span>
          </div>
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 180" className="w-full min-w-[600px]">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                points={buildLinePoints(revenueTrend.actual, 140, 560)}
                transform="translate(20,20)"
              />
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                points={buildLinePoints(revenueTrend.forecast, 140, 560)}
                transform="translate(20,20)"
                strokeDasharray="6 6"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={buildLinePoints(revenueTrend.target, 140, 560)}
                transform="translate(20,20)"
              />
              {revenueTrend.months.map((month, index) => {
                const x = 20 + (index / (revenueTrend.months.length - 1)) * 560;
                return (
                  <text
                    key={month}
                    x={x}
                    y={175}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {month}
                  </text>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-muted mt-2">Hover for values</p>
        </CardContent>
      </Card>

      {/* Deals Pipeline */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Deals Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {pipelineColumns.map((column) => (
              <div
                key={column.id}
                className={`rounded-lg border border-gray-200 bg-gray-50 p-3 flex flex-col ${
                  createdStatus && column.id === "new"
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-heading">
                      {column.title}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {column.count} deals
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {formatCurrency(column.total)}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {column.cards.map((card) => (
                    <div
                      key={card._id}
                      className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-heading">
                        {card.title}
                      </p>
                      <p className="text-xs text-muted mt-1">{card.customer}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted">Deal Value</span>
                        <span className="text-sm font-semibold text-heading">
                          {formatCurrency(card.value)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted">Details</span>
                        <Link
                          href={`/deals/${card.dealNumber ?? card._id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Deal
                        </Link>
                      </div>
                    </div>
                  ))}
                  {column.cards.length === 0 && (
                    <div className="text-xs text-muted text-center py-4 italic">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Deal Wizard */}
      <div ref={wizardRef} />
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Create Deal</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateDealWizard />
        </CardContent>
      </Card>
    </div>
  );
}
