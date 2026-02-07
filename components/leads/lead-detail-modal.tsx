"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Trash2, Phone, Mail, MessageSquare, Calendar, ClipboardList } from "lucide-react";
import { toast } from "react-hot-toast";

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Doc<"leads"> | null;
  onDelete?: (id: Id<"leads">) => void;
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
  onDelete,
  details,
}: LeadDetailModalProps) {
  const createdLabel = details?.createdLabel || "2 days ago";
  const sourceLabel = details?.sourceLabel || lead?.source || "Source";

  const [logCallOpen, setLogCallOpen] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [sendSmsOpen, setSendSmsOpen] = useState(false);
  const [scheduleFollowUpOpen, setScheduleFollowUpOpen] = useState(false);
  const [scheduleTestDriveOpen, setScheduleTestDriveOpen] = useState(false);

  const [callNotes, setCallNotes] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [testDriveDate, setTestDriveDate] = useState("");

  const handleLogCall = () => {
    if (!callNotes.trim()) {
      toast.error("Please enter call notes");
      return;
    }
    toast.success("Call logged successfully");
    setCallNotes("");
    setLogCallOpen(false);
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please fill in email subject and body");
      return;
    }
    toast.success("Email sent successfully");
    setEmailSubject("");
    setEmailBody("");
    setSendEmailOpen(false);
  };

  const handleSendSms = () => {
    if (!smsMessage.trim()) {
      toast.error("Please enter SMS message");
      return;
    }
    toast.success("SMS sent successfully");
    setSmsMessage("");
    setSendSmsOpen(false);
  };

  const handleScheduleFollowUp = () => {
    if (!followUpDate) {
      toast.error("Please select a follow-up date");
      return;
    }
    toast.success("Follow-up scheduled successfully");
    setFollowUpDate("");
    setScheduleFollowUpOpen(false);
  };

  const handleScheduleTestDrive = () => {
    if (!testDriveDate) {
      toast.error("Please select a test drive date");
      return;
    }
    toast.success("Test drive scheduled successfully");
    setTestDriveDate("");
    setScheduleTestDriveOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw] max-h-[85vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Lead Details</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">
                  {sourceLabel}
                </Badge>
                <span>Created {createdLabel}</span>
              </div>
            </div>
            {lead && onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this lead?")) {
                    onDelete(lead._id);
                    onOpenChange(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lead
              </Button>
            )}
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
                <Button size="sm" onClick={() => setLogCallOpen(true)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Log Call
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setSendEmailOpen(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setSendSmsOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setScheduleFollowUpOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setScheduleTestDriveOpen(true)}>
                  <ClipboardList className="h-4 w-4 mr-2" />
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

        {/* Log Call Dialog */}
        <Dialog open={logCallOpen} onOpenChange={setLogCallOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Call Notes</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-lg min-h-[100px]"
                  placeholder="Enter call notes..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setLogCallOpen(false)}>Cancel</Button>
                <Button onClick={handleLogCall}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Send Email Dialog */}
        <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  className="mt-1"
                  placeholder="Email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-lg min-h-[150px]"
                  placeholder="Enter email body..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setSendEmailOpen(false)}>Cancel</Button>
                <Button onClick={handleSendEmail}>Send</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Send SMS Dialog */}
        <Dialog open={sendSmsOpen} onOpenChange={setSendSmsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send SMS</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-lg min-h-[100px]"
                  placeholder="Enter SMS message..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setSendSmsOpen(false)}>Cancel</Button>
                <Button onClick={handleSendSms}>Send</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Follow-up Dialog */}
        <Dialog open={scheduleFollowUpOpen} onOpenChange={setScheduleFollowUpOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Follow-up</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Follow-up Date</label>
                <Input
                  className="mt-1"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setScheduleFollowUpOpen(false)}>Cancel</Button>
                <Button onClick={handleScheduleFollowUp}>Schedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Test Drive Dialog */}
        <Dialog open={scheduleTestDriveOpen} onOpenChange={setScheduleTestDriveOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Test Drive</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Test Drive Date</label>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  value={testDriveDate}
                  onChange={(e) => setTestDriveDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setScheduleTestDriveOpen(false)}>Cancel</Button>
                <Button onClick={handleScheduleTestDrive}>Schedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
