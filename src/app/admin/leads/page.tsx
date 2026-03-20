"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion, AnimatePresence } from "framer-motion";
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

/* ── Source page labels ───────────────────────── */

const sourceLabels: Record<string, string> = {
  kontakt: "Kontaktsidan",
  "diagnostic-wizard": "Felsökningsguiden",
  "service-configurator": "Bokningsformuläret",
};

function sourcePageLabel(source: string): string {
  if (!source) return "—";
  return sourceLabels[source] || source;
}

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

/* ── Grid column template ──────────────────────── */

const GRID_COLS = "1.4fr 0.8fr 1fr 1.2fr 0.7fr 0.8fr 0.7fr 60px";

/* ── Contact attempt summary ───────────────────── */

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

/* ── Virtual list item types ───────────────────── */

type VirtualItem =
  | { type: "header"; key: string; label: string; count: number }
  | { type: "lead"; key: string; lead: Lead };

/* ── LeadGridRow (memoized) ────────────────────── */

const LeadGridRow = React.memo(function LeadGridRow({
  lead,
  attempts,
  onOpen,
  onUpdateStatus,
  onBook,
  shouldAnimate,
  animationDelay,
}: {
  lead: Lead;
  attempts: ContactAttempt[];
  onOpen: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onBook: (lead: Lead) => void;
  shouldAnimate: boolean;
  animationDelay: number;
}) {
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { duration: 0.25, delay: animationDelay } : undefined}
      className="grid items-center px-4 py-2.5 cursor-pointer hover:bg-slate-50/80 border-b border-slate-100/80 transition-colors"
      style={{ gridTemplateColumns: GRID_COLS }}
      onClick={() => onOpen(lead)}
    >
      {/* Namn */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm text-slate-900 truncate">{lead.name}</span>
          {lead.deal_value != null && lead.deal_value > 0 && (
            <span className="text-[11px] text-green-700 font-mono shrink-0">{lead.deal_value.toLocaleString("sv-SE")} kr</span>
          )}
        </div>
        {lead.preferred_time === "Snarast" && (
          <span className="inline-flex items-center gap-0.5 text-[11px] text-red-600 font-semibold">
            <AlertCircle className="h-3 w-3" /> Snarast
          </span>
        )}
      </div>

      {/* Fordon */}
      <div className="text-sm text-slate-500 min-w-0">
        {lead.reg_number || lead.car_model ? (
          <div>
            {lead.reg_number && <span className="font-mono font-medium text-slate-700 text-xs">{lead.reg_number}</span>}
            {lead.car_model && <p className="text-xs truncate">{lead.car_model}</p>}
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      {/* Kontakt */}
      <div className="flex flex-col gap-0.5 min-w-0">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 truncate" onClick={(e) => e.stopPropagation()}>
            <Phone className="h-3 w-3 shrink-0" /> {lead.phone}
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 truncate" onClick={(e) => e.stopPropagation()}>
            <Mail className="h-3 w-3 shrink-0" /> {lead.email}
          </a>
        )}
      </div>

      {/* Tjänst */}
      <div className="text-xs text-slate-500 truncate min-w-0">
        {lead.selected_services?.length
          ? lead.selected_services.join(", ")
          : lead.service_interest || "—"}
      </div>

      {/* Kontaktförsök */}
      <div>
        <ContactSummary attempts={attempts} />
      </div>

      {/* Status */}
      <div onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={lead.status}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Select
              value={lead.status}
              onValueChange={(val) => onUpdateStatus(lead.id, val)}
            >
              <SelectTrigger
                className={`w-full h-7 ${statusColors[lead.status]} border-0 font-medium text-[11px]`}
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Datum */}
      <div className="text-xs text-slate-500">
        {new Date(lead.created_at).toLocaleDateString("sv-SE")}
      </div>

      {/* Actions */}
      <div className="flex gap-0.5 justify-end">
        {lead.status === "ska_kontaktas" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={(e) => {
              e.stopPropagation();
              onBook(lead);
            }}
            title="Boka in"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(lead);
          }}
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
});

/* ── Skeleton loader ───────────────────────────── */

function SkeletonRows() {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div
        className="grid px-4 py-2.5 border-b bg-slate-50/80 text-xs font-medium text-slate-500"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        <span>Namn</span><span>Fordon</span><span>Kontakt</span>
        <span>Tjänst</span><span>Försök</span><span>Status</span>
        <span>Datum</span><span></span>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid items-center px-4 py-3.5 border-b border-slate-50 animate-pulse"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-100 rounded w-4/5" />
            <div className="h-3 bg-slate-100 rounded w-3/5" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="h-6 bg-slate-100 rounded-full w-full" />
          <div className="h-3 bg-slate-100 rounded w-3/4" />
          <div className="h-6 bg-slate-100 rounded w-6 ml-auto" />
        </div>
      ))}
    </div>
  );
}

/* ── Main page ─────────────────────────────────── */

