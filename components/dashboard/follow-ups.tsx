"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

interface FollowUp {
  id: string;
  leadName: string;
  action: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

interface FollowUpsProps {
  items?: FollowUp[];
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const DEFAULT_ITEMS: FollowUp[] = [
  {
    id: "1",
    leadName: "John Smith",
    action: "Send quote",
    dueDate: "Today",
    priority: "high",
  },
  {
    id: "2",
    leadName: "Sarah Johnson",
    action: "Schedule test drive",
    dueDate: "Tomorrow",
    priority: "high",
  },
  {
    id: "3",
    leadName: "Mike Davis",
    action: "Follow up call",
    dueDate: "In 2 days",
    priority: "medium",
  },
];

export function FollowUps({ items = DEFAULT_ITEMS }: FollowUpsProps) {
  return (
    <Card className="shadow-elevation-2 rounded-lg border border-gray-200 bg-white">
      <CardHeader className="p-6 border-b border-gray-200 flex flex-row items-center gap-2">
        <Clock className="w-5 h-5 text-purple-500" />
        <CardTitle className="text-card-title font-semibold text-heading">
          Follow-ups
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            No follow-ups scheduled
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm text-heading">
                  {item.leadName}
                </p>
                <p className="text-xs text-muted flex items-center gap-1 mt-1">
                  <ArrowRight className="w-3 h-3" />
                  {item.action}
                </p>
                <p className="text-xs text-gray-500 mt-2">{item.dueDate}</p>
              </div>
              <Badge className={PRIORITY_COLORS[item.priority]}>
                {item.priority}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
