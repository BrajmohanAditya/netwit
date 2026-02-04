"use client";

import { useState } from "react";
import { Mail, MoreHorizontal, Phone, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

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

const kanbanStatuses = [
  "Not Started",
  "In Progress",
  "Contacted",
  "Qualified",
  "Appointment",
  "Negotiating",
  "Converted",
];

export default function LeadsPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  // const [leads] = useState<Lead[]>(mockLeads); // Removed mock data state
  const rawLeads = useQuery(api.leads.get);
  const createLead = useMutation(api.leads.create);
  const deleteLead = useMutation(api.leads.deleteLead);

  const leads: Doc<"leads">[] = rawLeads || [];

  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});
  const [selectedLeadId, setSelectedLeadId] = useState<Id<"leads"> | null>(
    null,
  );
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadSource, setNewLeadSource] = useState("Website");
  const [newLeadStatus, setNewLeadStatus] = useState("Not Started");
  const [newLeadAssigned, setNewLeadAssigned] = useState("Unassigned");
  const [newLeadVehicle, setNewLeadVehicle] = useState("");
  const [newLeadSourceDetails, setNewLeadSourceDetails] = useState("");
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterDate, setFilterDate] = useState("range");

  const clearFilters = () => {
    setSearchQuery("");
    setFilterSource("all");
    setFilterDate("range");
  };

  const filteredLeads = leads.filter((lead) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      (lead.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lead.email &&
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()));

    // Source filter
    const matchesSource =
      filterSource === "all" || lead.source === filterSource;

    // Date filter - Placeholder logic for now since "range" is default and we don't have complex date logic ready
    // You can implement actual date filtering here later
    const matchesDate = true;

    return matchesSearch && matchesSource && matchesDate;
  });

  const handleNewLead = () => {
    setNewLeadName("");
    setNewLeadEmail("");
    setNewLeadPhone("");
    setNewLeadCompany("");
    setNewLeadSource("Website");
    setNewLeadStatus("Not Started");
    setNewLeadAssigned("Unassigned");
    setNewLeadVehicle("");
    setNewLeadSourceDetails("");
    setNewLeadNotes("");
    setIsNewLeadOpen(true);
  };

  const handleCreateLead = async () => {
    await createLead({
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      company: newLeadCompany,
      source: newLeadSource,
      status: newLeadStatus,
      assignedTo:
        newLeadAssigned === "Unassigned" ? undefined : newLeadAssigned,
      vehicleInterest: newLeadVehicle,
      sourceDetails: newLeadSourceDetails,
      notes: newLeadNotes,
    });
    setIsNewLeadOpen(false);
  };

  const openLeadDetails = (leadId: Id<"leads">) => {
    setSelectedLeadId(leadId);
    setIsLeadModalOpen(true);
  };

  const selectedLead =
    filteredLeads.find((lead) => lead._id === selectedLeadId) || null;
  // Dynamic details derived from the lead object itself now
  const selectedDetails = selectedLead
    ? {
        name: selectedLead.name || "Unknown",
        phone: selectedLead.phone || "N/A",
        sourceLabel: selectedLead.source,
        vehicleLabel: selectedLead.interest_vehicle_id
          ? "Vehicle Interest"
          : "Vehicle TBD",
        assignedTo: selectedLead.assigned_to || "Unassigned",
        createdLabel: selectedLead.created_at
          ? new Date(selectedLead.created_at).toLocaleDateString()
          : "Unknown",
        priority: "medium" as const,
        email: selectedLead.email || "N/A",
        company: selectedLead.company || "Adaptus Auto",
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
              <Input
                placeholder="Full name"
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newLeadEmail}
                onChange={(e) => setNewLeadEmail(e.target.value)}
              />
              <Input
                placeholder="Phone"
                type="tel"
                value={newLeadPhone}
                onChange={(e) => setNewLeadPhone(e.target.value)}
              />
              <Input
                placeholder="Company (optional)"
                value={newLeadCompany}
                onChange={(e) => setNewLeadCompany(e.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Select
                value={newLeadSource}
                onChange={(e) => setNewLeadSource(e.target.value)}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Craigslist">Craigslist</option>
                <option value="Kijiji">Kijiji</option>
                <option value="Text Us">Text Us</option>
                <option value="Other">Other</option>
              </Select>
              <Select
                value={newLeadStatus}
                onChange={(e) => setNewLeadStatus(e.target.value)}
              >
                {kanbanStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <Select
                value={newLeadAssigned}
                onChange={(e) => setNewLeadAssigned(e.target.value)}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Agam Chawla">Agam Chawla</option>
                <option value="Kyle Pierce">Kyle Pierce</option>
                <option value="Amy Richards">Amy Richards</option>
              </Select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Vehicle interest"
                value={newLeadVehicle}
                onChange={(e) => setNewLeadVehicle(e.target.value)}
              />
              <Input
                placeholder="Lead source details"
                value={newLeadSourceDetails}
                onChange={(e) => setNewLeadSourceDetails(e.target.value)}
              />
            </div>
            <Input
              placeholder="Notes"
              value={newLeadNotes}
              onChange={(e) => setNewLeadNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsNewLeadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLead}>Create Lead</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="px-6 space-y-6">
        {/* Stats Row */}
        <LeadStats />

        {/* Filters and View Toggle */}
        <LeadFilters
          view={viewMode}
          onViewChange={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterSource={filterSource}
          setFilterSource={setFilterSource}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          onClearFilters={clearFilters}
        />

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
                  {filteredLeads.map((lead) => {
                    // Adapt the lead object for display
                    const details = {
                      name: lead.name,
                      phone: lead.phone || "N/A",
                      sourceLabel: lead.source,
                      vehicleLabel: "Vehicle TBD",
                      assignedTo: lead.assigned_to || "Unassigned",
                      createdLabel: new Date(
                        lead.created_at,
                      ).toLocaleDateString(),
                      priority: "low" as const,
                    };

                    const isOverdue = String(lead._id) === "1";
                    const nextFollowUp = isOverdue ? "Overdue" : "Tomorrow";
                    const leadScore = String(lead._id) === "1" ? 92 : 68;
                    const scoreColor =
                      leadScore >= 85
                        ? "bg-green-100 text-green-800"
                        : leadScore >= 70
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800";

                    const displayName =
                      editedNames[String(lead._id)] || details.name;

                    return (
                      <TableRow
                        key={lead._id}
                        className={isOverdue ? "bg-red-50/60" : ""}
                      >
                        <TableCell>
                          <Checkbox aria-label={`Select lead ${lead._id}`} />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {editingLeadId === String(lead._id) ? (
                              <Input
                                value={displayName}
                                onChange={(e) =>
                                  setEditedNames((prev) => ({
                                    ...prev,
                                    [String(lead._id)]: e.target.value,
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
                                onDoubleClick={() =>
                                  setEditingLeadId(String(lead._id))
                                }
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
                          <Badge variant="default" className="rounded-full">
                            {details.sourceLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-full">
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openLeadDetails(lead._id)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive text-red-600"
                                  onClick={() => deleteLead({ id: lead._id })}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                        {
                          filteredLeads.filter((l) => l.status === status)
                            .length
                        }
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                      {filteredLeads
                        .filter((l) => l.status === status)
                        .map((lead) => {
                          const details = {
                            name: lead.name,
                            phone: lead.phone || "N/A",
                            sourceLabel: lead.source,
                            vehicleLabel: "Vehicle TBD",
                            assignedTo: lead.assigned_to || "Unassigned",
                            createdLabel: new Date(
                              lead.created_at,
                            ).toLocaleDateString(),
                            priority: "low" as const,
                          };

                          return (
                            <div
                              key={lead._id}
                              className="cursor-pointer"
                              onClick={() => openLeadDetails(lead._id)}
                            >
                              <LeadCard
                                leadId={String(lead._id)}
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
        onDelete={(id) => deleteLead({ id })}
      />
    </div>
  );
}
