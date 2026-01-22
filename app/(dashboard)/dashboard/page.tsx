import { KPIGrid } from "@/components/dashboard/kpi-grid";
import { ChartsContainer } from "@/components/dashboard/charts-container";
import { RecentLeads } from "@/components/crm/recent-leads";
// import { AnalystChat } from '@/components/ai/analyst-chat';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getInventoryStats,
  getRevenueData,
  getRecentLeads,
} from "@/lib/actions/dashboard-stats";
import { LayoutDashboard, TrendingUp, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const [stats, inventoryStats, revenueData, recentLeads] = await Promise.all([
    getDashboardStats(),
    getInventoryStats(),
    getRevenueData(),
    getRecentLeads(5),
  ]);

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Dramatic Header */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-elevation-2 p-8 border border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent)]" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-16 w-16 rounded-md bg-primary flex items-center justify-center shadow-elevation-3">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-page-title font-bold text-heading">
                Dashboard
              </h1>
              <Badge className="bg-success text-white border-0 rounded-full px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <p className="text-muted text-large-body flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Welcome to Adaptus DMS - Real-time dealership overview
            </p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <KPIGrid stats={stats} />

      {/* Charts and Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartsContainer
            inventoryStats={inventoryStats}
            revenueData={revenueData}
          />
        </div>
        <div>
          <Card className="shadow-elevation-2 rounded-lg border border-gray-200 bg-white">
            <CardHeader className="p-6 border-b border-gray-200">
              <CardTitle className="text-card-title font-semibold text-heading">
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RecentLeads leads={recentLeads} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Chat Widget - Temporarily disabled until tool API is fixed */}
      {/* <AnalystChat /> */}
    </div>
  );
}
