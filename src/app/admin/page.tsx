import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Wrench, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: leadCount },
    { count: newLeadCount },
    { count: articleCount },
    { count: serviceCount },
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
  ]);

  const stats = [
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
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
