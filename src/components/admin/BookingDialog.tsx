"use client";

import { useState, useEffect, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Car } from "lucide-react";
import flatpickr from "flatpickr";
import { Swedish } from "flatpickr/dist/l10n/sv";

const TIME_SLOTS = Array.from({ length: 21 }, (_, i) => {
  const hour = 7 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${min}`;
});

const statusLabels: Record<string, string> = {
  booked: "Bokad",
  in_progress: "Pågående",
  completed: "Färdigställd",
};

const statusColors: Record<string, string> = {
  booked: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

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
  const [status, setStatus] = useState("booked");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const dateRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const initialDateRef = useRef("");
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;

    if (booking) {
      setMechanicId(booking.mechanic_id);
      setDate(booking.scheduled_date);
      initialDateRef.current = booking.scheduled_date;
      setStartTime(booking.start_time.slice(0, 5));
      setEndTime(booking.end_time.slice(0, 5));
      setNotes(booking.notes || "");
      setStatus(booking.lead.status || "booked");
      setSelectedLeadId(booking.lead_id);
    } else {
      const d = defaultDate || new Date().toISOString().split("T")[0];
      setMechanicId(mechanics.length === 1 ? mechanics[0].id : "");
      setDate(d);
      initialDateRef.current = d;
      setStartTime(defaultTime || "08:00");
      setEndTime(defaultTime ? nextSlot(defaultTime) : "09:00");
      setNotes("");
      setStatus("booked");
      setSelectedLeadId(lead?.id || "");
    }

    if (!lead && !booking) {
      loadUnbookedLeads();
    }
  }, [open, booking, lead, mechanics, defaultDate, defaultTime]);

  // Init Flatpickr after dialog opens (no `date` in deps to avoid loop)
  useEffect(() => {
    if (!open || !dateRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!dateRef.current) return;
      fpRef.current = flatpickr(dateRef.current, {
        defaultDate: initialDateRef.current || undefined,
        dateFormat: "Y-m-d",
        locale: Swedish,
        disableMobile: true,
        static: true,
        onChange: (_dates, dateStr) => {
          setDate(dateStr);
        },
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      fpRef.current?.destroy();
      fpRef.current = null;
    };
  }, [open]);

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

  const activeLead = lead || (booking ? booking.lead as Lead : null) || leads.find((l) => l.id === selectedLeadId) || null;
  const canSave =
    (lead?.id || selectedLeadId || booking?.lead_id) && mechanicId && date && startTime && endTime && startTime < endTime;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError("");

    const leadId = lead?.id || booking?.lead_id || selectedLeadId;

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

      // Update lead status if changed
      if (status !== booking.lead.status) {
        await supabase
          .from("leads")
          .update({ status })
          .eq("id", booking.lead_id);
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

  const orderNum = booking?.order_number
    ? `#${String(booking.order_number).padStart(4, "0")}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {booking ? (
              <>
                Ärende {orderNum}
                <Badge className={`${statusColors[status]} border-0 text-xs`}>
                  {statusLabels[status]}
                </Badge>
              </>
            ) : (
              "Ny bokning"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer info — shown for lead prop or editing booking */}
          {(lead || booking) && activeLead ? (
            <div className="rounded-lg bg-slate-50 p-4 space-y-2">
              <p className="font-semibold text-sm">{activeLead.name}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                {activeLead.phone && (
                  <a href={`tel:${activeLead.phone}`} className="inline-flex items-center gap-1 hover:text-slate-900">
                    <Phone className="h-3 w-3" /> {activeLead.phone}
                  </a>
                )}
                {activeLead.email && (
                  <a href={`mailto:${activeLead.email}`} className="inline-flex items-center gap-1 hover:text-slate-900">
                    <Mail className="h-3 w-3" /> {activeLead.email}
                  </a>
                )}
              </div>
              {(activeLead.reg_number || activeLead.car_model) && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Car className="h-3 w-3" />
                  {activeLead.reg_number && (
                    <span className="font-mono font-semibold text-slate-800">{activeLead.reg_number}</span>
                  )}
                  {activeLead.car_model && (
                    <span>{activeLead.car_model}</span>
                  )}
                </div>
              )}
              {(activeLead.selected_services?.length || activeLead.service_interest) && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeLead.selected_services?.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  )) || (
                    <Badge variant="secondary" className="text-[10px]">{activeLead.service_interest}</Badge>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Lead selector — only when creating from schema (no lead/booking) */
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Kund
              </label>
              <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Välj kund..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} {l.reg_number ? `(${l.reg_number})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Show selected lead info */}
              {activeLead && (
                <div className="rounded-lg bg-slate-50 p-3 mt-2 text-xs text-slate-500 space-y-1">
                  {activeLead.phone && <p>Tel: {activeLead.phone}</p>}
                  {activeLead.email && <p>E-post: {activeLead.email}</p>}
                  {activeLead.car_model && <p>Bil: {activeLead.car_model}</p>}
                  {activeLead.reg_number && <p>Reg.nr: {activeLead.reg_number}</p>}
                </div>
              )}
            </div>
          )}

          {/* Status — only when editing */}
          {booking && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booked">Bokad</SelectItem>
                  <SelectItem value="in_progress">Pågående</SelectItem>
                  <SelectItem value="completed">Färdigställd</SelectItem>
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

          {/* Date — Flatpickr */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Datum
            </label>
            <input
              ref={dateRef}
              type="text"
              readOnly
              value={date}
              placeholder="Välj datum"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs cursor-pointer focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
