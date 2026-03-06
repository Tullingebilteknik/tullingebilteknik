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
      <div className="bg-white rounded-xl border border-border/50 p-8 transition-all hover:shadow-md hover:border-primary/20">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-600 text-foreground mb-2">{service.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{service.long_description}</p>
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
        <section className="hero-dark noise-overlay relative py-20 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.16_0.015_260),transparent)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/30">
              Våra tjänster
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 text-white mt-4">
              Vi fixar allt med din bil
            </h1>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto">
              Oavsett om det gäller enkel service eller komplicerad felsökning — vi har kompetensen
              och utrustningen.
            </p>
          </div>
        </section>

        {/* Service List */}
        <section className="py-20 sm:py-24 bg-muted">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-5">
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
