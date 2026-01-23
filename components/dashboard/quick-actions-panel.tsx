"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface QuickActionsProps {
  onViewAllLeads?: () => void;
  onCreateLead?: () => void;
  onAddVehicle?: () => void;
  onScheduleTestDrive?: () => void;
}

export function QuickActionsPanel({
  onViewAllLeads,
  onCreateLead,
  onAddVehicle,
  onScheduleTestDrive,
}: QuickActionsProps) {
  return (
    <Card className="shadow-elevation-2 rounded-lg border border-gray-200 bg-white h-full">
      <CardHeader className="p-6 border-b border-gray-200 flex flex-row items-center gap-2">
        <Zap className="w-5 h-5 text-amber-500" />
        <CardTitle className="text-card-title font-semibold text-heading">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <Button
          onClick={onCreateLead}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          + New Lead
        </Button>
        <Button
          onClick={onAddVehicle}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          size="sm"
        >
          + Add Vehicle
        </Button>
        <Button
          onClick={onScheduleTestDrive}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          size="sm"
        >
          + Schedule Test Drive
        </Button>
        <Button
          onClick={onViewAllLeads}
          variant="outline"
          className="w-full"
          size="sm"
        >
          View All Leads
        </Button>
      </CardContent>
    </Card>
  );
}
