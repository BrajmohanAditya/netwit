"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { fetchDashboardMetrics } from "@/lib/services/dashboard.service";
import { getRecentLeads } from "@/lib/actions/dashboard-stats";

interface DashboardPageProps {
  metrics: any;
  recentLeads: any[];
}

export default function AuthenticatedDashboard({ metrics, recentLeads }: DashboardPageProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DashboardClient metrics={metrics} recentLeads={recentLeads} />;
}
