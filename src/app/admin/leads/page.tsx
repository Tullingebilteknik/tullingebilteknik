"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, Mechanic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingDialog } from "@/components/admin/BookingDialog";
import { Phone, Mail, MessageSquare, AlertCircle, CalendarPlus, Search } from "lucide-react";

const statusConfig = [
  { value: "all", label: "Alla" },
  { value: "new", label: "Nya", color: "bg-amber-100 text-amber-800" },
  { value: "booked", label: "Bokade", color: "bg-blue-100 text-blue-800" },
  { value: "in_progress", label: "Pågående", color: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Klara", color: "bg-green-100 text-green-800" },
] as const;

const statusLabels: Record<string, string> = {
  new: "Ny",
  booked: "Bokad",
  in_progress: "Pågående",
  completed: "Klar",
};

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  booked: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const monthNames = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

function getMonthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${monthNames[parseInt(month)]} ${year}`;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [bookingLead, setBookingLead] = useState<Lead | null>(null);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadLeads();
    loadMechanics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
  }

  async function loadMechanics() {
    const { data } = await supabase
      .from("mechanics")
      .select("*")
      .eq("is_active", true)
      .order("name");
    if (data) setMechanics(data);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      console.error("Failed to update status:", error);
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: status as Lead["status"] } : l)));
    if (selectedLead?.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status: status as Lead["status"] } : null));
    }
  }

  async function saveNotes() {
    if (!selectedLead) return;
    await supabase.from("leads").update({ notes }).eq("id", selectedLead.id);
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, notes } : l))
    );
  }

  // Filter + search
  const filteredLeads = useMemo(() => {
    let result = leads;

    if (filter !== "all") {
      result = result.filter((l) => l.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.reg_number?.toLowerCase().includes(q) ||
        l.car_model?.toLowerCase().includes(q) ||
        l.selected_services?.some((s) => s.toLowerCase().includes(q)) ||
        l.service_interest?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, filter, search]);

  // Group by month
  const groupedLeads = useMemo(() => {
    const groups: { key: string; label: string; leads: Lead[] }[] = [];
    const map = new Map<string, Lead[]>();

    for (const lead of filteredLeads) {
      const key = getMonthKey(lead.created_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(lead);
    }

    for (const [key, groupLeads] of map) {
      groups.push({ key, label: getMonthLabel(key), leads: groupLeads });
    }

    return groups;
  }, [filteredLeads]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const l of leads) {
      counts[l.status] = (counts[l.status] || 0) + 1;
    }
    return counts;
  }, [leads]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
      </div>

      {/* Status tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {statusConfig.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === s.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label}
              {(statusCounts[s.value] ?? 0) > 0 && (
                <span className={`ml-1.5 ${filter === s.value ? "text-white/60" : "text-slate-400"}`}>
                  {statusCounts[s.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Sök namn, telefon, reg..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Grouped leads */}
      {groupedLeads.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-slate-500">
          Inga leads att visa.
        </div>
      ) : (
        groupedLeads.map((group) => (
          <div key={group.key} className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {group.label}
              <span className="ml-2 text-slate-400 font-normal">({group.leads.length})</span>
            </h2>

            <div className="rounded-xl border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Fordon</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Tjänst</TableHead>
                    <TableHead>Tid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => {
                        setSelectedLead(lead);
                        setNotes(lead.notes || "");
                      }}
                    >
                      <TableCell className={`font-medium ${lead.preferred_time === "Snarast" ? "font-bold" : ""}`}>
                        {lead.name}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {lead.reg_number || lead.car_model ? (
                          <div>
                            {lead.reg_number && <span className="font-mono font-medium text-slate-700">{lead.reg_number}</span>}
                            {lead.car_model && <p className="text-xs">{lead.car_model}</p>}
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900" onClick={(e) => e.stopPropagation()}>
                              <Phone className="h-3 w-3" /> {lead.phone}
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900" onClick={(e) => e.stopPropagation()}>
                              <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {lead.selected_services?.length
                          ? lead.selected_services.join(", ")
                          : lead.service_interest || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {lead.preferred_time === "Snarast" ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                            <AlertCircle className="h-3.5 w-3.5" /> Snarast
                          </span>
                        ) : lead.preferred_time ? (
                          <span className="text-slate-500">{lead.preferred_time}</span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(val) => updateStatus(lead.id, val)}
                        >
                          <SelectTrigger className="w-32 h-8" onClick={(e) => e.stopPropagation()}>
                            <Badge className={`${statusColors[lead.status]} border-0`}>
                              {statusLabels[lead.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Ny</SelectItem>
                            <SelectItem value="booked">Bokad</SelectItem>
                            <SelectItem value="in_progress">Pågående</SelectItem>
                            <SelectItem value="completed">Klar</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString("sv-SE")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {lead.status === "new" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookingLead(lead);
                              }}
                              title="Boka in"
                            >
                              <CalendarPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
                              setNotes(lead.notes || "");
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Telefon</p>
                  <a href={`tel:${selectedLead.phone}`} className="font-medium hover:text-amber-600">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <p className="text-slate-500">E-post</p>
                  <a href={`mailto:${selectedLead.email}`} className="font-medium hover:text-amber-600">
                    {selectedLead.email || "—"}
                  </a>
                </div>
                {selectedLead.reg_number && (
                  <div>
                    <p className="text-slate-500">Registreringsnummer</p>
                    <p className="font-mono font-semibold">{selectedLead.reg_number}</p>
                  </div>
                )}
                {selectedLead.car_model && (
                  <div>
                    <p className="text-slate-500">Bil</p>
                    <p className="font-medium">{selectedLead.car_model}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500">Tjänster</p>
                  {selectedLead.selected_services?.length ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLead.selected_services.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium">{selectedLead.service_interest || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500">Önskad tid</p>
                  {selectedLead.preferred_time === "Snarast" ? (
                    <p className="font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Snarast
                    </p>
                  ) : (
                    <p className="font-medium">{selectedLead.preferred_time || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500">Källa</p>
                  <p className="font-medium">{selectedLead.source_page}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Meddelande</p>
                <p className="text-sm bg-slate-50 rounded-lg p-3">{selectedLead.message}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Interna anteckningar</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Skriv anteckningar här..."
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={saveNotes}>
                    Spara anteckningar
                  </Button>
                  {selectedLead.status === "new" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-700 border-amber-300 hover:bg-amber-50"
                      onClick={() => {
                        setBookingLead(selectedLead);
                        setSelectedLead(null);
                      }}
                    >
                      <CalendarPlus className="h-4 w-4 mr-1" />
                      Boka in
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <BookingDialog
        open={!!bookingLead}
        onOpenChange={(open) => !open && setBookingLead(null)}
        lead={bookingLead}
        mechanics={mechanics}
        onSaved={loadLeads}
      />
    </div>
  );
}
