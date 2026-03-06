import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/sections/CTABanner";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

import {
  Settings,
  ShieldCheck,
  Circle,
  Thermometer,
  Search,
  ClipboardCheck,
  Droplets,
  Wind,
  Cog,
  Zap,
} from "lucide-react";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Se alla tjänster vi erbjuder på Tullinge Bilteknik. Service, bromsar, däck, AC, diagnostik och mer. Bilverkstad i Tullinge.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  ShieldCheck,
  Circle,
  Thermometer,
  Search,
  ClipboardCheck,
  Droplets,
  Wind,
  Cog,
  Zap,
};

function ServiceCard({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] || Settings;

  return (
    <div id={service.slug} className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg">
        <div className="flex items-start gap-5">
          <div className="shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h2>
            <p className="text-slate-600 leading-relaxed">{service.long_description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TjansterPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Våra tjänster
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Vi fixar allt med din bil
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Oavsett om det gäller enkel service eller komplicerad felsökning — vi har kompetensen
              och utrustningen.
            </p>
          </div>
        </section>

        {/* Service List */}
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {(services || []).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
