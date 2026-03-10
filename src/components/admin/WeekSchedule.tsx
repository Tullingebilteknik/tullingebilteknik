"use client";

import type { BookingWithDetails, Mechanic } from "@/lib/types";
import { BookingCard } from "./BookingCard";

const HOURS = Array.from({ length: 11 }, (_, i) => 7 + i); // 07:00 – 17:00
const WEEKDAYS = ["Mån", "Tis", "Ons", "Tor", "Fre"];

interface WeekScheduleProps {
  weekStart: Date;
  bookings: BookingWithDetails[];
  mechanics: Mechanic[];
  onSlotClick: (date: string, time: string, mechanicId: string) => void;
  onBookingClick: (booking: BookingWithDetails) => void;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function WeekSchedule({
  weekStart,
  bookings,
  mechanics,
  onSlotClick,
  onBookingClick,
}: WeekScheduleProps) {
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const ROW_HEIGHT = 64; // px per hour
  const START_HOUR = 7;

  function getBookingsForDayMechanic(date: string, mechanicId: string) {
    return bookings.filter(
      (b) => b.scheduled_date === date && b.mechanic_id === mechanicId
    );
  }

  function getBookingStyle(booking: BookingWithDetails): React.CSSProperties {
    const startMin = timeToMinutes(booking.start_time) - START_HOUR * 60;
    const endMin = timeToMinutes(booking.end_time) - START_HOUR * 60;
    const top = (startMin / 60) * ROW_HEIGHT;
    const height = ((endMin - startMin) / 60) * ROW_HEIGHT;
    return { top: `${top}px`, height: `${Math.max(height, 24)}px` };
  }

  const totalColumns = mechanics.length * 5;

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      {/* Header with mechanic names + day columns */}
      <div className="border-b bg-slate-50">
        {mechanics.length > 1 && (
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${mechanics.length}, 1fr)` }}>
            <div />
            {mechanics.map((m) => (
              <div
                key={m.id}
                className="text-center py-2 text-xs font-semibold text-slate-700 border-l"
              >
                {m.name}
              </div>
            ))}
          </div>
        )}

        {/* Day headers */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `56px repeat(${totalColumns}, 1fr)`,
          }}
        >
          <div className="py-2 px-2 text-[10px] text-slate-400" />
          {mechanics.map((m) =>
            days.map((day, di) => {
              const isToday = formatDate(day) === formatDate(new Date());
              return (
                <div
                  key={`${m.id}-${di}`}
                  className={`py-2 text-center border-l ${
                    isToday ? "bg-amber-50" : ""
                  }`}
                >
                  <p className="text-[10px] font-medium text-slate-500 uppercase">
                    {WEEKDAYS[di]}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isToday ? "text-amber-700" : "text-slate-700"
                    }`}
                  >
                    {day.getDate()}/{day.getMonth() + 1}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Time grid */}
      <div className="relative overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `56px repeat(${totalColumns}, 1fr)`,
          }}
        >
          {HOURS.map((hour) => (
            <div key={`label-${hour}`} className="contents">
              {/* Time label */}
              <div
                className="border-t border-slate-100 px-2 flex items-start justify-end pt-1"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                <span className="text-[10px] font-mono text-slate-400">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>

              {/* Day cells for each mechanic */}
              {mechanics.map((m) =>
                days.map((day, di) => {
                  const dateStr = formatDate(day);
                  const timeStr = `${String(hour).padStart(2, "0")}:00`;
                  const isToday = dateStr === formatDate(new Date());

                  return (
                    <div
                      key={`${m.id}-${di}-${hour}`}
                      className={`border-t border-l border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors ${
                        isToday ? "bg-amber-50/30" : ""
                      }`}
                      style={{ height: `${ROW_HEIGHT}px` }}
                      onClick={() => onSlotClick(dateStr, timeStr, m.id)}
                    >
                      {/* Render bookings only on the first hour row */}
                      {hour === START_HOUR &&
                        getBookingsForDayMechanic(dateStr, m.id).map((b) => (
                          <BookingCard
                            key={b.id}
                            booking={b}
                            onClick={() => onBookingClick(b)}
                            style={getBookingStyle(b)}
                          />
                        ))}
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
