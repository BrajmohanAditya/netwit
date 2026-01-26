"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarEvent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "test-drive",
    title: "",
    customer: "",
    vehicle: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    assignedTo: "",
    description: "",
    remindEmail: true,
    remindSms: true,
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "evt-jan-15-1",
      title: "Test",
      time: "10am",
      type: "test-drive",
      date: new Date(2026, 0, 15),
    },
    {
      id: "evt-jan-15-2",
      title: "Appt",
      time: "2pm",
      type: "appointment",
      date: new Date(2026, 0, 15),
    },
    {
      id: "evt-jan-15-3",
      title: "Call",
      time: "4pm",
      type: "call",
      date: new Date(2026, 0, 15),
    },
    {
      id: "evt-jan-15-4",
      title: "Follow-up",
      time: "5pm",
      type: "follow-up",
      date: new Date(2026, 0, 15),
    },
    {
      id: "evt-jan-15-5",
      title: "Invoice",
      time: "6pm",
      type: "invoice",
      date: new Date(2026, 0, 15),
    },
  ]);

  const openCreateModal = () => {
    const date = selectedDate || new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setCreateForm((prev) => ({
      ...prev,
      date: formattedDate,
      startTime: "",
      endTime: "",
      title: "",
      customer: "",
      vehicle: "",
      location: "",
      assignedTo: "",
      description: "",
    }));
    setIsCreateOpen(true);
  };

  const durationLabel = (() => {
    if (!createForm.startTime || !createForm.endTime) return "--";
    const [startHour, startMinute] = createForm.startTime.split(":");
    const [endHour, endMinute] = createForm.endTime.split(":");
    const start = Number(startHour) * 60 + Number(startMinute);
    const end = Number(endHour) * 60 + Number(endMinute);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "--";
    const totalMinutes = end - start;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    }
    if (hours > 0) {
      return `${hours} hr`;
    }
    return `${minutes} min`;
  })();

  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const baseHour = 9 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const hour = baseHour > 12 ? baseHour - 12 : baseHour;
    return `${hour}:${minutes}`;
  });

  const weekStart = (() => {
    const anchor = selectedDate || new Date();
    const date = new Date(anchor);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  })();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const normalizeTime = (value: string) => {
    const match = value.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
    if (!match) return value;
    const rawHour = Number(match[1]);
    const minutes = match[2] ?? "00";
    const meridiem = match[3].toLowerCase();
    const hour = meridiem === "pm" && rawHour !== 12 ? rawHour - 12 : rawHour;
    return `${hour}:${minutes.padStart(2, "0")}`;
  };

  const eventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "test-drive":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "appointment":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "call":
      case "follow-up":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivery":
        return "bg-green-100 text-green-700 border-green-200";
      case "invoice":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const currentLabel = (selectedDate || new Date()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Calendar"
        action={{
          label: "New Event",
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="px-6 space-y-6">
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Views:
              <div className="inline-flex ml-2 rounded-md border bg-background p-1">
                {(["month", "week", "day"] as const).map((item) => (
                  <Button
                    key={item}
                    variant={view === item ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setView(item)}
                    className="capitalize"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Current:{" "}
              <span className="font-semibold text-foreground">
                {currentLabel}
              </span>
            </div>
          </div>

          {view === "month" && (
            <div className="rounded-lg border bg-background">
              <Calendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                onDayClick={(date) => {
                  setSelectedDate(date);
                  setView("day");
                }}
                onEventClick={(event) => {
                  setActiveEvent(event);
                  setIsEventOpen(true);
                }}
                events={events}
                maxVisibleEvents={3}
                className="w-full"
              />
            </div>
          )}

          {view === "week" && (
            <div className="rounded-lg border bg-background overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[80px_repeat(7,minmax(120px,1fr))] border-b bg-slate-50 text-xs font-semibold text-slate-500">
                  <div className="p-2" />
                  {weekDays.map((day) => (
                    <div key={day.toDateString()} className="p-2 text-center">
                      {day.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  ))}
                </div>
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className="grid grid-cols-[80px_repeat(7,minmax(120px,1fr))] border-b last:border-b-0"
                  >
                    <div className="p-2 text-xs text-slate-400">{slot}</div>
                    {weekDays.map((day) => {
                      const slotEvents = events.filter((event) => {
                        const sameDay =
                          event.date.toDateString() === day.toDateString();
                        return sameDay && normalizeTime(event.time) === slot;
                      });

                      return (
                        <div
                          key={`${day.toDateString()}-${slot}`}
                          className="h-12 border-l px-2 py-1"
                        >
                          {slotEvents.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => {
                                setActiveEvent(event);
                                setIsEventOpen(true);
                              }}
                              className={`w-full rounded border px-2 py-1 text-[11px] font-medium ${eventColor(event.type)}`}
                            >
                              {event.title}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Drag events to reschedule
              </div>
            </div>
          )}

          {view === "day" && (
            <div className="rounded-lg border bg-background p-4">
              <div className="text-sm font-semibold text-slate-600">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }) ?? "Select a day"}
              </div>
              <div className="mt-3 space-y-2">
                {events
                  .filter(
                    (event) =>
                      selectedDate &&
                      event.date.toDateString() === selectedDate.toDateString(),
                  )
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setActiveEvent(event);
                        setIsEventOpen(true);
                      }}
                      className={`flex w-full items-center justify-between rounded border px-3 py-2 text-sm ${eventColor(event.type)}`}
                    >
                      <span>{event.title}</span>
                      <span>{event.time}</span>
                    </button>
                  ))}
                {events.filter(
                  (event) =>
                    selectedDate &&
                    event.date.toDateString() === selectedDate.toDateString(),
                ).length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No events scheduled.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">
              Event Types
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-400" /> Test
                Drives
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />{" "}
                Appointments
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-500" />{" "}
                Follow-ups
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />{" "}
                Deliveries
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" /> Invoices
                Due
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{activeEvent?.title ?? "Event"}</DialogTitle>
            <DialogDescription>
              {activeEvent
                ? `${activeEvent.time} • ${activeEvent.date.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {activeEvent && (
            <div className="text-sm text-muted-foreground">
              Type: {activeEvent.type.replace("-", " ")}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Add a new event to the calendar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-type">Type</Label>
              <Select
                id="event-type"
                value={createForm.type}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    type: event.target.value,
                  }))
                }
              >
                <option value="test-drive">Test Drive</option>
                <option value="appointment">Appointment</option>
                <option value="follow-up">Follow-up</option>
                <option value="delivery">Delivery</option>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={createForm.title}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-customer">Customer</Label>
              <Input
                id="event-customer"
                placeholder="Search"
                value={createForm.customer}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    customer: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-vehicle">Vehicle</Label>
              <Input
                id="event-vehicle"
                placeholder="Search if applicable"
                value={createForm.vehicle}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    vehicle: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={createForm.date}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-start">Start Time</Label>
                <Input
                  id="event-start"
                  type="time"
                  value={createForm.startTime}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      startTime: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-end">End Time</Label>
                <Input
                  id="event-end"
                  type="time"
                  value={createForm.endTime}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      endTime: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Duration</Label>
                <div className="h-10 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground flex items-center">
                  {durationLabel}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={createForm.location}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-assigned">Assigned To</Label>
                <Select
                  id="event-assigned"
                  value={createForm.assignedTo}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      assignedTo: event.target.value,
                    }))
                  }
                >
                  <option value="">Select user</option>
                  <option value="alex">Alex Martinez</option>
                  <option value="jamie">Jamie Lee</option>
                  <option value="sam">Sam Patel</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Input
                id="event-description"
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Reminders</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={createForm.remindEmail}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      remindEmail: e.target.checked,
                    }))
                  }
                />
                Email 24h before
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={createForm.remindSms}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      remindSms: e.target.checked,
                    }))
                  }
                />
                SMS 2h before
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!createForm.date || !createForm.title) {
                    setIsCreateOpen(false);
                    return;
                  }
                  const newEventDate = new Date(`${createForm.date}T00:00:00`);
                  const displayTime = createForm.startTime
                    ? new Date(
                        `1970-01-01T${createForm.startTime}:00`,
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "";
                  setEvents((prev) => [
                    ...prev,
                    {
                      id: `evt-${Date.now()}`,
                      title: createForm.title,
                      time: displayTime || "",
                      type: createForm.type as CalendarEvent["type"],
                      date: newEventDate,
                    },
                  ]);
                  setIsCreateOpen(false);
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
