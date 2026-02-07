"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CalendarPage() {
  const convexEvents = useQuery(api.calendar.get) || [];
  const createEvent = useMutation(api.calendar.create);
  const deleteEvent = useMutation(api.calendar.deleteEvent);
  const updateEvent = useMutation(api.calendar.update);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map Convex events to CalendarEvent type
  const events: CalendarEvent[] = convexEvents.map((evt: any) => ({
    id: evt._id,
    title: evt.title,
    time: evt.startTime ? evt.startTime.toLowerCase() : "all day",
    type: evt.type as any,
    date: new Date(evt.date),
  }));

  const handleCreateEvent = async () => {
    if (!createForm.date) {
      alert("Please select a date");
      return;
    }
    setIsSubmitting(true);
    try {
      await createEvent({
        title:
          createForm.title || `${createForm.type} with ${createForm.customer}`,
        type: createForm.type,
        customer: createForm.customer,
        vehicle: createForm.vehicle,
        date: createForm.date,
        startTime: createForm.startTime,
        endTime: createForm.endTime,
        location: createForm.location,
        assignedTo: createForm.assignedTo,
        description: createForm.description,
        remindEmail: createForm.remindEmail,
        remindSms: createForm.remindSms,
      });
      setIsCreateOpen(false);
      setCreateForm({
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
    } catch (err) {
      console.error("Failed to create event", err);
      alert("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ id: id as any });
        setIsEventOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDrop = async (date: Date) => {
    if (!draggedEvent) return;
    
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    
    try {
      await updateEvent({
        id: draggedEvent.id as any,
        date: formattedDate,
      });
      setDraggedEvent(null);
    } catch (err) {
      console.error("Failed to update event", err);
    }
  };

  const openCreateModal = () => {
    const date = selectedDate || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
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
    return currentWeekStart;
  })();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    setCurrentWeekStart(date);
  };

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

      <div className="px-4 sm:px-6 space-y-6">
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground flex items-center justify-between w-full sm:w-auto">
              <span>Views:</span>
              <div className="inline-flex ml-2 rounded-md border bg-background p-1">
                {(["month", "week", "day"] as const).map((item) => (
                  <Button
                    key={item}
                    variant={view === item ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setView(item)}
                    className="capitalize text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground w-full sm:w-auto text-right sm:text-left">
              Current:{" "}
              <span className="font-semibold text-foreground">
                {(selectedDate || new Date()).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {view === "month" && (
            <div className="rounded-lg border bg-background overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0">
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
            </div>
          )}

          {view === "week" && (
            <div className="rounded-lg border bg-background overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Week Navigation Header */}
                <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextWeek}>
                      Next
                    </Button>
                  </div>
                  <div className="text-sm font-medium">
                    {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                    {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div className="grid grid-cols-[80px_repeat(7,minmax(120px,1fr))] border-b bg-slate-50 text-xs font-semibold text-slate-500">
                  <div className="p-2" />
                  {weekDays.map((day) => (
                    <div key={day.toDateString()} className="p-2 text-center">
                      <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className={`text-lg font-semibold ${day.toDateString() === new Date().toDateString() ? "text-primary" : ""}`}>
                        {day.getDate()}
                      </div>
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
                          className={`h-24 border-l px-2 py-1 ${draggedEvent ? "bg-blue-50" : ""}`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(day)}
                        >
                          {slotEvents.map((event) => (
                            <div
                              key={event.id}
                              draggable
                              onDragStart={() => handleDragStart(event)}
                              onClick={() => {
                                setActiveEvent(event);
                                setIsEventOpen(true);
                              }}
                              className={`w-full rounded border px-2 py-1 text-[11px] font-medium cursor-move mb-1 ${eventColor(event.type)}`}
                            >
                              {event.title}
                            </div>
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
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Type: {activeEvent.type.replace("-", " ")}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEventOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEvent(activeEvent.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
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
              <Button onClick={handleCreateEvent} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
