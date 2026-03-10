"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, Mechanic, BookingWithDetails } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TIME_SLOTS = Array.from({ length: 21 }, (_, i) => {
  const hour = 7 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${min}`;
});

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  booking?: BookingWithDetails | null;
  mechanics: Mechanic[];
  onSaved: () => void;
  defaultDate?: string;
  defaultTime?: string;
}

export function BookingDialog({
  open,
  onOpenChange,
  lead,
  booking,
  mechanics,
  onSaved,
  defaultDate,
  defaultTime,
}: BookingDialogProps) {
  const [mechanicId, setMechanicId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!open) return;

    if (booking) {
      setMechanicId(booking.mechanic_id);
      setDate(booking.scheduled_date);
      setStartTime(booking.start_time.slice(0, 5));
      setEndTime(booking.end_time.slice(0, 5));
      setNotes(booking.notes || "");
      setSelectedLeadId(booking.lead_id);
    } else {
      setMechanicId(mechanics.length === 1 ? mechanics[0].id : "");
      setDate(defaultDate || new Date().toISOString().split("T")[0]);
      setStartTime(defaultTime || "08:00");
      setEndTime(defaultTime ? nextSlot(defaultTime) : "09:00");
      setNotes("");
      setSelectedLeadId(lead?.id || "");
    }

    if (!lead && !booking) {
      loadUnbookedLeads();
    }
  }, [open, booking, lead, mechanics, defaultDate, defaultTime]);

  async function loadUnbookedLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
  }

  function nextSlot(time: string): string {
    const idx = TIME_SLOTS.indexOf(time);
    return idx >= 0 && idx < TIME_SLOTS.length - 1
      ? TIME_SLOTS[idx + 2] || TIME_SLOTS[TIME_SLOTS.length - 1]
      : "09:00";
  }

  const activeLead = lead || leads.find((l) => l.id === selectedLeadId);
  const canSave =
    (lead?.id || selectedLeadId) && mechanicId && date && startTime && endTime && startTime < endTime;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError("");

    const leadId = lead?.id || selectedLeadId;

    if (booking) {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          mechanic_id: mechanicId,
          scheduled_date: date,
          start_time: startTime,
          end_time: endTime,
          notes: notes || null,
        })
        .eq("id", booking.id);

      if (updateError) {
        console.error("Booking update failed:", updateError);
        setError("Kunde inte uppdatera bokningen.");
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("bookings").insert({
        lead_id: leadId,
        mechanic_id: mechanicId,
        scheduled_date: date,
        start_time: startTime,
        end_time: endTime,
        notes: notes || null,
      });

      if (insertError) {
        console.error("Booking insert failed:", insertError);
        setError("Kunde inte skapa bokningen.");
        setSaving(false);
        return;
      }

      await supabase
        .from("leads")
        .update({ status: "booked" })
        .eq("id", leadId);
    }

    setSaving(false);
    onSaved();
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!booking) return;
    setSaving(true);

    await supabase.from("bookings").delete().eq("id", booking.id);
    await supabase
      .from("leads")
      .update({ status: "new" })
      .eq("id", booking.lead_id);

    setSaving(false);
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {booking ? "Redigera bokning" : "Ny bokning"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lead */}
          {lead ? (
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-medium text-sm">{lead.name}</p>
              <p className="text-xs text-slate-500">
                {lead.reg_number && (
                  <span className="font-mono mr-2">{lead.reg_number}</span>
                )}
                {lead.selected_services?.join(", ") || lead.service_interest || ""}
              </p>
            </div>
          ) : booking ? (
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-medium text-sm">{booking.lead.name}</p>
              <p className="text-xs text-slate-500">
                {booking.lead.reg_number && (
                  <span className="font-mono mr-2">{booking.lead.reg_number}</span>
                )}
                {booking.lead.selected_services?.join(", ") || booking.lead.service_interest || ""}
              </p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Lead
              </label>
              <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Välj lead..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} {l.reg_number ? `(${l.reg_number})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mechanic */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Mekaniker
            </label>
            <Select value={mechanicId} onValueChange={setMechanicId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Välj mekaniker..." />
              </SelectTrigger>
              <SelectContent>
                {mechanics.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Start
              </label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Slut
              </label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.filter((t) => t > startTime).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Anteckningar
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Valfria anteckningar..."
              rows={2}
            />
          </div>

          {/* Selected lead info */}
          {activeLead && !lead && !booking && (
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              {activeLead.phone && <p>Tel: {activeLead.phone}</p>}
              {activeLead.car_model && <p>Bil: {activeLead.car_model}</p>}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="flex-1"
            >
              {saving ? "Sparar..." : booking ? "Uppdatera" : "Boka"}
            </Button>
            {booking && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
                Ta bort
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
