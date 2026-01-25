"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import { Select } from "@/components/ui/select";

interface LeadFiltersProps {
  view: "kanban" | "table";
  onViewChange: (view: "kanban" | "table") => void;
}

export function LeadFilters({ view, onViewChange }: LeadFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-background border rounded-lg p-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="outline" size="icon" title="Filter options">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="all" className="w-[140px]">
            <option value="all">All Sources</option>
            <option value="web">Website</option>
            <option value="ref">Referral</option>
            <option value="campaign">Campaign</option>
          </Select>
          <Select defaultValue="range" className="w-[140px]">
            <option value="range">Date Range</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom</option>
          </Select>
          <Select defaultValue="month" className="w-[120px]">
            <option value="month">Month</option>
            <option value="jan">January</option>
            <option value="feb">February</option>
            <option value="mar">March</option>
          </Select>
          <Select defaultValue="more" className="w-[120px]">
            <option value="more">More</option>
            <option value="status">Status</option>
            <option value="assignee">Assignee</option>
            <option value="priority">Priority</option>
          </Select>
        </div>

        <div className="inline-flex items-center rounded-md border bg-background p-1">
          <Button
            variant={view === "kanban" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("kanban")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={view === "table" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("table")}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Active:
        </span>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          This Month
        </span>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          Not Started
        </span>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          Clear All
        </Button>
      </div>
    </div>
  );
}
