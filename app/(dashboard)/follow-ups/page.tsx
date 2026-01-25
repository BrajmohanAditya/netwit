"use client";

import { useState } from "react";
import { Calendar, Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const followUps: FollowUpItem[] = [
  {
    id: "fu-1",
    customer: "Amelia Brooks",
    lead: "2025 Audi Q5",
    dueDate: "Jan 25, 2026",
    time: "10:00 AM",
    channel: "Call",
    assignedTo: "Jamie Lee",
    status: "Due",
    priority: "High",
    notes: "Confirm test drive availability",
  },
  {
    id: "fu-2",
    customer: "Caleb Owens",
    lead: "2026 BMW X3",
    dueDate: "Jan 25, 2026",
    time: "2:00 PM",
    channel: "Email",
    assignedTo: "Alex Martinez",
    status: "Scheduled",
    priority: "Medium",
    notes: "Send pricing proposal",
  },
  {
    id: "fu-3",
    customer: "Harper Sloan",
    lead: "2025 Lexus RX",
    dueDate: "Jan 24, 2026",
    time: "4:00 PM",
    channel: "SMS",
    assignedTo: "Sam Patel",
    status: "Completed",
    priority: "Low",
    notes: "Post-drive feedback",
  },
  {
    id: "fu-4",
    customer: "Noah Chen",
    lead: "2025 Tesla Model Y",
    dueDate: "Jan 23, 2026",
    time: "11:30 AM",
    channel: "Visit",
    assignedTo: "Jamie Lee",
    status: "Overdue",
    priority: "High",
    notes: "Trade-in appraisal pending",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function FollowUpsPage() {
  const [filters, setFilters] = useState({
    status: "",
    channel: "",
    assigned: "",
    search: "",
  });

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
            <Button variant="primary" size="md">
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
        {[
          { label: "Due Today", value: 6, accent: "bg-yellow-50" },
          { label: "Scheduled", value: 14, accent: "bg-blue-50" },
          { label: "Completed", value: 42, accent: "bg-green-50" },
          { label: "Overdue", value: 3, accent: "bg-red-50" },
        ].map((stat) => (
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
              {followUps.map((followUp) => (
                <TableRow key={followUp.id}>
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
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Complete
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
