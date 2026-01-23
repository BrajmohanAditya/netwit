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
  Cell,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface PipelineData {
  stage: string;
  count: number;
  percentage: number;
}

interface SalesPipelineProps {
  data?: PipelineData[];
}

const DEFAULT_DATA: PipelineData[] = [
  { stage: "New", count: 125, percentage: 100 },
  { stage: "Contacted", count: 98, percentage: 78 },
  { stage: "Qualified", count: 72, percentage: 58 },
  { stage: "Negotiation", count: 45, percentage: 36 },
  { stage: "Closed", count: 28, percentage: 22 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function SalesPipeline({ data = DEFAULT_DATA }: SalesPipelineProps) {
  const router = useRouter();

  const handleStageClick = (stage: string) => {
    router.push(`/dashboard/deals?stage=${stage}`);
  };

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card className="shadow-elevation-2 rounded-lg border border-gray-200 bg-white">
      <CardHeader className="p-4 sm:p-6 border-b border-gray-200 flex flex-row items-center gap-2">
        <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
        <CardTitle className="text-base sm:text-card-title font-semibold text-heading">
          Sales Pipeline (Funnel)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" domain={[0, maxCount]} />
            <YAxis
              dataKey="stage"
              type="category"
              stroke="#6b7280"
              width={50}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
              formatter={(value, name) => {
                if (name === "count") return `${value} deals`;
                if (name === "percentage") return `${value}%`;
                return value;
              }}
            />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              onClick={(data) => handleStageClick(data.stage)}
              className="cursor-pointer hover:opacity-80"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
          {data.map((item) => (
            <div
              key={item.stage}
              className="text-center p-2 bg-gray-50 rounded"
            >
              <div className="font-semibold text-gray-900 text-xs">
                {item.count}
              </div>
              <div className="text-gray-600 text-xs">{item.percentage}%</div>
              <div className="text-gray-500 truncate text-xs">{item.stage}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
