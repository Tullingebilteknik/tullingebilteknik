"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, Mechanic, ContactAttempt } from "@/lib/types";
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
import {
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  CalendarPlus,
  Search,
  PhoneCall,
  MessageCircle,
  Send,
  ChevronRight,
  X,
  Check,
  Trash2,
} from "lucide-react";

/* ── Status config ─────────────────────────────── */

const statusConfig = [
  { value: "all", label: "Alla" },
  { value: "ska_kontaktas", label: "Ska kontaktas", color: "bg-amber-100 text-amber-800" },
  { value: "bokad", label: "Bokade", color: "bg-blue-100 text-blue-800" },
  { value: "ej_affar", label: "Ej affär", color: "bg-red-100 text-red-700" },
  { value: "affar", label: "Affär", color: "bg-green-100 text-green-800" },
] as const;

const statusLabels: Record<string, string> = {
  ska_kontaktas: "Ska kontaktas",
  bokad: "Bokad",
  ej_affar: "Ej affär",
  affar: "Affär",
};

const statusColors: Record<string, string> = {
  ska_kontaktas: "bg-amber-100 text-amber-800",
  bokad: "bg-blue-100 text-blue-800",
  ej_affar: "bg-red-100 text-red-700",
  affar: "bg-green-100 text-green-800",
};

const methodLabels: Record<string, string> = {
  phone: "Samtal",
  sms: "SMS",
  email: "E-post",
};

const methodIcons: Record<string, typeof PhoneCall> = {
  phone: PhoneCall,
  sms: MessageCircle,
  email: Send,
};

