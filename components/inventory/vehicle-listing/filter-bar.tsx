"use client";

import { Search, ChevronDown, X } from "lucide-react";
import { VehicleFilters } from "@/types/vehicle";
import { useState } from "react";

interface FilterBarProps {
  filters: VehicleFilters;
  onFiltersChange: (filters: VehicleFilters) => void;
}

const STATUS_OPTIONS = ["All", "Active", "Inactive", "Sold", "Coming Soon"];
const MAKE_OPTIONS = [
  "Ford",
  "Chevrolet",
  "Toyota",
  "Honda",
  "BMW",
  "Mercedes",
];
const YEAR_OPTIONS = Array.from(
  { length: 20 },
  (_, i) => new Date().getFullYear() - i,
);

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isExpandedFilters, setIsExpandedFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: string) => {
    const statusMap: Record<
      string,
      "active" | "inactive" | "sold" | "coming-soon"
    > = {
      Active: "active",
      Inactive: "inactive",
      Sold: "sold",
      "Coming Soon": "coming-soon",
    };

    const newStatus = status === "All" ? [] : [statusMap[status]];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleMakeChange = (make: string) => {
    const newMakes = filters.make.includes(make)
      ? filters.make.filter((m) => m !== make)
      : [...filters.make, make];
    onFiltersChange({ ...filters, make: newMakes });
  };

  const handleYearChange = (year: number) => {
    onFiltersChange({
      ...filters,
      year: [year, filters.year[1]],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status.length > 0 ||
    filters.make.length > 0 ||
    filters.year[0] !== new Date().getFullYear() - 10;

  const handleClearAll = () => {
    onFiltersChange({
      search: "",
      status: [],
      make: [],
      year: [new Date().getFullYear() - 10, new Date().getFullYear()],
      price: [0, 100000],
      odometer: [0, 200000],
      fuel: [],
      transmission: [],
      bodyType: [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Primary Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Make, Model, VIN, Stock #"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status[0] || "all"}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer bg-white"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Make Filter */}
        <div className="w-full sm:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer bg-white"
            >
              <option value="">Select Make</option>
              {MAKE_OPTIONS.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year Filter */}
        <div className="w-full sm:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <div className="relative">
            <select
              value={filters.year[0]}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer bg-white"
            >
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* More Filters Toggle */}
        <button
          onClick={() => setIsExpandedFilters(!isExpandedFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
        >
          +More
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.status.map((status) => (
            <span
              key={status}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {status}
              <button
                onClick={() => {
                  const newStatus = filters.status.filter((s) => s !== status);
                  onFiltersChange({ ...filters, status: newStatus });
                }}
                className="hover:text-blue-900"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          {filters.make.map((make) => (
            <span
              key={make}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {make}
              <button
                onClick={() => {
                  const newMakes = filters.make.filter((m) => m !== make);
                  onFiltersChange({ ...filters, make: newMakes });
                }}
                className="hover:text-blue-900"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
