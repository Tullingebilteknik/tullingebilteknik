import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Wrench, TrendingUp, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const [
    { count: leadCount },
    { count: newLeadCount },
    { count: articleCount },
    { count: serviceCount },
    { count: todayBookings },
    { count: inProgressCount },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("is_visible", true),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("scheduled_date", today),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress"),
  ]);

  const stats = [
    {
      title: "Dagens bokningar",
      value: todayBookings || 0,
      icon: CalendarDays,
      href: "/admin/schema",
      color: "text-orange-600 bg-orange-100",
    },
    {
      title: "Pågående jobb",
      value: inProgressCount || 0,
      icon: Clock,
      href: "/admin/leads",
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Nya leads",
      value: newLeadCount || 0,
      icon: TrendingUp,
      href: "/admin/leads",
      color: "text-amber-600 bg-amber-100",
    },
    {
      title: "Totalt leads",
      value: leadCount || 0,
      icon: Users,
      href: "/admin/leads",
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Publicerade artiklar",
      value: articleCount || 0,
      icon: FileText,
      href: "/admin/artiklar",
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Aktiva tjänster",
      value: serviceCount || 0,
      icon: Wrench,
      href: "/admin/tjanster",
      color: "text-slate-600 bg-slate-100",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