/* ── Date helpers ──────────────────────────────── */

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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just nu";
  if (mins < 60) return `${mins}m sedan`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h sedan`;
  const days = Math.floor(hours / 24);
  return `${days}d sedan`;
}

/* ── Contact attempt summary per lead ──────────── */

function ContactSummary({ attempts }: { attempts: ContactAttempt[] }) {
  if (attempts.length === 0) return <span className="text-slate-300">—</span>;

  const counts: Record<string, number> = {};
  for (const a of attempts) {
    counts[a.method] = (counts[a.method] || 0) + 1;
  }

  return (
    <div className="flex items-center gap-1.5">
      {Object.entries(counts).map(([method, count]) => {
        const Icon = methodIcons[method] || PhoneCall;
        return (
          <span key={method} className="inline-flex items-center gap-0.5 text-xs text-slate-500" title={methodLabels[method]}>
            <Icon className="h-3 w-3" />{count}
          </span>
        );
      })}
    </div>
  );
}

/* ── Auto-save hook ────────────────────────────── */

function useAutoSave(value: string, save: (val: string) => void, delay = 800) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initial = useRef(value);

  useEffect(() => {
    initial.current = value;
  // Reset initial when lead changes (value resets)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSaved(false);
    if (value === initial.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      save(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, delay);
    return () => clearTimeout(timer.current);
  }, [value, save, delay]);

  return saved;
}

/* ── Main page ─────────────────────────────────── */

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [bookingLead, setBookingLead] = useState<Lead | null>(null);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [attempts, setAttempts] = useState<Record<string, ContactAttempt[]>>({});
  const [attemptNote, setAttemptNote] = useState("");
  const [showAttemptForm, setShowAttemptForm] = useState(false);
  const supabase = createClient();

  const loadLeads = useCallback(async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
  }, [supabase]);

  const loadAttempts = useCallback(async () => {
    const { data } = await supabase
      .from("lead_contact_attempts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      const map: Record<string, ContactAttempt[]> = {};
      for (const a of data) {
        if (!map[a.lead_id]) map[a.lead_id] = [];
        map[a.lead_id].push(a);
      }
      setAttempts(map);
    }
  }, [supabase]);

  useEffect(() => {
    loadLeads();
    loadAttempts();
    supabase
      .from("mechanics")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => { if (data) setMechanics(data); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const autoSaveNotes = useCallback(async (val: string) => {
    if (!selectedLead) return;
    await supabase.from("leads").update({ notes: val }).eq("id", selectedLead.id);
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: val } : l))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLead?.id]);

  const autoSaveDealValue = useCallback(async (val: string) => {
    if (!selectedLead) return;
    const num = val.trim() ? parseInt(val) : null;
    await supabase.from("leads").update({ deal_value: num }).eq("id", selectedLead.id);
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, deal_value: num } : l))
    );
    setSelectedLead((prev) => (prev ? { ...prev, deal_value: num } : null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLead?.id]);

  async function logContactAttempt(method: "phone" | "sms" | "email") {
    if (!selectedLead) return;
    const { data } = await supabase
      .from("lead_contact_attempts")
      .insert({ lead_id: selectedLead.id, method, note: attemptNote.trim() || null })
      .select()
      .single();
    if (data) {
      setAttempts((prev) => ({
        ...prev,
        [selectedLead.id]: [data, ...(prev[selectedLead.id] || [])],
      }));
    }
    setAttemptNote("");
  }

  async function deleteContactAttempt(attemptId: string) {
    if (!selectedLead) return;
    await supabase.from("lead_contact_attempts").delete().eq("id", attemptId);
    setAttempts((prev) => ({
      ...prev,
      [selectedLead.id]: (prev[selectedLead.id] || []).filter((a) => a.id !== attemptId),
    }));
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setNotes(lead.notes || "");
    setDealValue(lead.deal_value?.toString() || "");
    setShowAttemptForm(false);
    setAttemptNote("");
  }

  /* ── Filtering ─────────────────────────────── */

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

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const l of leads) {
      counts[l.status] = (counts[l.status] || 0) + 1;
    }
    return counts;
  }, [leads]);

  const leadAttempts = selectedLead ? (attempts[selectedLead.id] || []) : [];

  /* ── Render ────────────────────────────────── */

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

            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Fordon</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Tjänst</TableHead>
                    <TableHead>Kontaktförsök</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => openLead(lead)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          {lead.name}
                          {lead.deal_value != null && lead.deal_value > 0 && (
                            <span className="ml-2 text-xs text-green-700 font-mono">{lead.deal_value.toLocaleString("sv-SE")} kr</span>
                          )}
                        </div>
                        {lead.preferred_time === "Snarast" && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-red-600 font-semibold">
                            <AlertCircle className="h-3 w-3" /> Snarast
                          </span>
                        )}
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
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 truncate max-w-[180px]" onClick={(e) => e.stopPropagation()}>
                              <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 max-w-[160px] truncate">
                        {lead.selected_services?.length
                          ? lead.selected_services.join(", ")
                          : lead.service_interest || "—"}
                      </TableCell>
                      <TableCell>
                        <ContactSummary attempts={attempts[lead.id] || []} />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(val) => updateStatus(lead.id, val)}
                        >
                          <SelectTrigger
                            className={`w-36 h-8 ${statusColors[lead.status]} border-0 font-medium text-xs`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ska_kontaktas">Ska kontaktas</SelectItem>
                            <SelectItem value="bokad">Bokad</SelectItem>
                            <SelectItem value="ej_affar">Ej affär</SelectItem>
                            <SelectItem value="affar">Affär</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString("sv-SE")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {lead.status === "ska_kontaktas" && (
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
                              openLead(lead);
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

            {/* Mobile card list */}
            <div className="md:hidden space-y-2">
              {group.leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => openLead(lead)}
                  className="w-full text-left rounded-xl border bg-white p-4 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 truncate">{lead.name}</span>
                        {lead.preferred_time === "Snarast" && (
                          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        {lead.reg_number && <span className="font-mono">{lead.reg_number}</span>}
                        {lead.car_model && <span>{lead.car_model}</span>}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {lead.selected_services?.length
                          ? lead.selected_services.join(", ")
                          : lead.service_interest || "—"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className={`${statusColors[lead.status]} border-0 text-[10px] whitespace-nowrap`}>
                        {statusLabels[lead.status]}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <ContactSummary attempts={attempts[lead.id] || []} />
                        {lead.deal_value != null && lead.deal_value > 0 && (
                          <span className="text-[10px] text-green-700 font-mono">{lead.deal_value.toLocaleString("sv-SE")} kr</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-slate-700" onClick={(e) => e.stopPropagation()}>
                          <Phone className="h-3 w-3" /> {lead.phone}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {new Date(lead.created_at).toLocaleDateString("sv-SE")}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      {/* ── Lead Detail Dialog ──────────────── */}
      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          notes={notes}
          setNotes={setNotes}
          dealValue={dealValue}
          setDealValue={setDealValue}
          attempts={leadAttempts}
          attemptNote={attemptNote}
          setAttemptNote={setAttemptNote}
          showAttemptForm={showAttemptForm}
          setShowAttemptForm={setShowAttemptForm}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={(status) => updateStatus(selectedLead.id, status)}
          onLogAttempt={logContactAttempt}
          onDeleteAttempt={deleteContactAttempt}
          onBookLead={() => {
            setBookingLead(selectedLead);
            setSelectedLead(null);
          }}
          autoSaveNotes={autoSaveNotes}
          autoSaveDealValue={autoSaveDealValue}
        />
      )}

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

/* ── Lead Detail Dialog component ──────────────── */

function LeadDetailDialog({
  lead,
  notes,
  setNotes,
  dealValue,
  setDealValue,
  attempts,
  attemptNote,
  setAttemptNote,
  showAttemptForm,
  setShowAttemptForm,
  onClose,
  onUpdateStatus,
  onLogAttempt,
  onDeleteAttempt,
  onBookLead,
  autoSaveNotes,
  autoSaveDealValue,
}: {
  lead: Lead;
  notes: string;
  setNotes: (v: string) => void;
  dealValue: string;
  setDealValue: (v: string) => void;
  attempts: ContactAttempt[];
  attemptNote: string;
  setAttemptNote: (v: string) => void;
  showAttemptForm: boolean;
  setShowAttemptForm: (v: boolean) => void;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onLogAttempt: (method: "phone" | "sms" | "email") => void;
  onDeleteAttempt: (id: string) => void;
  onBookLead: () => void;
  autoSaveNotes: (val: string) => void;
  autoSaveDealValue: (val: string) => void;
}) {
  const notesSaved = useAutoSave(notes, autoSaveNotes);
  const dealSaved = useAutoSave(dealValue, autoSaveDealValue);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {lead.name}
            <Badge className={`${statusColors[lead.status]} border-0 text-xs`}>
              {statusLabels[lead.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Telefon</p>
              <a href={`tel:${lead.phone}`} className="font-medium hover:text-blue-600">
                {lead.phone || "—"}
              </a>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">E-post</p>
              <a href={`mailto:${lead.email}`} className="font-medium hover:text-blue-600 break-all">
                {lead.email || "—"}
              </a>
            </div>
            {lead.reg_number && (
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Reg.nr</p>
                <p className="font-mono font-semibold">{lead.reg_number}</p>
              </div>
            )}
            {lead.car_model && (
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Bil</p>
                <p className="font-medium">{lead.car_model}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-slate-500 text-xs mb-0.5">Tjänster</p>
              {lead.selected_services?.length ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.selected_services.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              ) : (
                <p className="font-medium">{lead.service_interest || "—"}</p>
              )}
            </div>
            {lead.preferred_time && (
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Önskad tid</p>
                {lead.preferred_time === "Snarast" ? (
                  <p className="font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Snarast
                  </p>
                ) : (
                  <p className="font-medium">{lead.preferred_time}</p>
                )}
              </div>
            )}
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Källa</p>
              <p className="font-medium">{lead.source_page || "—"}</p>
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Meddelande</p>
              <p className="text-sm bg-slate-50 rounded-lg p-3">{lead.message}</p>
            </div>
          )}

          {/* Status + Deal value */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <Select value={lead.status} onValueChange={onUpdateStatus}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ska_kontaktas">Ska kontaktas</SelectItem>
                  <SelectItem value="bokad">Bokad</SelectItem>
                  <SelectItem value="ej_affar">Ej affär</SelectItem>
                  <SelectItem value="affar">Affär</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-slate-500">Värde (kr)</p>
                {dealSaved && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600">
                    <Check className="h-2.5 w-2.5" /> Sparat
                  </span>
                )}
              </div>
              <Input
                type="number"
                placeholder="0"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* ── Contact Attempts ─────────── */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">
                Kontaktförsök
                {attempts.length > 0 && (
                  <span className="ml-1.5 text-slate-400 font-normal">({attempts.length})</span>
                )}
              </p>
              {!showAttemptForm && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setShowAttemptForm(true)}
                >
                  + Registrera
                </Button>
              )}
            </div>

            {showAttemptForm && (
              <div className="bg-slate-50 rounded-lg p-3 mb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-600">Registrera kontaktförsök</p>
                  <button onClick={() => { setShowAttemptForm(false); setAttemptNote(""); }} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Input
                  placeholder="Anteckning (valfritt)..."
                  value={attemptNote}
                  onChange={(e) => setAttemptNote(e.target.value)}
                  className="h-8 text-sm bg-white"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 gap-1.5 text-xs"
                    onClick={() => onLogAttempt("phone")}
                  >
                    <PhoneCall className="h-3.5 w-3.5" /> Samtal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 gap-1.5 text-xs"
                    onClick={() => onLogAttempt("sms")}
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> SMS
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 gap-1.5 text-xs"
                    onClick={() => onLogAttempt("email")}
                  >
                    <Send className="h-3.5 w-3.5" /> E-post
                  </Button>
                </div>
              </div>
            )}

            {/* Attempt timeline */}
            {attempts.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {attempts.map((a) => {
                  const Icon = methodIcons[a.method] || PhoneCall;
                  return (
                    <div key={a.id} className="group flex items-start gap-2.5 text-sm">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Icon className="h-3 w-3 text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-slate-700">{methodLabels[a.method]}</span>
                          <span className="text-[11px] text-slate-400">{timeAgo(a.created_at)}</span>
                        </div>
                        {a.note && <p className="text-xs text-slate-500 mt-0.5">{a.note}</p>}
                      </div>
                      <button
                        onClick={() => onDeleteAttempt(a.id)}
                        className="opacity-0 group-hover:opacity-100 mt-0.5 p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Radera"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Inga kontaktförsök ännu.</p>
            )}
          </div>

          {/* Internal notes */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-slate-500">Interna anteckningar</p>
              {notesSaved && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600">
                  <Check className="h-2.5 w-2.5" /> Sparat
                </span>
              )}
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Skriv anteckningar här..."
              rows={3}
            />
            {lead.status === "ska_kontaktas" && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                  onClick={onBookLead}
                >
                  <CalendarPlus className="h-4 w-4 mr-1" />
                  Boka in
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
