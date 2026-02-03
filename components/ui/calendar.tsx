import * as React from "react";
import { cn } from "@/lib/utils";

export type CalendarEventType =
  | "test-drive"
  | "appointment"
  | "call"
  | "follow-up"
  | "delivery"
  | "invoice";

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: CalendarEventType;
  date: Date;
}

interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  events?: CalendarEvent[];
  maxVisibleEvents?: number;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  onDayClick,
  onEventClick,
  events = [],
  maxVisibleEvents = 3,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected || new Date(),
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const eventMap = React.useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((event) => {
      if (
        event.date.getFullYear() === currentMonth.getFullYear() &&
        event.date.getMonth() === currentMonth.getMonth()
      ) {
        const day = event.date.getDate();
        const existing = map.get(day) || [];
        map.set(day, [...existing, event]);
      }
    });
    return map;
  }, [events, currentMonth]);

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    if (disabled && disabled(date)) return;
    onSelect?.(date);
    onDayClick?.(date);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return disabled ? disabled(date) : false;
  };

  const eventTypeClass = (type: CalendarEventType) => {
    switch (type) {
      case "test-drive":
        return "bg-yellow-400";
      case "appointment":
        return "bg-blue-500";
      case "call":
        return "bg-purple-500";
      case "follow-up":
        return "bg-purple-500";
      case "delivery":
        return "bg-green-500";
      case "invoice":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            )
          }
          className="p-1 hover:bg-slate-100 rounded"
        >
          ←
        </button>
        <div className="font-medium">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
            )
          }
          className="p-1 hover:bg-slate-100 rounded"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-28" />
        ))}
        {days.map((day) => {
          const dayEvents = eventMap.get(day) || [];
          const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
          const hiddenCount = dayEvents.length - visibleEvents.length;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled(day)}
              className={cn(
                "h-28 w-full rounded-md border border-slate-100 bg-white px-2 py-1 text-left text-sm transition-colors",
                isSelected(day)
                  ? "ring-2 ring-teal-500 bg-teal-50"
                  : isDisabled(day)
                    ? "text-slate-300 cursor-not-allowed bg-slate-50"
                    : "hover:bg-slate-50",
              )}
            >
              <div className="text-xs font-semibold text-slate-700">{day}</div>
              <div className="mt-1 space-y-1">
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    onClick={(eventClick) => {
                      eventClick.stopPropagation();
                      onEventClick?.(event);
                    }}
                    onKeyDown={(eventKey) => {
                      if (eventKey.key === "Enter" || eventKey.key === " ") {
                        eventKey.preventDefault();
                        eventKey.stopPropagation();
                        onEventClick?.(event);
                      }
                    }}
                    className="flex w-full items-center gap-2 text-[11px] text-slate-600 hover:text-slate-900"
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        eventTypeClass(event.type),
                      )}
                    />
                    <span className="truncate">
                      {event.title}: {event.time}
                    </span>
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <div className="text-[11px] text-slate-400">
                    +{hiddenCount} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
