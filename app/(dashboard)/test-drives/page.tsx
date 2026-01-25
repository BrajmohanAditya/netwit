"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TestDriveStatus =
  | "Requested"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "No-Show";

interface TestDriveItem {
  id: string;
  date: string;
  time: string;
  customer: string;
  vehicle: string;
  staff: string;
  status: TestDriveStatus;
  interest: number;
  nextSteps: string;
}

interface TestDriveCalendarEvent {
  id: string;
  dayIndex: number;
  time: string;
  endTime: string;
  customer: string;
  vehicle: string;
  staff: string;
}

const testDrives: TestDriveItem[] = [
  {
    id: "td-1",
    date: "Jan 25, 2026",
    time: "9:30 AM",
    customer: "Amelia Brooks",
    vehicle: "2025 Audi Q5",
    staff: "Jamie Lee",
    status: "Scheduled",
    interest: 4,
    nextSteps: "Confirm license",
  },
  {
    id: "td-2",
    date: "Jan 25, 2026",
    time: "10:00 AM",
    customer: "Caleb Owens",
    vehicle: "2026 BMW X3",
    staff: "Alex Martinez",
    status: "Requested",
    interest: 3,
    nextSteps: "Send confirmation",
  },
  {
    id: "td-3",
    date: "Jan 25, 2026",
    time: "10:30 AM",
    customer: "Harper Sloan",
    vehicle: "2025 Lexus RX",
    staff: "Sam Patel",
    status: "In Progress",
    interest: 5,
    nextSteps: "Review trade-in",
  },
  {
    id: "td-4",
    date: "Jan 24, 2026",
    time: "2:00 PM",
    customer: "Noah Chen",
    vehicle: "2025 Tesla Model Y",
    staff: "Jamie Lee",
    status: "Completed",
    interest: 5,
    nextSteps: "Follow up offer",
  },
  {
    id: "td-5",
    date: "Jan 23, 2026",
    time: "11:00 AM",
    customer: "Sofia Patel",
    vehicle: "2025 Ford Explorer",
    staff: "Alex Martinez",
    status: "No-Show",
    interest: 1,
    nextSteps: "Reschedule",
  },
  {
    id: "td-6",
    date: "Jan 22, 2026",
    time: "4:30 PM",
    customer: "Mason Reed",
    vehicle: "2026 Honda CR-V",
    staff: "Sam Patel",
    status: "Cancelled",
    interest: 2,
    nextSteps: "Close record",
  },
];

const calendarEvents: TestDriveCalendarEvent[] = [
  {
    id: "cal-1",
    dayIndex: 1,
    time: "9:30",
    endTime: "10:00",
    customer: "John Smith",
    vehicle: "Ford Mustang",
    staff: "Agam",
  },
  {
    id: "cal-2",
    dayIndex: 2,
    time: "10:00",
    endTime: "10:30",
    customer: "Ava James",
    vehicle: "Audi Q5",
    staff: "Jamie",
  },
  {
    id: "cal-3",
    dayIndex: 3,
    time: "10:00",
    endTime: "10:30",
    customer: "Mason Reed",
    vehicle: "Tesla Model Y",
    staff: "Alex",
  },
];

const statusStyles: Record<
  TestDriveStatus,
  { label: string; className: string }
