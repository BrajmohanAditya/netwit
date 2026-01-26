"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  const kanbanStatuses = [
    "Not Started",
    "In Progress",
    "Contacted",
    "Qualified",
    "Appointment",
    "Negotiating",
    "Converted",
  ];

  const handleRefresh = async () => {
    router.refresh();
  };

  const handleLeadsClick = () => {
    router.push("/leads");
  };

  const handleInventoryClick = () => {
    router.push("/inventory");
  };

  const handleDealsClick = () => {
    router.push("/deals");
  };

  const handleTestDrivesClick = () => {
    router.push("/test-drives");
  };

  const handleRevenueClick = () => {
    router.push("/invoices");
  };

  const handleCreateLead = () => {
    setIsNewLeadOpen(true);
  };

  const handleAddVehicle = () => {
    router.push("/inventory/new");
  };

  const handleScheduleTestDrive = () => {
    router.push("/test-drives");
  };

  const handleViewAllLeads = () => {
    router.push("/leads");
  };

  const now = new Date();
  const lastUpdated = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-elevation-2 p-4 sm:p-6 md:p-8 border border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent)]" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 flex-1">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-primary flex items-center justify-center shadow-elevation-3">
              <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
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

      <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
        <DialogContent className="max-w-[640px] w-[95vw]">
          <DialogHeader>
            <DialogTitle>New Lead</DialogTitle>
            <DialogDescription>
              Capture the customer details and lead information to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Full name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" type="tel" />
              <Input placeholder="Company (optional)" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Select defaultValue="Website">
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Phone">Phone</option>
                <option value="Marketplace">Marketplace</option>
              </Select>
              <Select defaultValue="Not Started">
                {kanbanStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <Select defaultValue="Unassigned">
                <option value="Unassigned">Unassigned</option>
                <option value="Agam Chawla">Agam Chawla</option>
                <option value="Kyle Pierce">Kyle Pierce</option>
                <option value="Amy Richards">Amy Richards</option>
              </Select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Vehicle interest" />
              <Input placeholder="Lead source details" />
            </div>
            <Input placeholder="Notes" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsNewLeadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsNewLeadOpen(false)}>Create Lead</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Two-Column: Lead Source + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
