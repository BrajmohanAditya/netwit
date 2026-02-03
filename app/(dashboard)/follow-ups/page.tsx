"use client";

import { useMemo, useState } from "react";
import { Calendar, Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const followUpStatuses = {
  Due: "bg-yellow-100 text-yellow-900",
  Scheduled: "bg-blue-100 text-blue-900",
  Completed: "bg-green-100 text-green-900",
  Overdue: "bg-red-100 text-red-900",
};

type FollowUpStatus = keyof typeof followUpStatuses;

type FollowUpChannel = "Call" | "Email" | "SMS" | "Visit";

interface FollowUpItem {
  id: string;
  customer: string;
  lead: string;
  dueDate: string;
  time: string;
  channel: FollowUpChannel;
  assignedTo: string;
  status: FollowUpStatus;
  priority: "High" | "Medium" | "Low";
  notes: string;
}

type NewFollowUpState = Omit<FollowUpItem, "id">;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function FollowUpsPage() {
  const followUpsQuery = useQuery(api.followUps.get);
  const createFollowUp = useMutation(api.followUps.create);
  const deleteFollowUp = useMutation(api.followUps.deleteFollowUp);
  const updateStatus = useMutation(api.followUps.updateStatus);
  const followUps = useMemo(() => followUpsQuery ?? [], [followUpsQuery]);
  const [filters, setFilters] = useState({
    status: "",
    channel: "",
    assigned: "",
    search: "",
  });
  const [isNewFollowUpOpen, setIsNewFollowUpOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] =
    useState<Doc<"followUps"> | null>(null);
  const [newFollowUp, setNewFollowUp] = useState<NewFollowUpState>({
    customer: "",
    lead: "",
    dueDate: "",
    time: "",
    channel: "Call" as FollowUpChannel,
    assignedTo: "Jamie Lee",
    priority: "Medium",
    notes: "",
    status: "Scheduled" as FollowUpStatus,
  });

  const filteredFollowUps = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return followUps.filter((followUp) => {
      if (filters.status && followUp.status !== filters.status) return false;
      if (filters.channel && followUp.channel !== filters.channel) return false;
      if (filters.assigned && followUp.assignedTo !== filters.assigned)
        return false;
      if (!search) return true;
      return (
        followUp.customer.toLowerCase().includes(search) ||
        followUp.lead.toLowerCase().includes(search)
      );
    });
  }, [filters, followUps]);

  const stats = useMemo(() => {
    const counts = {
      Due: 0,
      Scheduled: 0,
      Completed: 0,
      Overdue: 0,
    };

    followUps.forEach((followUp) => {
      if (followUp.status in counts) {
        counts[followUp.status as keyof typeof counts] += 1;
      }
    });

    return [
      { label: "Due Today", value: counts.Due, accent: "bg-yellow-50" },
      { label: "Scheduled", value: counts.Scheduled, accent: "bg-blue-50" },
      { label: "Completed", value: counts.Completed, accent: "bg-green-50" },
      { label: "Overdue", value: counts.Overdue, accent: "bg-red-50" },
    ];
  }, [followUps]);

  const handleDelete = async (id: Doc<"followUps">["_id"]) => {
    if (confirm("Are you sure you want to delete this follow-up?")) {
      await deleteFollowUp({ id });
      if (selectedFollowUp?._id === id) setSelectedFollowUp(null);
    }
  };

  const handleComplete = async (id: Doc<"followUps">["_id"]) => {
    await updateStatus({ id, status: "Completed" });
  };

  const handleCreateFollowUp = async () => {
    if (!newFollowUp.customer.trim() || !newFollowUp.lead.trim()) {
      alert("Customer and lead are required.");
      return;
    }

    await createFollowUp({
      customer: newFollowUp.customer.trim(),
      lead: newFollowUp.lead.trim(),
      dueDate: newFollowUp.dueDate || "TBD",
      time: newFollowUp.time || "TBD",
      channel: newFollowUp.channel,
      assignedTo: newFollowUp.assignedTo,
      status: newFollowUp.status,
      priority: newFollowUp.priority,
      notes: newFollowUp.notes.trim() || "No notes",
    });

    setIsNewFollowUpOpen(false);
    setNewFollowUp({
      customer: "",
      lead: "",
      dueDate: "",
      time: "",
      channel: "Call",
      assignedTo: "Jamie Lee",
      priority: "Medium",
      notes: "",
      status: "Scheduled",
    });
  };

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Follow-ups</h1>
              <div className="text-sm text-muted-foreground">
                Track, schedule, and complete customer follow-ups.
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsNewFollowUpOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Follow-up
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search customer or lead"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
            />
            <Select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value,
                }))
              }
            >
              <option value="">Status</option>
              {Object.keys(followUpStatuses).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Select
              value={filters.channel}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  channel: event.target.value,
                }))
              }
            >
              <option value="">Channel</option>
              {["Call", "Email", "SMS", "Visit"].map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </Select>
            <Select
              value={filters.assigned}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  assigned: event.target.value,
                }))
              }
            >
              <option value="">Assigned</option>
              {["Jamie Lee", "Alex Martinez", "Sam Patel"].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className={cn("space-y-2", stat.accent)}>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-2xl font-semibold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isNewFollowUpOpen} onOpenChange={setIsNewFollowUpOpen}>
        <DialogContent className="max-w-[640px] w-[95vw]">
          <DialogHeader>
            <DialogTitle>New Follow-up</DialogTitle>
            <DialogDescription>
              Schedule a follow-up and assign it to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Customer name"
                value={newFollowUp.customer}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    customer: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Lead / Vehicle"
                value={newFollowUp.lead}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    lead: event.target.value,
                  }))
                }
              />
              <Input
                type="date"
                placeholder="Due date"
                value={newFollowUp.dueDate}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    dueDate: event.target.value,
                  }))
                }
              />
              <Input
                type="time"
                placeholder="Time"
                value={newFollowUp.time}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    time: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Select
                value={newFollowUp.channel}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    channel: event.target.value as FollowUpChannel,
                  }))
                }
              >
                {(["Call", "Email", "SMS", "Visit"] as FollowUpChannel[]).map(
                  (channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ),
                )}
              </Select>
              <Select
                value={newFollowUp.priority}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    priority: event.target.value as "High" | "Medium" | "Low",
                  }))
                }
              >
                {(["High", "Medium", "Low"] as const).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Select>
              <Select
                value={newFollowUp.assignedTo}
                onChange={(event) =>
                  setNewFollowUp((prev) => ({
                    ...prev,
                    assignedTo: event.target.value,
                  }))
                }
              >
                {["Jamie Lee", "Alex Martinez", "Sam Patel"].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              placeholder="Notes"
              value={newFollowUp.notes}
              onChange={(event) =>
                setNewFollowUp((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsNewFollowUpOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFollowUp}>Create Follow-up</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedFollowUp}
        onOpenChange={(open) => !open && setSelectedFollowUp(null)}
      >
        <DialogContent className="max-w-[600px] w-[95vw]">
          <DialogHeader>
            <DialogTitle>Follow-up Details</DialogTitle>
            <DialogDescription>
              View details for this interaction.
            </DialogDescription>
          </DialogHeader>
          {selectedFollowUp && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Customer
                  </div>
                  <div className="font-semibold text-lg">
                    {selectedFollowUp.customer}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <Badge
                    className={cn(
                      "border border-transparent",
                      followUpStatuses[
                        selectedFollowUp.status as FollowUpStatus
                      ],
                    )}
                  >
                    {selectedFollowUp.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Lead Interest
                  </div>
                  <div>{selectedFollowUp.lead}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {initials(selectedFollowUp.assignedTo)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedFollowUp.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    Due Date
                  </div>
                  <div className="font-medium text-sm">
                    {selectedFollowUp.dueDate}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    Time
                  </div>
                  <div className="font-medium text-sm">
                    {selectedFollowUp.time}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    Channel
                  </div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {selectedFollowUp.channel}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Notes
                </div>
                <div className="p-4 rounded-md border text-sm bg-white">
                  {selectedFollowUp.notes}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFollowUp(null)}
                >
                  Close
                </Button>
                <Button onClick={() => handleComplete(selectedFollowUp._id)}>
                  Mark Complete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFollowUps.map((followUp) => (
                <TableRow key={followUp._id}>
                  <TableCell className="font-medium">
                    {followUp.customer}
                  </TableCell>
                  <TableCell>{followUp.lead}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {followUp.dueDate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {followUp.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      {followUp.channel === "Call" && (
                        <Phone className="h-4 w-4 text-blue-600" />
                      )}
                      {followUp.channel === "Email" && (
                        <Mail className="h-4 w-4 text-indigo-600" />
                      )}
                      {followUp.channel === "SMS" && (
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                      )}
                      {followUp.channel === "Visit" && (
                        <Calendar className="h-4 w-4 text-emerald-600" />
                      )}
                      {followUp.channel}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {initials(followUp.assignedTo)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{followUp.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "border border-transparent",
                        followUpStatuses[followUp.status],
                      )}
                    >
                      {followUp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {followUp.notes}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFollowUp(followUp)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleComplete(followUp._id)}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(followUp._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
