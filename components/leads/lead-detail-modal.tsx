"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/leads";

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  details?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    sourceLabel?: string;
    createdLabel?: string;
    assignedTo?: string;
    priority?: "high" | "medium" | "low";
  };
}

export function LeadDetailModal({
  open,
  onOpenChange,
  lead,
  details,
}: LeadDetailModalProps) {
  const createdLabel = details?.createdLabel || "2 days ago";
  const sourceLabel = details?.sourceLabel || lead?.source || "Source";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw]">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Lead Details</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="blue" radius="pill">
                  {sourceLabel}
                </Badge>
                <span>Created {createdLabel}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Customer Details
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder="Name" defaultValue={details?.name} />
                  <Input placeholder="Email" defaultValue={details?.email} />
                  <Input placeholder="Phone" defaultValue={details?.phone} />
                  <Input
                    placeholder="Company"
                    defaultValue={details?.company}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">
                    Link Existing Customer
                  </Button>
                  <Button variant="ghost" size="sm">
                    Create New Customer
                  </Button>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Lead Details
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <Select defaultValue={lead?.status || "Not Started"}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Converted">Converted</option>
                  </Select>
                  <Select defaultValue={details?.priority || "medium"}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                  <Input placeholder="Source" defaultValue={sourceLabel} />
                  <Input placeholder="Lead Score" defaultValue="82" />
                  <Select defaultValue={details?.assignedTo || "Unassigned"}>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Agam Chawla">Agam Chawla</option>
                    <option value="Kyle Pierce">Kyle Pierce</option>
                  </Select>
                  <Input placeholder="Tags (comma separated)" />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Lead Scoring (Auto-calculated)
                </h3>
                <div className="rounded-lg border bg-muted/20 p-4 space-y-3 text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground">Base: 0</div>
                  <ul className="space-y-1">
                    <li>+20: Has email</li>
                    <li>+20: Has phone</li>
                    <li>+30: Vehicle from inventory</li>
                    <li>+10: Budget specified</li>
                    <li>+15: Contacted &lt;24h</li>
                    <li>+25: Responded</li>
                    <li>+20: Scheduled appointment</li>
                  </ul>
                  <ul className="space-y-1 pt-2">
                    <li>-10: No response after 3 attempts</li>
                    <li>-20: Overdue &gt;7 days</li>
                  </ul>
                  <div className="pt-3">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">
                      Display
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        0-30: Cold
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-2 py-1 text-xs text-yellow-700">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        31-60: Warm
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        61-100: Hot
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Vehicle Interest
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder="Search inventory" />
                  <Input placeholder="Or specify preferences" />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Initial Contact
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <Select defaultValue="Phone">
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </Select>
                  <Input placeholder="Message" />
                  <Input placeholder="Next Follow-up" type="date" />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Timeline
                </h3>
                <div className="space-y-2">
                  {[
                    "Call: 6 min – asked about pricing",
                    "Email: Quote sent – opened",
                    "SMS: Test drive request – delivered",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Log Call</Button>
                <Button size="sm" variant="secondary">
                  Send Email
                </Button>
                <Button size="sm" variant="secondary">
                  Send SMS
                </Button>
                <Button size="sm" variant="ghost">
                  Schedule Follow-up
                </Button>
                <Button size="sm" variant="ghost">
                  Schedule Test Drive
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-3">
              <div className="space-y-2">
                {[
                  "Lead created",
                  "Status changed: Not Started → In Progress",
                  "Assigned to Agam Chawla",
                  "Email opened – 2 times",
                ].map((event) => (
                  <div
                    key={event}
                    className={cn(
                      "rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground",
                    )}
                  >
                    {event}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <div className="rounded-md border bg-yellow-50 p-3 text-sm text-yellow-900">
                  Pinned: Customer prefers weekend appointments.
                </div>
                <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                  Jan 24 – Followed up about financing options.
                </div>
                <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                  Jan 22 – Initial inquiry about availability.
                </div>
              </div>
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-md border border-input bg-background p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={4}
                  placeholder="Add a note..."
                />
                <div className="flex gap-2">
                  <Button size="sm">Add Note</Button>
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
