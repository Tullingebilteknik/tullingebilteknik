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
      <div className="premium-card rounded-lg p-8 transition-all hover:shadow-md">
        <div className="flex items-start gap-5">
          <Icon className="h-8 w-8 text-primary shrink-0 mt-1" />
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{service.title}</h2>
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
        <section className="hero-dark relative py-16 sm:py-20">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold tracking-wide text-white/80 uppercase mb-3">
              Våra tjänster
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 text-white">
              Vi fixar allt med din bil
            </h1>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Oavsett om det gäller enkel service eller komplicerad felsökning — vi har kompetensen
              och utrustningen.
            </p>
          </div>
        </section>

        {/* Service List */}
        <section className="py-16 sm:py-20 bg-muted">
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
