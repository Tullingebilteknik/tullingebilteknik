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
  Sparkles,
  Dog,
  Snowflake,
  Package,
  PackageOpen,
  Wrench,
  Plus,
} from "lucide-react";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Se alla tjänster vi erbjuder på Tullinge Bilteknik. Service, bromsar, däck, AC, diagnostik, biltvätt och rekond. Bilverkstad i Tullinge.",
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
  Sparkles,
  Dog,
  Snowflake,
  Package,
  PackageOpen,
  Wrench,
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
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-xl font-600 text-foreground mb-2">{service.title}</h2>
              {service.price && (
                <span className="font-mono text-lg font-600 text-primary whitespace-nowrap shrink-0">
                  {service.price}
                </span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{service.long_description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddonItem({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] || Plus;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/30 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary/70" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-sm font-600 text-foreground">{service.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
      </div>
      {service.price && (
        <span className="font-mono text-sm font-600 text-primary whitespace-nowrap shrink-0">
          {service.price}
        </span>
      )}
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

  const allServices = (services || []) as Service[];
  const verkstadServices = allServices.filter((s) => s.category === "verkstad");
  const washMain = allServices.filter((s) => s.category === "tvatt_rekond" && !s.is_addon);
  const washAddons = allServices.filter((s) => s.category === "tvatt_rekond" && s.is_addon);

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
              Verkstad, tvätt &amp; rekond
            </h1>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto">
              Från mekanisk expertis till skonsam handtvätt — allt din bil behöver under ett och samma tak.
            </p>
          </div>
        </section>

        {/* Verkstad */}
        <section className="py-20 sm:py-24 bg-muted">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="h-5 w-5 text-primary" />
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  Verkstad
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-700 text-foreground">
                Mekaniska tjänster
              </h2>
              <p className="mt-2 text-muted-foreground">
                Service, reparationer och diagnostik utförda av erfarna biltekniker.
              </p>
            </div>
            <div className="space-y-5">
              {verkstadServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Tvätt & Rekond */}
        {(washMain.length > 0 || washAddons.length > 0) && (
          <section className="py-20 sm:py-24 bg-white">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                    Tvätt &amp; Rekond
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-700 text-foreground">
                  Biltvätt &amp; städning
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Professionell handtvätt och städning — från snabb utvändig tvätt till komplett in- och utvändig behandling.
                </p>
              </div>

              {/* Huvudtjänster */}
              <div className="space-y-5">
                {washMain.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Tillägg */}
              {washAddons.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-heading text-lg font-600 text-foreground mb-1">
                    Tillägg
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kan bokas i samband med tvätt, städ eller service.
                  </p>
                  <div className="bg-muted/50 rounded-xl border border-border/50 px-6">
                    {washAddons.map((service) => (
                      <AddonItem key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
