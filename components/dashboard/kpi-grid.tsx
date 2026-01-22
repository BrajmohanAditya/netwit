"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Car, Users, TrendingUp } from "lucide-react";

interface DashboardStats {
  total_inventory_count: number;
  total_inventory_value: number;
  projected_profit: number;
  leads_this_month: number;
}

export function KPIGrid({ stats }: { stats: DashboardStats }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      icon: <Car className="w-6 h-6 text-white" />,
      iconBg: "bg-blue-500",
      number: formatCurrency(stats.total_inventory_value),
      label: "Inventory Value",
      change: 12,
      isPositive: true,
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      iconBg: "bg-green-500",
      number: formatCurrency(stats.projected_profit),
      label: "Projected Profit",
      change: 8,
      isPositive: true,
    },
    {
      icon: <Car className="w-6 h-6 text-white" />,
      iconBg: "bg-purple-500",
      number: stats.total_inventory_count.toString(),
      label: "Active Inventory",
      change: 5,
      isPositive: true,
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      iconBg: "bg-amber-500",
      number: stats.leads_this_month.toString(),
      label: "Leads This Month",
      change: 15,
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom">
      {kpis.map((kpi, index) => (
        <StatCard
          key={index}
          icon={kpi.icon}
          iconBg={kpi.iconBg}
          number={kpi.number}
          label={kpi.label}
          change={kpi.change}
          isPositive={kpi.isPositive}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
}
