"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
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

/* ── Flow node order & edge definitions ────────── */

const FLOW_STATES: LeadState[] = ["INCOMING", "TO_BE_CONTACTED", "BOOKED", "DEAL"];
const BOTTOM_STATE: LeadState = "NO_DEAL";

const EDGES: { from: LeadState; to: LeadState }[] = [
  { from: "INCOMING", to: "TO_BE_CONTACTED" },
  { from: "TO_BE_CONTACTED", to: "BOOKED" },
  { from: "BOOKED", to: "DEAL" },
  { from: "TO_BE_CONTACTED", to: "NO_DEAL" },
];

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

/* ── GlassNode component ──────────────────────── */

function GlassNode({
  id,
  label,
  count,
  value,
  isActive,
  onClick,
}: {
  id: LeadState;
  label: string;
  count: number;
  value: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const color = stateColors[id];
  const valueText =
    value > 0
      ? `${id === "NO_DEAL" ? "-" : ""}${value.toLocaleString("sv-SE")} kr`
      : null;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer focus:outline-none"
      style={{ minWidth: 140 }}
    >
      {/* Glow ring when active */}
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className="absolute -inset-1.5 rounded-2xl"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}60`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <div
        className="relative rounded-xl px-6 py-4 flex flex-col items-center text-center transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isActive
            ? `1px solid ${color}50`
            : "1px solid rgba(255, 255, 255, 0.08)",
          borderTop: `2px solid ${color}`,
          boxShadow: isActive
            ? `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px ${color}15`
            : "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Label */}
        <span
          className="text-[11px] uppercase tracking-[1.5px] mb-2 transition-colors duration-300"
          style={{ color: isActive ? `${color}` : "rgba(255, 255, 255, 0.35)" }}
        >
          {label}
        </span>

        {/* Count */}
        <span
          className="text-3xl font-semibold tabular-nums transition-colors duration-300"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            color: "#ffffff",
            textShadow: isActive ? `0 0 20px ${color}40` : "0 0 10px rgba(255,255,255,0.1)",
          }}
        >
          {count}
        </span>

        {/* Value */}
        {valueText && (
          <span className="text-[11px] mt-1.5 text-white/30 font-mono">
            {valueText}
          </span>
        )}
      </div>
    </motion.button>
  );
}

/* ── FlowEdge (CSS animated line) ─────────────── */

function FlowEdge({
  from,
  to,
  conversionRate,
  direction,
}: {
  from: LeadState;
  to: LeadState;
  conversionRate: number;
  direction: "horizontal" | "vertical";
}) {
  const color = stateColors[to];
  const thickness = Math.max(2, conversionRate * 6);

  if (direction === "horizontal") {
    return (
      <div className="flex items-center mx-1" style={{ width: 40 }}>
        <div className="relative w-full overflow-hidden" style={{ height: thickness }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `${color}30` }}
          />
          <motion.div
            className="absolute inset-y-0 rounded-full"
            style={{
              width: "40%",
              background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
            }}
            animate={{ left: ["-40%", "100%"] }}
            transition={{ duration: 2 + (1 - conversionRate) * 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  // Vertical edge (to NO_DEAL)
  return (
    <div className="flex flex-col items-center my-1" style={{ height: 48 }}>
      <div className="relative overflow-hidden" style={{ width: thickness, height: "100%" }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `${color}30` }}
        />
        <motion.div
          className="absolute inset-x-0 rounded-full"
          style={{
            height: "40%",
            background: `linear-gradient(180deg, transparent, ${color}80, transparent)`,
          }}
          animate={{ top: ["-40%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────── */

export default function LeadStatistikPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeNode, setActiveNode] = useState<LeadState | null>(null);
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

  /* ── Edge data ───────────────────────────── */

  const edgeRates = useMemo(() => {
    const map: Record<string, number> = {};
    for (const edge of payload.edges) {
      map[`${edge.source}-${edge.target}`] = edge.conversionRate;
    }
    return map;
  }, [payload.edges]);

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
      <div className="rounded-xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mb-8 overflow-visible">
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

        {/* Flow layout */}
        <div className="px-6 pb-8 pt-4">
          {/* Main horizontal flow */}
          <div className="flex items-center justify-center gap-0">
            {FLOW_STATES.map((id, i) => {
              const node = payload.nodes[id];
              const isActive = activeNode === id;
              const edgeKey = i < FLOW_STATES.length - 1
                ? `${FLOW_STATES[i]}-${FLOW_STATES[i + 1]}`
                : null;

              return (
                <div key={id} className="flex items-center">
                  <GlassNode
                    id={id}
                    label={node.label}
                    count={node.metrics.count}
                    value={node.metrics.financialValue}
                    isActive={isActive}
                    onClick={() => setActiveNode(isActive ? null : id)}
                  />
                  {edgeKey && (
                    <FlowEdge
                      from={FLOW_STATES[i]}
                      to={FLOW_STATES[i + 1]}
                      conversionRate={edgeRates[edgeKey] ?? 0}
                      direction="horizontal"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Vertical branch to NO_DEAL */}
          <div className="flex justify-center mt-0">
            {/* Offset to align under TO_BE_CONTACTED (2nd node) */}
            <div className="flex flex-col items-center" style={{ marginLeft: "-220px" }}>
              <FlowEdge
                from="TO_BE_CONTACTED"
                to="NO_DEAL"
                conversionRate={edgeRates["TO_BE_CONTACTED-NO_DEAL"] ?? 0}
                direction="vertical"
              />
              <GlassNode
                id={BOTTOM_STATE}
                label={payload.nodes[BOTTOM_STATE].label}
                count={payload.nodes[BOTTOM_STATE].metrics.count}
                value={payload.nodes[BOTTOM_STATE].metrics.financialValue}
                isActive={activeNode === BOTTOM_STATE}
                onClick={() =>
                  setActiveNode(activeNode === BOTTOM_STATE ? null : BOTTOM_STATE)
                }
              />
            </div>
          </div>
        </div>
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
