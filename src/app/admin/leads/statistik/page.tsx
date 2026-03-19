"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ── Types ─────────────────────────────────────── */

type StatusKey = Lead["status"];

const statusLabels: Record<StatusKey, string> = {
  ska_kontaktas: "Ska kontaktas",
  bokad: "Bokad",
  ej_affar: "Ej affär",
  affar: "Affär",
};

const statusNodeColors: Record<StatusKey, { bg: string; border: string; text: string }> = {
  ska_kontaktas: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  bokad: { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a5f" },
  ej_affar: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
  affar: { bg: "#dcfce7", border: "#22c55e", text: "#14532d" },
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dec",
];

/* ── Main page ─────────────────────────────────── */

export default function LeadStatistikPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setLeads(data); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Derived stats ───────────────────────── */

  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus: Record<StatusKey, Lead[]> = {
      ska_kontaktas: [],
      bokad: [],
      ej_affar: [],
      affar: [],
    };
    for (const l of leads) {
      byStatus[l.status]?.push(l);
    }

    const affarValue = byStatus.affar.reduce((sum, l) => sum + (l.deal_value || 0), 0);
    const ejAffarValue = byStatus.ej_affar.reduce((sum, l) => sum + (l.deal_value || 0), 0);

    // Monthly breakdown
    const monthlyMap = new Map<string, { month: string; affar: number; ej_affar: number; total: number }>();
    for (const l of leads) {
      const d = new Date(l.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthlyMap.has(key)) monthlyMap.set(key, { month: label, affar: 0, ej_affar: 0, total: 0 });
      const entry = monthlyMap.get(key)!;
      entry.total++;
      if (l.status === "affar") entry.affar += l.deal_value || 0;
      if (l.status === "ej_affar") entry.ej_affar += l.deal_value || 0;
    }
    const monthly = [...monthlyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    // Source breakdown
    const sourceMap = new Map<string, { total: number; affar: number; value: number }>();
    for (const l of leads) {
      const src = l.source_page || "okänd";
      if (!sourceMap.has(src)) sourceMap.set(src, { total: 0, affar: 0, value: 0 });
      const entry = sourceMap.get(src)!;
      entry.total++;
      if (l.status === "affar") {
        entry.affar++;
        entry.value += l.deal_value || 0;
      }
    }
    const sources = [...sourceMap.entries()]
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([name, data]) => ({ name, ...data }));

    return { total, byStatus, affarValue, ejAffarValue, monthly, sources };
  }, [leads]);

  const maxMonthlyValue = Math.max(
    ...stats.monthly.map((m) => Math.max(m.affar, m.ej_affar, 1)),
    1
  );

  const maxSourceTotal = Math.max(...stats.sources.map((s) => s.total), 1);

  /* ── Render ────────────────────────────────── */

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/leads" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Leadstatistik</h1>
      </div>

      {/* ── Flowchart ──────────────────────── */}
      <div className="rounded-xl border bg-white p-6 sm:p-8 mb-8 overflow-x-auto">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Konverteringsflöde</h2>
        <div className="min-w-[600px]">
          <svg viewBox="0 0 800 260" className="w-full" style={{ maxHeight: 280 }}>
            {/* Inkomna → Ska kontaktas */}
            <FlowArrow x1={95} y1={80} x2={215} y2={80} ratio={1} />
            {/* Ska kontaktas → Bokad */}
            <FlowArrow
              x1={325} y1={80} x2={415} y2={80}
              ratio={stats.total > 0 ? (stats.byStatus.bokad.length + stats.byStatus.affar.length) / stats.total : 0}
            />
            {/* Bokad → Affär */}
            <FlowArrow
              x1={525} y1={80} x2={615} y2={80}
              ratio={stats.total > 0 ? stats.byStatus.affar.length / stats.total : 0}
            />
            {/* Ska kontaktas → Ej affär (downward) */}
            <FlowArrowDown
              x={270} y1={110} y2={180}
              ratio={stats.total > 0 ? stats.byStatus.ej_affar.length / stats.total : 0}
            />

            {/* Nodes */}
            <FlowNode x={10} y={45} width={85} label="Inkomna" count={stats.total} color={{ bg: "#f1f5f9", border: "#94a3b8", text: "#334155" }} />
            <FlowNode x={215} y={45} width={110} label={statusLabels.ska_kontaktas} count={stats.byStatus.ska_kontaktas.length} color={statusNodeColors.ska_kontaktas} />
            <FlowNode x={415} y={45} width={110} label={statusLabels.bokad} count={stats.byStatus.bokad.length} color={statusNodeColors.bokad} />
            <FlowNode x={615} y={45} width={110} label={statusLabels.affar} count={stats.byStatus.affar.length} color={statusNodeColors.affar} value={stats.affarValue} />
            <FlowNode x={215} y={175} width={110} label={statusLabels.ej_affar} count={stats.byStatus.ej_affar.length} color={statusNodeColors.ej_affar} value={stats.ejAffarValue} isLoss />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Monthly bar chart ──────────── */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Värde per månad</h2>
          {stats.monthly.length === 0 ? (
            <p className="text-sm text-slate-400">Ingen data att visa.</p>
          ) : (
            <div className="space-y-4">
              {stats.monthly.map((m) => (
                <div key={m.month}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600">{m.month}</span>
                    <span className="text-xs text-slate-400">{m.total} leads</span>
                  </div>
                  <div className="flex gap-1 h-7">
                    {m.affar > 0 && (
                      <div
                        className="bg-green-400 rounded-sm relative group cursor-default"
                        style={{ width: `${(m.affar / maxMonthlyValue) * 100}%`, minWidth: 4 }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Affär: {m.affar.toLocaleString("sv-SE")} kr
                        </div>
                      </div>
                    )}
                    {m.ej_affar > 0 && (
                      <div
                        className="bg-red-300 rounded-sm relative group cursor-default"
                        style={{ width: `${(m.ej_affar / maxMonthlyValue) * 100}%`, minWidth: 4 }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Ej affär: {m.ej_affar.toLocaleString("sv-SE")} kr
                        </div>
                      </div>
                    )}
                    {m.affar === 0 && m.ej_affar === 0 && (
                      <div className="bg-slate-100 rounded-sm h-full" style={{ width: "100%" }} />
                    )}
                  </div>
                  <div className="flex gap-3 mt-1">
                    {m.affar > 0 && <span className="text-[10px] text-green-700">{m.affar.toLocaleString("sv-SE")} kr</span>}
                    {m.ej_affar > 0 && <span className="text-[10px] text-red-600">-{m.ej_affar.toLocaleString("sv-SE")} kr</span>}
                  </div>
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-green-400" />
                  <span className="text-[11px] text-slate-500">Affär</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-300" />
                  <span className="text-[11px] text-slate-500">Ej affär</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Source breakdown ────────────── */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Leadkällor</h2>
          {stats.sources.length === 0 ? (
            <p className="text-sm text-slate-400">Ingen data att visa.</p>
          ) : (
            <div className="space-y-3">
              {stats.sources.map((s) => {
                const convRate = s.total > 0 ? Math.round((s.affar / s.total) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{s.name}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400">{s.total} leads</span>
                        {s.affar > 0 && (
                          <span className="text-green-700">{convRate}% konv.</span>
                        )}
                      </div>
                    </div>
                    <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full transition-all duration-500"
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
        <SummaryCard label="Totalt leads" value={stats.total} />
        <SummaryCard label="Affärer" value={stats.byStatus.affar.length} accent="text-green-700" />
        <SummaryCard label="Affärsvärde" value={`${stats.affarValue.toLocaleString("sv-SE")} kr`} accent="text-green-700" />
        <SummaryCard label="Förlorat värde" value={`${stats.ejAffarValue.toLocaleString("sv-SE")} kr`} accent="text-red-600" />
      </div>
    </div>
  );
}

/* ── SVG Flow components ──────────────────────── */

function FlowNode({
  x, y, width, label, count, color, value, isLoss,
}: {
  x: number; y: number; width: number;
  label: string; count: number;
  color: { bg: string; border: string; text: string };
  value?: number; isLoss?: boolean;
}) {
  const height = value ? 70 : 55;
  return (
    <g>
      <rect
        x={x} y={y} width={width} height={height} rx={10}
        fill={color.bg} stroke={color.border} strokeWidth={2}
      />
      <text x={x + width / 2} y={y + 20} textAnchor="middle" fill={color.text} fontSize={11} fontWeight={600}>
        {label}
      </text>
      <text x={x + width / 2} y={y + 40} textAnchor="middle" fill={color.text} fontSize={20} fontWeight={700}>
        {count}
      </text>
      {value != null && value > 0 && (
        <text x={x + width / 2} y={y + 58} textAnchor="middle" fill={color.text} fontSize={10} opacity={0.7}>
          {isLoss ? "-" : ""}{value.toLocaleString("sv-SE")} kr
        </text>
      )}
    </g>
  );
}

function FlowArrow({ x1, y1, x2, y2, ratio }: { x1: number; y1: number; x2: number; y2: number; ratio: number }) {
  const strokeWidth = Math.max(2, ratio * 8);
  const opacity = Math.max(0.15, ratio);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={strokeWidth} opacity={opacity} />
      <polygon
        points={`${x2},${y2 - 5} ${x2},${y2 + 5} ${x2 + 8},${y2}`}
        fill="#94a3b8" opacity={opacity}
      />
    </g>
  );
}

function FlowArrowDown({ x, y1, y2, ratio }: { x: number; y1: number; y2: number; ratio: number }) {
  const strokeWidth = Math.max(2, ratio * 8);
  const opacity = Math.max(0.15, ratio);
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#94a3b8" strokeWidth={strokeWidth} opacity={opacity} />
      <polygon
        points={`${x - 5},${y2} ${x + 5},${y2} ${x},${y2 + 8}`}
        fill="#94a3b8" opacity={opacity}
      />
    </g>
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
