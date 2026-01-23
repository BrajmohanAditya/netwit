"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DashboardMetrics,
  fetchDashboardMetrics,
} from "@/lib/services/dashboard.service";

interface UseDashboardMetricsReturn {
  data: DashboardMetrics | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: string;
  refresh: () => Promise<void>;
}

export function useDashboardMetrics(
  refreshInterval: number = 5 * 60 * 1000, // 5 minutes default
): UseDashboardMetricsReturn {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const updateLastUpdated = useCallback(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString());
  }, []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const metrics = await fetchDashboardMetrics();
      setData(metrics);
      updateLastUpdated();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch metrics"),
      );
      console.error("Error fetching dashboard metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [updateLastUpdated]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refresh, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}
