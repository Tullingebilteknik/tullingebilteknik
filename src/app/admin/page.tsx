"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  FileText,
  Wrench,
  TrendingUp,
  CalendarDays,
  Clock,
  AlertCircle,
  ChevronRight,
  BarChart3,
  ArrowRight,
  Banknote,
  Target,
  Hash,
} from "lucide-react";

/* ── Animated counter hook ───────────────────────── */

function useAnimatedCounter(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    fromRef.current = 0;
    startRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

/* ── Status config ───────────────────────────────── */

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

/* ── Helpers ──────────────────────────────────────── */

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

function formatCurrency(n: number): string {
  return n.toLocaleString("sv-SE");
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 10) return "God morgon";
  if (hour < 17) return "Hej";
  return "God kväll";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Stat card config ────────────────────────────── */

interface StatConfig {
  title: string;
  key: string;
  icon: typeof Users;
  href: string;
  color: string;
  iconColor: string;
}

const statConfigs: StatConfig[] = [
  {
    title: "Dagens bokningar",
    key: "todayBookings",
    icon: CalendarDays,
    href: "/admin/schema",
    color: "bg-orange-50",
    iconColor: "text-orange-600 bg-orange-100",
  },
  {
    title: "Pågående jobb",
    key: "inProgress",
    icon: Clock,
    href: "/admin/leads",
    color: "bg-purple-50",
    iconColor: "text-purple-600 bg-purple-100",
  },
  {
    title: "Nya leads",
    key: "newLeads",
    icon: TrendingUp,
    href: "/admin/leads",
    color: "bg-amber-50",
    iconColor: "text-amber-600 bg-amber-100",
  },
  {
    title: "Totalt leads",
    key: "totalLeads",
    icon: Users,
    href: "/admin/leads",
    color: "bg-blue-50",
    iconColor: "text-blue-600 bg-blue-100",
  },
  {
    title: "Publicerade artiklar",
    key: "articles",
    icon: FileText,
    href: "/admin/artiklar",
    color: "bg-green-50",
    iconColor: "text-green-600 bg-green-100",
  },
  {
    title: "Aktiva tjänster",
    key: "services",
    icon: Wrench,
    href: "/admin/tjanster",
    color: "bg-slate-50",
    iconColor: "text-slate-600 bg-slate-100",
  },
];

/* ── Animated stat card ──────────────────────────── */

function StatCard({ config, value, index }: { config: StatConfig; value: number; index: number }) {
  const animatedValue = useAnimatedCounter(value);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={config.href}>
        <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <div className={`absolute inset-0 ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {config.title}
            </CardTitle>
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${config.iconColor} transition-transform duration-200 group-hover:scale-110`}>
              <Icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold font-mono text-slate-900">
              {animatedValue}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

/* ── Status distribution bar ─────────────────────── */

function StatusBar({ leads }: { leads: Lead[] }) {
  const counts: Record<string, number> = { ska_kontaktas: 0, bokad: 0, ej_affar: 0, affar: 0 };
  for (const l of leads) counts[l.status] = (counts[l.status] || 0) + 1;
  const total = leads.length || 1;

  const segments = [
    { key: "ska_kontaktas", color: "bg-amber-400", label: "Ska kontaktas" },
    { key: "bokad", color: "bg-blue-400", label: "Bokad" },
    { key: "affar", color: "bg-green-400", label: "Affär" },
    { key: "ej_affar", color: "bg-red-300", label: "Ej affär" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {segments.map((s) => {
          const pct = (counts[s.key] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={s.key}
              className={`${s.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className={`h-2 w-2 rounded-full ${s.color}`} />
            <span>{s.label}</span>
            <span className="font-mono font-medium text-slate-700">{counts[s.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Quick action buttons ────────────────────────── */

const quickActions = [
  { label: "Ny artikel", href: "/admin/artiklar", icon: FileText },
  { label: "Hantera tjänster", href: "/admin/tjanster", icon: Wrench },
  { label: "Visa schema", href: "/admin/schema", icon: CalendarDays },
  { label: "Lead-statistik", href: "/admin/leads/statistik", icon: BarChart3 },
];

/* ── Skeleton components ─────────────────────────── */

function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
      </CardHeader>
      <CardContent>
        <div className="h-10 w-16 animate-pulse rounded bg-slate-200" />
      </CardContent>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
      <div className="flex-1" />
      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
    </div>
  );
}

/* ── Main dashboard ──────────────────────────────── */

export default function AdminDashboard() {
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];

      const [
        { count: totalLeads },
        { count: newLeads },
        { count: inProgress },
        { count: todayBookings },
        { count: articles },
        { count: services },
        { data: recentLeads },
        { data: allLeads },
      ] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "ska_kontaktas"),
        supabase.from("leads").select("*", { count: "exact", head: true }).in("status", ["bokad", "affar"]),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("scheduled_date", today),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("is_visible", true),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("leads").select("id, status, deal_value"),
      ]);

      return {
        counts: {
          totalLeads: totalLeads || 0,
          newLeads: newLeads || 0,
          inProgress: inProgress || 0,
          todayBookings: todayBookings || 0,
          articles: articles || 0,
          services: services || 0,
        } as Record<string, number>,
        recentLeads: (recentLeads || []) as Lead[],
        allLeads: (allLeads || []) as Pick<Lead, "id" | "status" | "deal_value">[],
      };
    },
    staleTime: 30_000,
  });

  // Revenue calculations
  const deals = data?.allLeads.filter((l) => l.status === "affar") || [];
  const totalRevenue = deals.reduce((sum, l) => sum + (l.deal_value || 0), 0);
  const avgDealValue = deals.length ? Math.round(totalRevenue / deals.length) : 0;
  const totalAll = data?.allLeads.length || 1;
  const conversionRate = Math.round((deals.length / totalAll) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-bold text-slate-900">{getGreeting()}</h1>
        <p className="text-sm text-slate-500 mt-1 capitalize">{getFormattedDate()}</p>
      </motion.div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statConfigs.map((config, i) => (
            <StatCard
              key={config.key}
              config={config}
              value={data?.counts[config.key] || 0}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">
                Senaste leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="divide-y">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              ) : data?.recentLeads.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">Inga leads ännu</p>
              ) : (
                <div className="divide-y">
                  {data?.recentLeads.map((lead, i) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                    >
                      <Link
                        href="/admin/leads"
                        className="flex items-center gap-3 py-3 group hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900 truncate">
                              {lead.name}
                            </span>
                            {lead.preferred_time === "Snarast" && (
                              <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lead.selected_services?.length ? (
                              <span className="text-xs text-slate-400 truncate">
                                {lead.selected_services[0]}
                                {lead.selected_services.length > 1 && ` +${lead.selected_services.length - 1}`}
                              </span>
                            ) : lead.service_interest ? (
                              <span className="text-xs text-slate-400 truncate">
                                {lead.service_interest}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {timeAgo(lead.created_at)}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs flex-shrink-0 ${statusColors[lead.status] || ""}`}
                        >
                          {statusLabels[lead.status] || lead.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="pt-3 mt-1 border-t">
                <Link
                  href="/admin/leads"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Visa alla leads
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">
                Intäktsöversikt
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-200" />
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-14 animate-pulse rounded bg-slate-200" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Total revenue */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-mono text-green-700">
                        {formatCurrency(totalRevenue)}
                      </span>
                      <span className="text-lg text-slate-400">kr</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Totalt affärsvärde</p>
                  </div>

                  {/* Status distribution */}
                  <StatusBar leads={data?.allLeads as Lead[] || []} />

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <Hash className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {deals.length}
                      </div>
                      <div className="text-xs text-slate-500">Affärer</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <Banknote className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {formatCurrency(avgDealValue)}
                      </div>
                      <div className="text-xs text-slate-500">Snitt/affär</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <Target className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {conversionRate}%
                      </div>
                      <div className="text-xs text-slate-500">Konvertering</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <Link
                      href="/admin/leads/statistik"
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Se detaljerad statistik
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Icon className="h-5 w-5 text-slate-500" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
