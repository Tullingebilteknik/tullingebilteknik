"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";
import {
  computeFlowPayload,
  stateToDbStatus,
  stateLabels,
  stateColors,
  type LeadState,
} from "@/lib/lead-flow-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ── Dynamic import for R3F (no SSR) ──────────── */

const FlowCanvas = dynamic(
  () => import("@/components/admin/flow/FlowScene"),
  { ssr: false }
);

/* ── Desktop check ─────────────────────────────── */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsDesktop(window.innerWidth >= 768 && (navigator.hardwareConcurrency ?? 4) >= 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

/* ── Helpers ───────────────────────────────────── */

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dec",
];

const statusLabelsDb: Record<string, string> = {
  ska_kontaktas: "Ska kontaktas",
  bokad: "Bokad",
  ej_affar: "Ej affär",
  affar: "Affär",
};

const statusColorsDb: Record<string, string> = {
  ska_kontaktas: "bg-amber-100 text-amber-800",
  bokad: "bg-blue-100 text-blue-800",
  ej_affar: "bg-red-100 text-red-700",
  affar: "bg-green-100 text-green-800",
};

/* ── Main page ─────────────────────────────────── */

export default function LeadStatistikPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeNode, setActiveNode] = useState<LeadState | null>(null);
  const isDesktop = useIsDesktop();
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setLeads(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payload = useMemo(() => computeFlowPayload(leads), [leads]);

  /* ── Filtered leads for table ──────────── */

  const filteredLeads = useMemo(() => {
    if (!activeNode) return leads;
    if (activeNode === "INCOMING") return leads;
    const dbStatus = stateToDbStatus[activeNode];
    if (!dbStatus) return leads;
    return leads.filter((l) => l.status === dbStatus);
  }, [leads, activeNode]);

  /* ── Monthly stats ─────────────────────── */

  const monthlyStats = useMemo(() => {
    const map = new Map<string, { month: string; affar: number; ejAffar: number; total: number }>();
    for (const l of leads) {
      const d = new Date(l.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!map.has(key)) map.set(key, { month: label, affar: 0, ejAffar: 0, total: 0 });
      const entry = map.get(key)!;
      entry.total++;
      if (l.status === "affar") entry.affar += l.deal_value || 0;
      if (l.status === "ej_affar") entry.ejAffar += l.deal_value || 0;
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [leads]);

  const maxMonthlyValue = Math.max(...monthlyStats.map((m) => Math.max(m.affar, m.ejAffar, 1)), 1);

  /* ── Source stats ──────────────────────── */

  const sourceStats = useMemo(() => {
    const map = new Map<string, { total: number; affar: number; value: number }>();
    for (const l of leads) {
      const src = l.source_page || "okänd";
      if (!map.has(src)) map.set(src, { total: 0, affar: 0, value: 0 });
      const entry = map.get(src)!;
      entry.total++;
      if (l.status === "affar") {
        entry.affar++;
        entry.value += l.deal_value || 0;
      }
    }
    return [...map.entries()].sort(([, a], [, b]) => b.total - a.total).map(([name, data]) => ({ name, ...data }));
  }, [leads]);

  const maxSourceTotal = Math.max(...sourceStats.map((s) => s.total), 1);

  /* ── Summary ───────────────────────────── */

  const summary = useMemo(() => {
    const affar = leads.filter((l) => l.status === "affar");
    const ejAffar = leads.filter((l) => l.status === "ej_affar");
    return {
      total: leads.length,
      affarCount: affar.length,
      affarValue: affar.reduce((sum, l) => sum + (l.deal_value || 0), 0),
      ejAffarValue: ejAffar.reduce((sum, l) => sum + (l.deal_value || 0), 0),
    };
  }, [leads]);

  /* ── Render ────────────────────────────── */

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/leads" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Leadstatistik</h1>
      </div>

      {/* ── Flow visualization ──────────── */}
      <div className="rounded-xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mb-8 overflow-hidden">
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Konverteringsflöde</h2>
          {activeNode && (
            <button
              onClick={() => setActiveNode(null)}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Visa alla
            </button>
          )}
        </div>

        {isDesktop ? (
          <div className="h-[320px] w-full">
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="text-white/20 text-sm">Laddar visualisering...</div>
                </div>
              }
            >
              <FlowCanvas payload={payload} activeNode={activeNode} onNodeClick={setActiveNode} />
            </Suspense>
          </div>
        ) : (
          /* Mobile fallback: CSS cards */
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            {(["INCOMING", "TO_BE_CONTACTED", "BOOKED", "DEAL", "NO_DEAL"] as LeadState[]).map((id) => {
              const node = payload.nodes[id];
              const isActive = activeNode === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveNode(isActive ? null : id)}
                  className={`rounded-lg p-3 text-left transition-all ${
                    id === "NO_DEAL" ? "col-span-2" : ""
                  } ${isActive ? "ring-2 ring-white/40" : ""}`}
                  style={{
                    background: `${stateColors[id]}22`,
                    borderLeft: `3px solid ${stateColors[id]}`,
                  }}
                >
                  <p className="text-[11px] text-white/50">{node.label}</p>
                  <p className="text-xl font-bold text-white">{node.metrics.count}</p>
                  {node.metrics.financialValue > 0 && (
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {id === "NO_DEAL" ? "-" : ""}
                      {node.metrics.financialValue.toLocaleString("sv-SE")} kr
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Filtered lead table ─────────── */}
      <div className="rounded-xl border bg-white overflow-hidden mb-8">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            {activeNode ? stateLabels[activeNode] : "Alla leads"}
            <span className="ml-2 text-slate-400 font-normal">({filteredLeads.length})</span>
          </h2>
        </div>
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Inga leads att visa.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Fordon</TableHead>
                  <TableHead>Tjänst</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Värde</TableHead>
                  <TableHead>Datum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {lead.reg_number && <span className="font-mono">{lead.reg_number}</span>}
                      {lead.car_model && <span className="ml-1 text-xs">{lead.car_model}</span>}
                      {!lead.reg_number && !lead.car_model && "—"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-[160px] truncate">
                      {lead.selected_services?.length
                        ? lead.selected_services.join(", ")
                        : lead.service_interest || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColorsDb[lead.status]} border-0 text-xs`}>
                        {statusLabelsDb[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {lead.deal_value ? `${lead.deal_value.toLocaleString("sv-SE")} kr` : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString("sv-SE")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Monthly bar chart ──────────── */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Värde per månad</h2>
          {monthlyStats.length === 0 ? (
            <p className="text-sm text-slate-400">Ingen data att visa.</p>
          ) : (
            <div className="space-y-4">
              {monthlyStats.map((m) => (
                <div key={m.month}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600">{m.month}</span>
                    <span className="text-xs text-slate-400">{m.total} leads</span>
                  </div>
                  <div className="flex gap-1 h-7">
                    {m.affar > 0 && (
                      <div
                        className="bg-green-400 rounded relative group cursor-default"
                        style={{ width: `${(m.affar / maxMonthlyValue) * 100}%`, minWidth: 4 }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Affär: {m.affar.toLocaleString("sv-SE")} kr
                        </div>
                      </div>
                    )}
                    {m.ejAffar > 0 && (
                      <div
                        className="bg-red-300 rounded relative group cursor-default"
                        style={{ width: `${(m.ejAffar / maxMonthlyValue) * 100}%`, minWidth: 4 }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Ej affär: {m.ejAffar.toLocaleString("sv-SE")} kr
                        </div>
                      </div>
                    )}
                    {m.affar === 0 && m.ejAffar === 0 && (
                      <div className="bg-slate-100 rounded h-full" style={{ width: "100%" }} />
                    )}
                  </div>
                  <div className="flex gap-3 mt-1">
                    {m.affar > 0 && <span className="text-[10px] text-green-700">{m.affar.toLocaleString("sv-SE")} kr</span>}
                    {m.ejAffar > 0 && <span className="text-[10px] text-red-600">-{m.ejAffar.toLocaleString("sv-SE")} kr</span>}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-400" />
                  <span className="text-[11px] text-slate-500">Affär</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-300" />
                  <span className="text-[11px] text-slate-500">Ej affär</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Source breakdown ────────────── */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Leadkällor</h2>
          {sourceStats.length === 0 ? (
            <p className="text-sm text-slate-400">Ingen data att visa.</p>
          ) : (
            <div className="space-y-3">
              {sourceStats.map((s) => {
                const convRate = s.total > 0 ? Math.round((s.affar / s.total) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{s.name}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400">{s.total} leads</span>
                        {s.affar > 0 && <span className="text-green-700">{convRate}% konv.</span>}
                      </div>
                    </div>
                    <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-slate-500 to-slate-400 rounded-full transition-all duration-500"
                        style={{ width: `${(s.total / maxSourceTotal) * 100}%` }}
                      />
                    </div>
                    {s.value > 0 && (
                      <p className="text-[10px] text-green-700 mt-0.5">{s.value.toLocaleString("sv-SE")} kr i affärsvärde</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Summary cards ──────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <SummaryCard label="Totalt leads" value={summary.total} />
        <SummaryCard label="Affärer" value={summary.affarCount} accent="text-green-700" />
        <SummaryCard label="Affärsvärde" value={`${summary.affarValue.toLocaleString("sv-SE")} kr`} accent="text-green-700" />
        <SummaryCard label="Förlorat värde" value={`${summary.ejAffarValue.toLocaleString("sv-SE")} kr`} accent="text-red-600" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent || "text-slate-900"}`}>{value}</p>
    </div>
  );
}