export default function AdminLeadsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [bookingLead, setBookingLead] = useState<Lead | null>(null);
  const [attemptNote, setAttemptNote] = useState("");
  const [showAttemptForm, setShowAttemptForm] = useState(false);
  const hasAnimated = useRef(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const mobileParentRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const queryClient = useQueryClient();

  /* ── Queries ─────────────────────────────── */

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as Lead[];
    },
  });

  const { data: attempts = {} } = useQuery({
    queryKey: ["lead-attempts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("lead_contact_attempts")
        .select("*")
        .order("created_at", { ascending: false });
      const map: Record<string, ContactAttempt[]> = {};
      for (const a of (data ?? []) as ContactAttempt[]) {
        if (!map[a.lead_id]) map[a.lead_id] = [];
        map[a.lead_id].push(a);
      }
      return map;
    },
  });

  const { data: mechanics = [] } = useQuery({
    queryKey: ["mechanics"],
    queryFn: async () => {
      const { data } = await supabase
        .from("mechanics")
        .select("*")
        .eq("is_active", true)
        .order("name");
      return (data ?? []) as Mechanic[];
    },
  });

  /* ── Mutations ───────────────────────────── */

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });
      const prev = queryClient.getQueryData<Lead[]>(["leads"]);
      queryClient.setQueryData<Lead[]>(["leads"], (old) =>
        old?.map((l) => (l.id === id ? { ...l, status: status as Lead["status"] } : l)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["leads"], context.prev);
    },
  });

  const notesMutation = useMutation({
    mutationFn: async ({ id, notes: val }: { id: string; notes: string }) => {
      const { error } = await supabase.from("leads").update({ notes: val }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, notes: val }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });
      const prev = queryClient.getQueryData<Lead[]>(["leads"]);
      queryClient.setQueryData<Lead[]>(["leads"], (old) =>
        old?.map((l) => (l.id === id ? { ...l, notes: val } : l)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["leads"], context.prev);
    },
  });

  const dealValueMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: number | null }) => {
      const { error } = await supabase.from("leads").update({ deal_value: value }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, value }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });
      const prev = queryClient.getQueryData<Lead[]>(["leads"]);
      queryClient.setQueryData<Lead[]>(["leads"], (old) =>
        old?.map((l) => (l.id === id ? { ...l, deal_value: value } : l)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["leads"], context.prev);
    },
  });

  const addAttemptMutation = useMutation({
    mutationFn: async ({ leadId, method, note }: { leadId: string; method: "phone" | "sms" | "email"; note: string | null }) => {
      const { data, error } = await supabase
        .from("lead_contact_attempts")
        .insert({ lead_id: leadId, method, note })
        .select()
        .single();
      if (error) throw error;
      return data as ContactAttempt;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Record<string, ContactAttempt[]>>(["lead-attempts"], (old) => ({
        ...old,
        [data.lead_id]: [data, ...(old?.[data.lead_id] || [])],
      }));
    },
  });

  const deleteAttemptMutation = useMutation({
    mutationFn: async ({ attemptId, leadId }: { attemptId: string; leadId: string }) => {
      const { error } = await supabase.from("lead_contact_attempts").delete().eq("id", attemptId);
      if (error) throw error;
      return { attemptId, leadId };
    },
    onMutate: async ({ attemptId, leadId }) => {
      await queryClient.cancelQueries({ queryKey: ["lead-attempts"] });
      const prev = queryClient.getQueryData<Record<string, ContactAttempt[]>>(["lead-attempts"]);
      queryClient.setQueryData<Record<string, ContactAttempt[]>>(["lead-attempts"], (old) => ({
        ...old,
        [leadId]: (old?.[leadId] || []).filter((a) => a.id !== attemptId),
      }));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["lead-attempts"], context.prev);
    },
  });

  /* ── Callbacks ───────────────────────────── */

  const updateStatus = useCallback(
    (id: string, status: string) => statusMutation.mutate({ id, status }),
    [statusMutation]
  );

  const autoSaveNotes = useCallback(
    (val: string) => {
      if (!selectedLeadId) return;
      notesMutation.mutate({ id: selectedLeadId, notes: val });
    },
    [selectedLeadId, notesMutation]
  );

  const autoSaveDealValue = useCallback(
    (val: string) => {
      if (!selectedLeadId) return;
      const num = val.trim() ? parseInt(val) : null;
      dealValueMutation.mutate({ id: selectedLeadId, value: num });
    },
    [selectedLeadId, dealValueMutation]
  );

  const logContactAttempt = useCallback(
    (method: "phone" | "sms" | "email") => {
      if (!selectedLeadId) return;
      addAttemptMutation.mutate({ leadId: selectedLeadId, method, note: attemptNote.trim() || null });
      setAttemptNote("");
    },
    [selectedLeadId, attemptNote, addAttemptMutation]
  );

  const deleteContactAttempt = useCallback(
    (attemptId: string) => {
      if (!selectedLeadId) return;
      deleteAttemptMutation.mutate({ attemptId, leadId: selectedLeadId });
    },
    [selectedLeadId, deleteAttemptMutation]
  );

  const openLead = useCallback((lead: Lead) => {
    setSelectedLeadId(lead.id);
    setNotes(lead.notes || "");
    setDealValue(lead.deal_value?.toString() || "");
    setShowAttemptForm(false);
    setAttemptNote("");
  }, []);

  const handleBookLead = useCallback((lead: Lead) => {
    setBookingLead(lead);
    setSelectedLeadId(null);
  }, []);

  /* ── Filtering ───────────────────────────── */

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

  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (const group of groupedLeads) {
      items.push({ type: "header", key: `h-${group.key}`, label: group.label, count: group.leads.length });
      for (const lead of group.leads) {
        items.push({ type: "lead", key: lead.id, lead });
      }
    }
    return items;
  }, [groupedLeads]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const l of leads) {
      counts[l.status] = (counts[l.status] || 0) + 1;
    }
    return counts;
  }, [leads]);

  /* ── Virtualizer ─────────────────────────── */

  const rowVirtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (virtualItems[index].type === "header" ? 40 : 56),
    overscan: 10,
    getItemKey: (index) => virtualItems[index].key,
  });

  const mobileVirtualizer = useVirtualizer({
    count: filteredLeads.length,
    getScrollElement: () => mobileParentRef.current,
    estimateSize: () => 130,
    overscan: 5,
    getItemKey: (index) => filteredLeads[index]?.id ?? index,
  });

  // Mark animation as done after initial render
  useEffect(() => {
    if (!leadsLoading && leads.length > 0 && !hasAnimated.current) {
      const t = setTimeout(() => {
        hasAnimated.current = true;
      }, 600);
      return () => clearTimeout(t);
    }
  }, [leadsLoading, leads.length]);

  const selectedLead = selectedLeadId ? leads.find((l) => l.id === selectedLeadId) ?? null : null;
  const leadAttempts = selectedLeadId ? (attempts[selectedLeadId] || []) : [];

  /* ── Render ──────────────────────────────── */

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
      </div>

      {/* Status tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {statusConfig.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === s.value
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label}
              {(statusCounts[s.value] ?? 0) > 0 && (
                <motion.span
                  layout
                  className={`ml-1.5 ${filter === s.value ? "text-white/60" : "text-slate-400"}`}
                >
                  {statusCounts[s.value]}
                </motion.span>
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

      {/* Content area */}
      {leadsLoading ? (
        <div className="hidden md:block"><SkeletonRows /></div>
      ) : virtualItems.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-slate-500">
          Inga leads att visa.
        </div>
      ) : (
        <>
          {/* ── Desktop: Virtualized CSS Grid ── */}
          <div className="hidden md:flex flex-col flex-1 min-h-0 rounded-xl border bg-white overflow-hidden">
            {/* Column headers */}
            <div
              className="grid px-4 py-2.5 border-b bg-slate-50/80 text-xs font-medium text-slate-500 shrink-0"
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              <span>Namn</span>
              <span>Fordon</span>
              <span>Kontakt</span>
              <span>Tjänst</span>
              <span>Försök</span>
              <span>Status</span>
              <span>Datum</span>
              <span></span>
            </div>

            {/* Virtualized rows */}
            <div ref={parentRef} className="flex-1 overflow-auto">
              <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = virtualItems[virtualRow.index];
                  return (
                    <div
                      key={item.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {item.type === "header" ? (
                        <div className="px-4 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/60 backdrop-blur-sm border-b border-slate-100">
                          {item.label}
                          <span className="ml-2 text-slate-400 font-normal normal-case tracking-normal">({item.count})</span>
                        </div>
                      ) : (
                        <LeadGridRow
                          lead={item.lead}
                          attempts={attempts[item.lead.id] || []}
                          onOpen={openLead}
                          onUpdateStatus={updateStatus}
                          onBook={handleBookLead}
                          shouldAnimate={!hasAnimated.current}
                          animationDelay={Math.min(virtualRow.index * 0.03, 0.3)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Mobile: Virtualized cards ── */}
          <div ref={mobileParentRef} className="md:hidden flex-1 overflow-auto">
            <div style={{ height: mobileVirtualizer.getTotalSize(), position: "relative" }}>
              {mobileVirtualizer.getVirtualItems().map((virtualRow) => {
                const lead = filteredLeads[virtualRow.index];
                if (!lead) return null;
                return (
                  <div
                    key={lead.id}
                    data-index={virtualRow.index}
                    ref={mobileVirtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                      padding: "0 0 8px 0",
                    }}
                  >
                    <motion.button
                      initial={!hasAnimated.current ? { opacity: 0, y: 6 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={!hasAnimated.current ? { duration: 0.2, delay: Math.min(virtualRow.index * 0.04, 0.3) } : undefined}
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
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
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
          onClose={() => setSelectedLeadId(null)}
          onUpdateStatus={(status) => updateStatus(selectedLead.id, status)}
          onLogAttempt={logContactAttempt}
          onDeleteAttempt={deleteContactAttempt}
          onBookLead={() => {
            setBookingLead(selectedLead);
            setSelectedLeadId(null);
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
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["leads"] })}
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
              <p className="font-medium">{sourcePageLabel(lead.source_page)}</p>
              {lead.landing_page && (
                <p className="text-slate-400 text-xs mt-0.5">Landningssida: {lead.landing_page}</p>
              )}
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
