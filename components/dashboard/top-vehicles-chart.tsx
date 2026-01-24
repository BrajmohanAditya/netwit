"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Car } from "lucide-react";

interface VehicleData {
  month: string;
  "Honda Civic": number;
  "Toyota Camry": number;
  "Ford F-150": number;
  "Tesla Model 3": number;
  "BMW 3-Series": number;
}

interface TopVehiclesProps {
  data?: VehicleData[];
}

const DEFAULT_DATA: VehicleData[] = [
  {
    month: "Aug 2025",
    "Honda Civic": 12,
    "Toyota Camry": 8,
    "Ford F-150": 6,
    "Tesla Model 3": 5,
    "BMW 3-Series": 3,
  },
  {
    month: "Sep 2025",
    "Honda Civic": 15,
    "Toyota Camry": 10,
    "Ford F-150": 8,
    "Tesla Model 3": 6,
    "BMW 3-Series": 4,
  },
  {
    month: "Oct 2025",
    "Honda Civic": 18,
    "Toyota Camry": 12,
    "Ford F-150": 10,
    "Tesla Model 3": 8,
    "BMW 3-Series": 5,
  },
  {
    month: "Nov 2025",
    "Honda Civic": 16,
    "Toyota Camry": 11,
    "Ford F-150": 9,
    "Tesla Model 3": 7,
    "BMW 3-Series": 4,
  },
  {
    month: "Dec 2025",
    "Honda Civic": 22,
    "Toyota Camry": 14,
    "Ford F-150": 12,
    "Tesla Model 3": 10,
    "BMW 3-Series": 6,
  },
  {
    month: "Jan 2026",
    "Honda Civic": 25,
    "Toyota Camry": 16,
    "Ford F-150": 14,
    "Tesla Model 3": 12,
    "BMW 3-Series": 8,
  },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TopVehiclesChart({ data = DEFAULT_DATA }: TopVehiclesProps) {
  return (
    <Card className="shadow-elevation-2 rounded-lg border border-gray-200 bg-white">
      <CardHeader className="p-4 sm:p-6 border-b border-gray-200 flex flex-row items-center gap-2">
        <Car className="w-4 sm:w-5 h-4 sm:h-5 text-teal-500" />
        <CardTitle className="text-base sm:text-card-title font-semibold text-heading">
          Top 5 Vehicles (Last 6 Months)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorCivic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCamry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorF150" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTesla" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBMW" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => `${value} units`}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="Honda Civic"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorCivic)"
            />
            <Area
              type="monotone"
              dataKey="Toyota Camry"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorCamry)"
            />
            <Area
              type="monotone"
              dataKey="Ford F-150"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorF150)"
            />
            <Area
              type="monotone"
              dataKey="Tesla Model 3"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorTesla)"
            />
            <Area
              type="monotone"
              dataKey="BMW 3-Series"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorBMW)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
