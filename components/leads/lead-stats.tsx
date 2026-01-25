"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LeadStatProps {
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

function LeadStatCard({ label, count, isActive, onClick }: LeadStatProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-2",
        isActive ? "border-primary bg-primary/5" : "border-transparent",
        "h-full",
      )}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="text-2xl font-bold text-foreground">{count}</span>
      </CardContent>
    </Card>
  );
}

export function LeadStats() {
  // These could be props or fetched data later
  const stats = [
    { label: "All", count: 48 },
    { label: "Today", count: 5 },
    { label: "Not Seen", count: 12 },
    { label: "Handled", count: 25 },
    { label: "Deals", count: 8 },
    { label: "Closed", count: 3 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => (
        <LeadStatCard
          key={stat.label}
          label={stat.label}
          count={stat.count}
          // Simple mock active state for demo
          isActive={stat.label === "All"}
        />
      ))}
    </div>
  );
}