> = {
  Requested: {
    label: "Requested",
    className: "bg-yellow-100 text-yellow-900",
  },
  Scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-900",
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-purple-100 text-purple-900",
  },
  Completed: {
    label: "Completed",
    className: "bg-green-100 text-green-900",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-900",
  },
  "No-Show": {
    label: "No-Show",
    className: "bg-red-100 text-red-900",
  },
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function TestDrivesPage() {
  const [filters, setFilters] = useState({
    dateRange: "",
    status: "",
    vehicle: "",
    customer: "",
    staff: "",
  });
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [scheduleForm, setScheduleForm] = useState({
    customer: "",
    vehicle: "",
    lead: "",
    requestedDate: "",
    requestedTime: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: "1 hour",
    route: "Highway Test",
    assignedStaff: "",
    licenseNumber: "",
    licenseIssued: "",
    licenseExpires: "",
    licenseFront: "",
    licenseBack: "",
    insuranceVerified: false,
    insuranceProof: "",
    signature: "",
    contactMethod: "phone",
    specialRequirements: "",
    internalNotes: "",
    remindEmail: true,
    remindSms: true,
    remindStaff: true,
  });

  const calendarSlots = ["9:00", "9:30", "10:00", "10:30"];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const steps = [
    { number: 1, label: "Customer & Vehicle" },
    { number: 2, label: "Scheduling" },
    { number: 3, label: "Verification" },
    { number: 4, label: "Details" },
  ];

  const openScheduleModal = () => {
    setCurrentStep(1);
    setIsScheduleOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleOpen(false);
    setCurrentStep(1);
  };

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Test Drives</h1>
              <div className="text-sm text-muted-foreground">
                Stats: [Today: 3] [Week: 8] [Completed: 45] [No-Show: 5%]
              </div>
            </div>
            <Button variant="primary" size="md" onClick={openScheduleModal}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Select
              value={filters.dateRange}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: event.target.value,
                }))
              }
            >
              <option value="">Date Range</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </Select>
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
              <option value="Requested">Requested</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </Select>
            <Input
              placeholder="Vehicle"
              value={filters.vehicle}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  vehicle: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Customer"
              value={filters.customer}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  customer: event.target.value,
                }))
              }
            />
            <Select
              value={filters.staff}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  staff: event.target.value,
                }))
              }
            >
              <option value="">Staff</option>
              <option value="Jamie Lee">Jamie Lee</option>
              <option value="Alex Martinez">Alex Martinez</option>
              <option value="Sam Patel">Sam Patel</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="text-sm font-semibold text-muted-foreground">
            Complete Test Drive
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div>Ended: 3:00 PM (auto)</div>
              <div>Duration: 1 hour</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="td-end-odometer">End Odometer</Label>
                <Input id="td-end-odometer" placeholder="149,050" />
              </div>
              <div className="grid gap-2">
                <Label>Distance</Label>
                <div className="h-10 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground flex items-center">
                  25 km (calc)
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Customer Feedback</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Interest
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`feedback-star-${index}`}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="td-comments">Comments</Label>
                <textarea
                  id="td-comments"
                  className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="td-staff-notes">Staff Notes</Label>
                <textarea
                  id="td-staff-notes"
                  className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Next Steps</Label>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {[
                  "Schedule follow-up",
                  "Send quote",
                  "Another test drive",
                  "Convert to deal",
                  "No action",
                ].map((step) => (
                  <label key={step} className="flex items-center gap-2">
                    <input type="radio" name="td-next-steps" />
                    {step}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">
                Complete &amp; Create Follow-up
              </Button>
            </div>

            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="font-semibold text-slate-600">Actions:</div>
              <div>- Create follow-up task</div>
              <div>- Send thank-you email</div>
              <div>- Log in customer timeline</div>
              <div>- Update lead status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interest Level</TableHead>
                <TableHead>Next Steps</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testDrives.map((drive) => (
                <TableRow key={drive.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{drive.date}</div>
                    <div className="text-xs text-muted-foreground">
                      {drive.time}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {drive.customer}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-md bg-slate-100 text-xs text-slate-500 flex items-center justify-center">
                        thumb
                      </div>
                      <div className="text-sm">{drive.vehicle}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {initials(drive.staff)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{drive.staff}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "border border-transparent",
                        statusStyles[drive.status].className,
                      )}
                    >
                      {statusStyles[drive.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${drive.id}-star-${index}`}
                          className={cn(
                            "h-4 w-4",
                            index < drive.interest
                              ? "text-yellow-400 fill-current"
                              : "text-slate-300",
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {drive.nextSteps}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-muted-foreground">
              Week View: Jan 20-26
            </div>
            <div className="text-xs text-muted-foreground">
              Time slots (30-min)
            </div>
          </div>

          <div className="grid grid-cols-[70px_repeat(7,minmax(120px,1fr))] border rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-2 text-xs text-slate-400" />
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 border-l"
              >
                {day}
              </div>
            ))}

            {calendarSlots.map((slot) => (
              <div key={slot} className="contents">
                <div className="p-2 text-xs text-slate-400 border-t">
                  {slot}
                </div>
                {weekDays.map((_, dayIndex) => {
                  const slotEvents = calendarEvents.filter(
                    (event) =>
                      event.dayIndex === dayIndex && event.time === slot,
                  );

                  return (
                    <div
                      key={`${slot}-${dayIndex}`}
                      className="border-l border-t p-1 min-h-[52px]"
                    >
                      {slotEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm"
                        >
                          <div className="font-semibold text-slate-700">
                            {event.time}-{event.endTime}
                          </div>
                          <div>{event.customer}</div>
                          <div>{event.vehicle}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.staff}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            Drag to reschedule • Click to view details
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">
              Test Drive Workflow
            </div>
            <div className="text-xs text-muted-foreground">
              Before (1 hour before):
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-background p-4 space-y-4">
              <div className="text-sm font-semibold text-slate-700">
                Pre-Test Drive Checklist
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Vehicle inspected",
                  "Fuel >1/2 tank",
                  "License verified",
                  "Insurance confirmed",
                  "Documents signed",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <Checkbox />
                    {item}
                  </label>
                ))}
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span>Start odometer:</span>
                  <Input className="h-8 max-w-[120px]" />
                </div>
              </div>
              <Button variant="primary" size="sm">
                Mark as Ready
              </Button>
            </div>

            <div className="rounded-lg border bg-background p-4 space-y-4">
              <div className="text-sm font-semibold text-slate-700">During</div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="font-semibold text-slate-700">In Progress</div>
                <div>Started: 2:00 PM</div>
                <div>Start Odometer: 149,025 km</div>
                <div>Route: Highway Test</div>
                <div className="text-xs text-muted-foreground">
                  GPS Tracking (optional)
                </div>
              </div>
              <Button variant="primary" size="sm">
                Complete Test Drive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="text-sm font-semibold text-muted-foreground">
            Complete Test Drive
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div>Ended: 3:00 PM (auto)</div>
              <div>Duration: 1 hour</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="td-end-odometer">End Odometer</Label>
                <Input id="td-end-odometer" placeholder="149,050" />
              </div>
              <div className="grid gap-2">
                <Label>Distance</Label>
                <div className="h-10 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground flex items-center">
                  25 km (calc)
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Customer Feedback</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Interest
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`feedback-star-${index}`}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="td-comments">Comments</Label>
                <textarea
                  id="td-comments"
                  className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="td-staff-notes">Staff Notes</Label>
                <textarea
                  id="td-staff-notes"
                  className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Next Steps</Label>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {[
                  "Schedule follow-up",
                  "Send quote",
                  "Another test drive",
                  "Convert to deal",
                  "No action",
                ].map((step) => (
                  <label key={step} className="flex items-center gap-2">
                    <input type="radio" name="td-next-steps" />
                    {step}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">
                Complete &amp; Create Follow-up
              </Button>
            </div>

            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="font-semibold text-slate-600">Actions:</div>
              <div>- Create follow-up task</div>
              <div>- Send thank-you email</div>
              <div>- Log in customer timeline</div>
              <div>- Update lead status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Schedule Test Drive</DialogTitle>
            <DialogDescription>Step {currentStep} of 4</DialogDescription>
          </DialogHeader>

          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />

          {currentStep === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="td-customer">Customer</Label>
                <Input
                  id="td-customer"
                  placeholder="Search/Create"
                  value={scheduleForm.customer}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      customer: event.target.value,
                    }))
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Shows: Name, Phone, License status
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="td-vehicle">Vehicle</Label>
                <Input
                  id="td-vehicle"
                  placeholder="Search inventory"
                  value={scheduleForm.vehicle}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      vehicle: event.target.value,
                    }))
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Shows: Make/Model, Availability
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="td-lead">Lead</Label>
                <Input
                  id="td-lead"
                  placeholder="Optional link"
                  value={scheduleForm.lead}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      lead: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={closeScheduleModal}>
                  Cancel
                </Button>
                <Button onClick={() => setCurrentStep(2)}>Next →</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="td-requested-date">
                    Requested By Customer
                  </Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      id="td-requested-date"
                      type="date"
                      value={scheduleForm.requestedDate}
                      onChange={(event) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          requestedDate: event.target.value,
                        }))
                      }
                    />
                    <Input
                      type="time"
                      value={scheduleForm.requestedTime}
                      onChange={(event) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          requestedTime: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="td-scheduled-date">Actual Scheduled</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      id="td-scheduled-date"
                      type="date"
                      value={scheduleForm.scheduledDate}
                      onChange={(event) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          scheduledDate: event.target.value,
                        }))
                      }
                    />
                    <Input
                      type="time"
                      value={scheduleForm.scheduledTime}
                      onChange={(event) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          scheduledTime: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="td-duration">Duration</Label>
                  <Select
                    id="td-duration"
                    value={scheduleForm.duration}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        duration: event.target.value,
                      }))
                    }
                  >
                    <option value="30 min">30 min</option>
                    <option value="1 hour">1 hour</option>
                    <option value="90 min">90 min</option>
                    <option value="2 hours">2 hours</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="td-route">Route</Label>
                  <Select
                    id="td-route"
                    value={scheduleForm.route}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        route: event.target.value,
                      }))
                    }
                  >
                    <option value="Highway Test">Highway Test</option>
                    <option value="City Loop">City Loop</option>
                    <option value="Mixed Route">Mixed Route</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Availability Check</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Vehicle
                  available
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Conflict
                  at 3pm
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="td-staff">Assigned Staff</Label>
                <Select
                  id="td-staff"
                  value={scheduleForm.assignedStaff}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      assignedStaff: event.target.value,
                    }))
                  }
                >
                  <option value="">Select staff</option>
                  <option value="Jamie Lee">Jamie Lee</option>
                  <option value="Alex Martinez">Alex Martinez</option>
                  <option value="Sam Patel">Sam Patel</option>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                  ← Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>Next →</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="td-license-number">License #</Label>
                <Input
                  id="td-license-number"
                  value={scheduleForm.licenseNumber}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      licenseNumber: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="td-license-issued">Issued</Label>
                  <Input
                    id="td-license-issued"
                    type="date"
                    value={scheduleForm.licenseIssued}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        licenseIssued: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="td-license-expires">Expires</Label>
                  <Input
                    id="td-license-expires"
                    type="date"
                    value={scheduleForm.licenseExpires}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        licenseExpires: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Upload License</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    type="file"
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        licenseFront: event.target.files?.[0]?.name ?? "",
                      }))
                    }
                  />
                  <Input
                    type="file"
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        licenseBack: event.target.files?.[0]?.name ?? "",
                      }))
                    }
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Front | Back
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Insurance Verified</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={scheduleForm.insuranceVerified}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        insuranceVerified: event.target.checked,
                      }))
                    }
                  />
                  Insurance verified
                </div>
                <Input
                  type="file"
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      insuranceProof: event.target.files?.[0]?.name ?? "",
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="td-signature">Signature</Label>
                <Input
                  id="td-signature"
                  placeholder="Canvas or upload"
                  value={scheduleForm.signature}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      signature: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  ← Back
                </Button>
                <Button onClick={() => setCurrentStep(4)}>Next →</Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Method of Contact</Label>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {[
                    { label: "Phone", value: "phone" },
                    { label: "Email", value: "email" },
                    { label: "Walk-in", value: "walk-in" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="contact-method"
                        value={option.value}
                        checked={scheduleForm.contactMethod === option.value}
                        onChange={(event) =>
                          setScheduleForm((prev) => ({
                            ...prev,
                            contactMethod: event.target.value,
                          }))
                        }
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="td-special">Special Requirements</Label>
                <textarea
                  id="td-special"
                  className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={scheduleForm.specialRequirements}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      specialRequirements: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="td-internal">Internal Notes</Label>
                <textarea
                  id="td-internal"
                  className="min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={scheduleForm.internalNotes}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      internalNotes: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Reminders</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={scheduleForm.remindEmail}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        remindEmail: event.target.checked,
                      }))
                    }
                  />
                  Email 24h before
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={scheduleForm.remindSms}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        remindSms: event.target.checked,
                      }))
                    }
                  />
                  SMS 2h before
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={scheduleForm.remindStaff}
                    onChange={(event) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        remindStaff: event.target.checked,
                      }))
                    }
                  />
                  Email staff
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-2">
                <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                  ← Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={closeScheduleModal}>
                    Save
                  </Button>
                  <Button onClick={closeScheduleModal}>Confirm</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
