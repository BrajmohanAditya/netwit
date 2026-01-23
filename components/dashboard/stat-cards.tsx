"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Users, Package, Handshake, Car, Trophy } from "lucide-react";
import { DashboardMetrics } from "@/lib/services/dashboard.service";

interface StatCardsProps {
  metrics: DashboardMetrics;
  onLeadsClick?: () => void;
  onInventoryClick?: () => void;
  onDealsClick?: () => void;
  onTestDrivesClick?: () => void;
  onRevenueClick?: () => void;
}

export function StatCards({
  metrics,
  onLeadsClick,
  onInventoryClick,
  onDealsClick,
  onTestDrivesClick,
  onRevenueClick,
}: StatCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statCardsData = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      iconBg: "bg-blue-500",
      number: metrics.todaysLeads.toString(),
      label: "Today's Leads",
      change: Math.abs(metrics.leadsChange),
      isPositive: metrics.leadsChange >= 0,
      onClick: onLeadsClick,
    },
    {
      icon: <Package className="w-6 h-6 text-white" />,
      iconBg: "bg-teal-500",
      number: metrics.newInventory.toString(),
      label: "New Inventory",
      change: Math.abs(metrics.newInventoryChange),
      isPositive: metrics.newInventoryChange >= 0,
      onClick: onInventoryClick,
    },
    {
      icon: <Handshake className="w-6 h-6 text-white" />,
      iconBg: "bg-purple-500",
      number: metrics.activeDeals.toString(),
      label: "Active Deals",
      sublabel: formatCurrency(metrics.pipelineValue),
      change: Math.abs(metrics.activeDealsChange),
      isPositive: metrics.activeDealsChange >= 0,
      onClick: onDealsClick,
    },
    {
      icon: <Car className="w-6 h-6 text-white" />,
      iconBg: "bg-orange-500",
      number: metrics.testDrivesToday.toString(),
      label: "Test Drives Today",
      change: 0,
      isPositive: true,
      onClick: onTestDrivesClick,
    },
    {
      icon: <Trophy className="w-6 h-6 text-white" />,
      iconBg: "bg-green-500",
      number: metrics.dealsClosedMonth.toString(),
      label: "Deals Closed (Month)",
      sublabel: formatCurrency(metrics.revenueMonth),
      change: Math.abs(metrics.dealsClosedMonthChange),
      isPositive: metrics.dealsClosedMonthChange >= 0,
      onClick: onRevenueClick,
    },
  ];

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      role="region"
      aria-label="Dashboard metrics"
    >
      {statCardsData.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          iconBg={stat.iconBg}
          number={stat.number}
          label={stat.label}
          sublabel={stat.sublabel}
          change={stat.change}
          isPositive={stat.isPositive}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
}
