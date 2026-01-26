"use client";

import { useState } from "react";
import { Mail, MoreHorizontal, Phone, Plus } from "lucide-react";
import type { Lead } from "@/types/leads";

import { PageHeader } from "@/components/page-header";
import { LeadStats } from "@/components/leads/lead-stats";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadCard } from "@/components/leads/lead-card";
import { LeadDetailModal } from "@/components/leads/lead-detail-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - Replace with actual data from Supabase
const mockLeads: Lead[] = [
  {
    id: "1",
    customer_id: "1",
    source: "Craigslist",
    status: "In Progress",
    interest_vehicle_id: "1",
    assigned_to: null,
    notes: "Interested in Honda Civic",
    lead_creation_date: new Date().toISOString(),
    last_engagement: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    customer_id: "2",
    source: "Kijiji",
    status: "Qualified",
    interest_vehicle_id: null,
    assigned_to: null,
    notes: null,
    lead_creation_date: new Date().toISOString(),
    last_engagement: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    customer_id: "3",
    source: "Website",
    status: "Not Started",
    interest_vehicle_id: null,
    assigned_to: null,
    notes: "Requesting quote for Ford F-150",
    lead_creation_date: new Date().toISOString(),
    last_engagement: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    customer_id: "4",
    source: "Referral",
    status: "Closed",
    interest_vehicle_id: "2",
    assigned_to: null,
    notes: "Purchased 2020 Toyota Camry",
    lead_creation_date: new Date().toISOString(),
    last_engagement: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const kanbanStatuses = [
  "Not Started",
  "In Progress",
  "Contacted",
  "Qualified",
  "Appointment",
  "Negotiating",
  "Converted",
];

const leadCardDetails: Record<
  string,
  {
    name: string;
    phone: string;
    sourceLabel: string;
    vehicleLabel?: string;
    assignedTo?: string;
    createdLabel?: string;
    priority?: "High" | "Medium" | "Low";
  }
> = {
  "1": {
    name: "John Smith",
    phone: "604-123-4567",
    sourceLabel: "Website",
    vehicleLabel: "2021 Ford F-150",
    assignedTo: "Agam Chawla",
    createdLabel: "2 days ago",
    priority: "High",
  },
  "2": {
    name: "Mia Patel",
    phone: "604-555-9182",
    sourceLabel: "Referral",
    vehicleLabel: "2019 Honda Civic",
    assignedTo: "Kyle Pierce",
    createdLabel: "5 hours ago",
    priority: "Medium",
  },
  "3": {
    name: "Leo Garcia",
    phone: "604-444-2231",
    sourceLabel: "Website",
    vehicleLabel: "2020 Toyota RAV4",
    assignedTo: "Unassigned",
    createdLabel: "Today",
    priority: "Low",
  },
  "4": {
    name: "Sofia Chen",
    phone: "604-777-0091",
    sourceLabel: "Referral",
    vehicleLabel: "2020 Toyota Camry",
    assignedTo: "Amy Richards",
    createdLabel: "Yesterday",
    priority: "Medium",
  },
};

export default function LeadsPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [leads] = useState<Lead[]>(mockLeads);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  const handleNewLead = () => {
    setIsNewLeadOpen(true);
  };

  const openLeadDetails = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsLeadModalOpen(true);
  };

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;
  const selectedDetails = selectedLeadId
    ? {
        ...leadCardDetails[selectedLeadId],
        email: "contact@example.com",
        company: "Adaptus Auto",
      }
    : undefined;

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Lead Center"
        action={{
          label: "New Lead",
          onClick: handleNewLead,
          icon: <Plus className="h-4 w-4" />,
        }}
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

      <div className="px-6 space-y-6">
        {/* Stats Row */}
        <LeadStats />

        {/* Filters and View Toggle */}
        <LeadFilters view={viewMode} onViewChange={setViewMode} />

        {/* Content Area */}
        <div className="min-h-[400px]">
          {viewMode === "table" ? (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox aria-label="Select all" />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle Interest</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Next Follow-up</TableHead>
                    <TableHead>Lead Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const details = leadCardDetails[lead.id] || {
                      name: `Lead ${lead.id}`,
                      phone: "604-000-0000",
                      sourceLabel: lead.source,
                      vehicleLabel: "Vehicle TBD",
                      assignedTo: "Unassigned",
                      createdLabel: new Date(
                        lead.lead_creation_date,
                      ).toLocaleDateString(),
                      priority: "low" as const,
                    };

                    const isOverdue = lead.id === "1";
                    const nextFollowUp = isOverdue ? "Overdue" : "Tomorrow";
                    const leadScore = lead.id === "1" ? 92 : 68;
                    const scoreColor =
                      leadScore >= 85
                        ? "bg-green-100 text-green-800"
                        : leadScore >= 70
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800";

                    const displayName = editedNames[lead.id] || details.name;

                    return (
                      <TableRow
                        key={lead.id}
                        className={isOverdue ? "bg-red-50/60" : ""}
                      >
                        <TableCell>
                          <Checkbox aria-label={`Select lead ${lead.id}`} />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {editingLeadId === lead.id ? (
                              <Input
                                value={displayName}
                                onChange={(e) =>
                                  setEditedNames((prev) => ({
                                    ...prev,
                                    [lead.id]: e.target.value,
                                  }))
                                }
                                onBlur={() => setEditingLeadId(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setEditingLeadId(null);
                                  }
                                }}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <button
                                className="text-sm font-semibold text-foreground hover:underline"
                                onDoubleClick={() => setEditingLeadId(lead.id)}
                              >
                                {displayName}
                              </button>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <a
                                href={`tel:${details.phone}`}
                                className="hover:underline"
                              >
                                {details.phone}
                              </a>
                              <span className="text-muted-foreground/50">
                                •
                              </span>
                              <a
                                href={`mailto:${details.name.toLowerCase().replace(" ", ".")}@example.com`}
                                className="hover:underline"
                              >
                                Email
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="blue" radius="pill">
                            {details.sourceLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="gray" radius="pill">
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-10 rounded bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              IMG
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {details.vehicleLabel || "Vehicle TBD"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px]">
                                {details.assignedTo
                                  ?.split(" ")
                                  .map((part) => part[0])
                                  .slice(0, 2)
                                  .join("") || "UA"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {details.assignedTo || "Unassigned"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {details.createdLabel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            2 days ago
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              isOverdue
                                ? "text-xs font-semibold text-red-600"
                                : "text-xs text-muted-foreground"
                            }
                          >
                            {nextFollowUp}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${scoreColor}`}
                          >
                            {leadScore}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2 opacity-60 hover:opacity-100 transition">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openLeadDetails(lead.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <span className="font-medium">Continues:</span>
                <span>Qualified → Appointment → Negotiating → Converted</span>
              </div>
              <div className="flex gap-4 h-[600px] overflow-x-auto pb-4">
                {kanbanStatuses.map((status) => (
                  <div
                    key={status}
                    className="bg-muted/30 rounded-lg p-3 min-w-[320px] flex flex-col h-full border"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        {status}
                      </h3>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                        {leads.filter((l) => l.status === status).length}
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                      {leads
                        .filter((l) => l.status === status)
                        .map((lead) => {
                          const details = leadCardDetails[lead.id] || {
                            name: `Lead ${lead.id}`,
                            phone: "604-000-0000",
                            sourceLabel: lead.source,
                            vehicleLabel: "Vehicle TBD",
                            assignedTo: "Unassigned",
                            createdLabel: new Date(
                              lead.lead_creation_date,
                            ).toLocaleDateString(),
                            priority: "low" as const,
                          };

                          return (
                            <div
                              key={lead.id}
                              className="cursor-pointer"
                              onClick={() => openLeadDetails(lead.id)}
                            >
                              <LeadCard
                                lead={lead}
                                name={details.name}
                                phone={details.phone}
                                sourceLabel={details.sourceLabel}
                                vehicleLabel={details.vehicleLabel}
                                assignedTo={details.assignedTo}
                                createdLabel={details.createdLabel}
                                priority={details.priority}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <LeadDetailModal
        open={isLeadModalOpen}
        onOpenChange={setIsLeadModalOpen}
        lead={selectedLead}
        details={selectedDetails}
      />
    </div>
  );
}
