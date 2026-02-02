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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterSource: string;
  setFilterSource: (source: string) => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
  onClearFilters: () => void;
}

export function LeadFilters({
  view,
  onViewChange,
  searchQuery,
  setSearchQuery,
  filterSource,
  setFilterSource,
  filterDate,
  setFilterDate,
  onClearFilters,
}: LeadFiltersProps) {
  const hasActiveFilters = searchQuery !== "" || filterSource !== "all" || filterDate !== "range";

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" title="Filter options">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="w-[140px]"
          >
            <option value="all">All Sources</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Craigslist">Craigslist</option>
            <option value="Kijiji">Kijiji</option>
            <option value="Text Us">Text Us</option>
            <option value="Other">Other</option>
          </Select>
          <Select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-[140px]"
          >
            <option value="range">Date Range</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom</option>
          </Select>
          {/* Other filters are placeholders for now */}
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

      <div className="flex flex-wrap items-center gap-2 h-8">
        {hasActiveFilters && (
          <>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-2">
              Active:
            </span>
            {searchQuery && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full border">
                Search: {searchQuery}
              </span>
            )}
            {filterSource !== "all" && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full border">
                Source: {filterSource}
              </span>
            )}
            {filterDate !== "range" && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full border">
                Date: {filterDate}
              </span>
            )}
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-foreground ml-auto"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
