"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, Suspense } from "react";
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
import { ScrollReveal } from "@/components/animation/ScrollReveal";

const VolvoDiagnosisScene = dynamic(
  () => import("@/components/3d/VolvoDiagnosis"),
  { ssr: false }
);

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

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeService = hoveredIndex !== null ? services[hoveredIndex] : null;

  return (
    <>
      {/* Dark-to-light transition */}
      <div className="h-32 bg-gradient-to-b from-[oklch(0.12_0.005_260)] via-[oklch(0.55_0.003_260)] to-white" />

      <section className="py-12 sm:py-20 bg-white tech-surface relative overflow-hidden">
        {/* Full-section 3D Volvo background — desktop only */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          <Suspense fallback={null}>
            <VolvoDiagnosisScene
              activeSlug={activeService?.slug ?? null}
            />
          </Suspense>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="mb-16">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Tjänster
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-700 text-foreground mt-3">
                Allt din bil behöver
              </h2>
            </div>
          </ScrollReveal>

          {/* Desktop: Service list with 3D background */}
          <ScrollReveal className="hidden lg:block max-w-xl bg-white/40 backdrop-blur-sm rounded-2xl px-6 py-2" stagger={0.08}>
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Settings;
              const num = String(index + 1).padStart(2, "0");
              return (
                <Link
                  key={service.id}
                  href={`/tjanster#${service.slug}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group flex items-center gap-6 py-5 border-b border-border/50 transition-colors hover:border-primary/30"
                >
                  <span className="font-mono text-xs text-muted-foreground/40 w-6 shrink-0">
                    {num}
                  </span>
                  <Icon className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                  <span className="font-heading text-lg font-600 text-foreground/70 group-hover:text-foreground transition-colors">
                    {service.title}
                  </span>
                  <span className="ml-auto text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all">
                    &rarr;
                  </span>
                </Link>
              );
            })}
          </ScrollReveal>

          {/* Mobile: Card layout */}
          <ScrollReveal className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.06}>
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Settings;
              const num = String(index + 1).padStart(2, "0");
              return (
                <Link
                  key={service.id}
                  href={`/tjanster#${service.slug}`}
                  className="group premium-card rounded-lg p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground/40">{num}</span>
                    <h3 className="font-heading font-600 text-foreground mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </ScrollReveal>

          <ScrollReveal className="mt-12">
            <Link
              href="/tjanster"
              className="group inline-flex items-center gap-2 text-sm font-500 text-foreground/60 hover:text-foreground transition-colors"
            >
              Se alla tjänster
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
