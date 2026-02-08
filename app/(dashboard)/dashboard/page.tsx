import { DashboardClient } from "@/components/dashboard/dashboard-client";
export const dynamic = "force-dynamic";
import { fetchDashboardMetrics } from "@/lib/services/dashboard.service";
import { getRecentLeads } from "@/lib/actions/dashboard-stats";
import AuthenticatedDashboard from "./auth-dashboard";

export default async function DashboardPage() {
  try {
    const [metrics, recentLeads] = await Promise.all([
      fetchDashboardMetrics(),
      getRecentLeads(5),
    ]);

    return <AuthenticatedDashboard metrics={metrics} recentLeads={recentLeads} />;
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-heading mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-muted">
            Please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    );
  }
}
