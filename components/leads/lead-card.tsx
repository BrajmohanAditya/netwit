"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  UserRound,
  CalendarClock,
  Car,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";

interface LeadCardProps {
  leadId: string;
  name: string;
  phone: string;
  sourceLabel: string;
  vehicleLabel?: string;
  assignedTo?: string;
  createdLabel?: string;
  priority?: Priority;
}

const priorityBorder: Record<Priority, string> = {
  high: "border-l-4 border-l-red-500",
  medium: "border-l-4 border-l-yellow-500",
  low: "border-l-0",
};

export function LeadCard({
  leadId,
  name,
  phone,
  sourceLabel,
  vehicleLabel,
  assignedTo,
  createdLabel,
  priority = "low",
}: LeadCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        priorityBorder[priority],
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-foreground">{name}</div>
            <a
              href={`tel:${phone}`}
              className="text-xs text-primary hover:underline"
            >
              {phone}
            </a>
          </div>
          <Badge variant="secondary">
            {sourceLabel}
          </Badge>
        </div>

        {vehicleLabel && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Car className="h-3.5 w-3.5" />
            <span className="truncate">{vehicleLabel}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
            {initials}
          </div>
          <span className="truncate">Thumb</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserRound className="h-3.5 w-3.5" />
          <span>{assignedTo || "Unassigned"}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          <span>{createdLabel || "Just now"}</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border bg-background text-muted-foreground hover:text-foreground hover:shadow-sm"
            title="Call"
          >
            <Phone className="h-3.5 w-3.5" />
          </button>
          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border bg-background text-muted-foreground hover:text-foreground hover:shadow-sm"
            title="Message"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </button>
          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border bg-background text-muted-foreground hover:text-foreground hover:shadow-sm"
            title="Email"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-[10px] text-muted-foreground">
          Lead ID: {leadId}
        </div>
      </div>
    </div>
  );
}
