"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface LeadSource {
  name: string;
  count: number;
}

interface LeadSourceChartProps {
  data?: LeadSource[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const DEFAULT_DATA: LeadSource[] = [
  { name: "Website", count: 145 },
  { name: "Facebook", count: 98 },
  { name: "Craigslist", count: 87 },
  { name: "Kijiji", count: 76 },
  { name: "Phone", count: 65 },
  { name: "Walk-in", count: 54 },
];

export function LeadSourceChart({ data = DEFAULT_DATA }: LeadSourceChartProps) {
  const router = useRouter();

  const handleSourceClick = (source: string) => {
    router.push(`/dashboard/leads?source=${source}`);
  };

  return (
    <Card className="shadow-elevation-2 rounded-lg border border-gray-200 bg-white">
      <CardHeader className="p-6 border-b border-gray-200 flex flex-row items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-card-title font-semibold text-heading">
          Lead Source (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => `${value} leads`}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar
              dataKey="count"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              onClick={(data) => handleSourceClick(data.name)}
              className="cursor-pointer hover:opacity-80"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
