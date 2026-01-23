"use client";

import { useRouter } from "next/navigation";
import { StatCards } from "@/components/dashboard/stat-cards";
import { LeadSourceChart } from "@/components/dashboard/lead-source-chart";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import { RecentLeads } from "@/components/crm/recent-leads";
import { FollowUps } from "@/components/dashboard/follow-ups";
import { SalesPipeline } from "@/components/dashboard/sales-pipeline";
import { TopVehiclesChart } from "@/components/dashboard/top-vehicles-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import { DashboardMetrics } from "@/lib/services/dashboard.service";

interface DashboardClientProps {
  metrics: DashboardMetrics;
  recentLeads: any[];
}

export function DashboardClient({
  metrics,
  recentLeads,
}: DashboardClientProps) {
  const router = useRouter();

  const handleRefresh = async () => {
    router.refresh();
  };

  const handleLeadsClick = () => {
    router.push("/dashboard/leads");
  };

  const handleInventoryClick = () => {
    router.push("/dashboard/inventory");
  };

  const handleDealsClick = () => {
    router.push("/dashboard/deals");
  };

  const handleTestDrivesClick = () => {
    router.push("/dashboard/test-drives");
  };

  const handleRevenueClick = () => {
    router.push("/dashboard/invoices");
  };

  const handleCreateLead = () => {
    router.push("/dashboard/leads/new");
  };

  const handleAddVehicle = () => {
    router.push("/dashboard/inventory/new");
  };

  const handleScheduleTestDrive = () => {
    router.push("/dashboard/test-drives/new");
  };

  const handleViewAllLeads = () => {
    router.push("/dashboard/leads");
  };

  const now = new Date();
  const lastUpdated = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-elevation-2 p-8 border border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent)]" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <div className="h-16 w-16 rounded-md bg-primary flex items-center justify-center shadow-elevation-3">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-heading">Dashboard</h1>
                <Badge className="bg-success text-white border-0 rounded-full px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <p className="text-muted text-base flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Welcome to Adaptus DMS - Real-time dealership overview
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stat Cards - 5 in a row */}
      <StatCards
        metrics={metrics}
        onLeadsClick={handleLeadsClick}
        onInventoryClick={handleInventoryClick}
        onDealsClick={handleDealsClick}
        onTestDrivesClick={handleTestDrivesClick}
        onRevenueClick={handleRevenueClick}
      />

      {/* Two-Column: Lead Source + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadSourceChart />
        </div>
        <div>
          <QuickActionsPanel
            onViewAllLeads={handleViewAllLeads}
            onCreateLead={handleCreateLead}
            onAddVehicle={handleAddVehicle}
            onScheduleTestDrive={handleScheduleTestDrive}
          />
        </div>
      </div>

      {/* Two-Column: Recent Leads + Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <FollowUps />
      </div>

      {/* Two-Column: Sales Pipeline + Top Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesPipeline />
        <TopVehiclesChart />
      </div>

      {/* Last Updated Footer */}
      <div className="text-right text-sm text-muted">
        Last updated: {lastUpdated}
      </div>
    </div>
  );
}
