"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Mechanic, BookingWithDetails } from "@/lib/types";
import { WeekSchedule } from "@/components/admin/WeekSchedule";
import { BookingDialog } from "@/components/admin/BookingDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function AdminSchemaPage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [defaultDate, setDefaultDate] = useState("");
  const [defaultTime, setDefaultTime] = useState("");
  const [defaultMechanicId, setDefaultMechanicId] = useState("");

  const supabase = createClient();

  const loadData = useCallback(async () => {
    const weekEnd = addDays(weekStart, 4);

    const [{ data: mechs }, { data: bks }] = await Promise.all([
      supabase
        .from("mechanics")
        .select("*")
        .eq("is_active", true)
        .order("name"),
      supabase
        .from("bookings")
        .select(
          "*, lead:leads(id, name, email, phone, reg_number, car_model, selected_services, service_interest, status), mechanic:mechanics(id, name)"
        )
        .gte("scheduled_date", formatDateISO(weekStart))
        .lte("scheduled_date", formatDateISO(weekEnd)),
    ]);

    if (mechs) setMechanics(mechs);
    if (bks) setBookings(bks as BookingWithDetails[]);
  }, [weekStart]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleSlotClick(date: string, time: string, mechanicId: string) {
    setSelectedBooking(null);
    setDefaultDate(date);
    setDefaultTime(time);
    setDefaultMechanicId(mechanicId);
    setDialogOpen(true);
  }

  function handleBookingClick(booking: BookingWithDetails) {
    setSelectedBooking(booking);
    setDefaultDate("");
    setDefaultTime("");
    setDefaultMechanicId("");
    setDialogOpen(true);
  }

  function handleNewBooking() {
    setSelectedBooking(null);
    setDefaultDate(formatDateISO(new Date()));
    setDefaultTime("08:00");
    setDefaultMechanicId(mechanics.length === 1 ? mechanics[0].id : "");
    setDialogOpen(true);
  }

  const weekNum = getWeekNumber(weekStart);
  const isCurrentWeek =
    formatDateISO(getWeekStart(new Date())) === formatDateISO(weekStart);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Schema</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-slate-700 min-w-[100px] text-center">
              Vecka {weekNum}, {weekStart.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {!isCurrentWeek && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekStart(getWeekStart(new Date()))}
            >
              Idag
            </Button>
          )}
          <Button size="sm" onClick={handleNewBooking}>
            <Plus className="h-4 w-4 mr-1" />
            Ny bokning
          </Button>
        </div>
      </div>

      {/* Schedule */}
      {mechanics.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-slate-500">
          <p>Inga mekaniker hittades.</p>
          <p className="text-sm mt-1">
            Kör SQL-migrationen i Supabase Dashboard för att skapa mekaniker-tabellen.
          </p>
        </div>
      ) : (
        <WeekSchedule
          weekStart={weekStart}
          bookings={bookings}
          mechanics={mechanics}
          onSlotClick={handleSlotClick}
          onBookingClick={handleBookingClick}
        />
      )}

      {/* Booking Dialog */}
      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        booking={selectedBooking}
        mechanics={mechanics}
        onSaved={loadData}
        defaultDate={defaultDate}
        defaultTime={defaultTime}
      />
    </div>
  );
}
