"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import type { Service } from "@/lib/types";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

/* ── Icon map ─────────────────────────────────────── */

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Settings, ShieldCheck, Circle, Thermometer, Search, ClipboardCheck,
  Droplets, Wind, Cog, Zap, Sparkles, Dog, Snowflake, Package, PackageOpen, Wrench,
};

/* ── Service card (desktop: always expanded, mobile: accordion) ── */

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = iconMap[service.icon] || Settings;
  const num = String(index + 1).padStart(2, "0");
  const [open, setOpen] = useState(false);

  return (
    <div id={service.slug} className="scroll-mt-24">
      <div className="group premium-card rounded-xl p-6 sm:p-8 relative overflow-hidden">
        {/* Ghost number */}
        <span className="absolute -top-3 -right-1 font-heading text-[80px] font-800 text-foreground/[0.02] leading-none select-none pointer-events-none">
          {num}
        </span>

        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          {/* Icon */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/20">
            <Icon
              className="h-5 w-5 text-muted-foreground/40 transition-colors duration-300 group-hover:text-primary"
              strokeWidth={1.5}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground/30 hidden sm:inline">
                  {num}
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-600 text-foreground">
                  {service.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {service.price && (
                  <span className="font-mono text-base sm:text-lg font-600 text-primary whitespace-nowrap">
                    {service.price}
                  </span>
                )}
                {/* Mobile accordion toggle */}
                <button
                  onClick={() => setOpen(!open)}
                  className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  aria-label={open ? "Dölj beskrivning" : "Visa beskrivning"}
                >
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Short description (always visible) */}
            <p className="text-sm text-muted-foreground mt-1 lg:hidden">
              {service.description}
            </p>

            {/* Desktop: always show long description */}
            <p className="text-muted-foreground leading-relaxed mt-2 hidden lg:block">
              {service.long_description}
            </p>

            {/* Mobile: accordion long description */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden lg:hidden"
                >
                  <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                    {service.long_description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTAs (fades in on hover, always visible on mobile when open) */}
            <div className={`flex items-center gap-4 mt-3 transition-all duration-300 ${
              open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}>
              {service.landing_content && (
                <Link
                  href={`/tjanster/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-500 text-primary"
                >
                  Läs mer
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <Link
                href={`/?service=${encodeURIComponent(service.slug)}#boka`}
                className="inline-flex items-center gap-1.5 text-sm font-500 text-muted-foreground hover:text-primary transition-colors"
              >
                Boka tjänst
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Wash pricing card ────────────────────────────── */

function WashCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = iconMap[service.icon] || Droplets;

  return (
    <div id={service.slug} className="scroll-mt-24">
      <div className="group premium-card rounded-xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/20">
          <Icon
            className="h-6 w-6 text-muted-foreground/40 transition-colors duration-300 group-hover:text-primary"
            strokeWidth={1.5}
          />
        </div>

        <h3 className="font-heading text-lg font-600 text-foreground mb-2">
          {service.title}
        </h3>

        {service.price && (
          <div className="mb-3">
            <span className="font-mono text-2xl font-700 text-primary">
              {service.price}
            </span>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {service.long_description}
        </p>

        <div className="flex items-center justify-center gap-4">
          {service.landing_content && (
            <Link
              href={`/tjanster/${service.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-500 text-primary/60 group-hover:text-primary transition-colors duration-300"
            >
              Läs mer
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <Link
            href={`/?service=${encodeURIComponent(service.slug)}#boka`}
            className="inline-flex items-center gap-1.5 text-sm font-500 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors duration-300"
          >
            Boka tvätt
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Addon item ───────────────────────────────────── */

function AddonItem({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] || Plus;

  return (
    <div className="group/addon flex items-center gap-4 py-4 border-b border-border/30 last:border-0 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-lg">
      <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 transition-colors group-hover/addon:bg-primary/10">
        <Icon className="h-4 w-4 text-primary/50 transition-colors group-hover/addon:text-primary" strokeWidth={1.5} />
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

/* ── Sticky mobile CTA ────────────────────────────── */

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById("tjanster-hero-end");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
        >
          <Link
            href="/#boka"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-primary text-primary-foreground font-heading font-600 text-sm shadow-[0_4px_24px_oklch(0.72_0.12_75/25%)] hover:shadow-[0_8px_32px_oklch(0.72_0.12_75/35%)] transition-shadow"
          >
            Boka service
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main content component ───────────────────────── */

interface TjansterContentProps {
  verkstadServices: Service[];
  washMain: Service[];
  washAddons: Service[];
}

export function TjansterContent({
  verkstadServices,
  washMain,
  washAddons,
}: TjansterContentProps) {
  return (
    <>
      {/* Verkstad */}
      <section className="py-16 sm:py-24 bg-muted tech-surface relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <Wrench className="h-5 w-5 text-primary" />
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  Verkstad
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-700 text-foreground">
                Mekaniska tjänster
              </h2>
              <div className="w-12 h-0.5 bg-primary mt-4" />
              <p className="mt-4 text-muted-foreground max-w-xl">
                Service, reparationer och diagnostik utförda av erfarna biltekniker.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={0.06}>
            {verkstadServices.map((service, i) => (
              <div key={service.id} className="mb-4">
                <ServiceCard service={service} index={i} />
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Tvätt & Rekond */}
      {(washMain.length > 0 || washAddons.length > 0) && (
        <section className="py-16 sm:py-24 bg-white relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                    Tvätt &amp; Rekond
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-700 text-foreground">
                  Biltvätt &amp; städning
                </h2>
                <div className="w-12 h-0.5 bg-primary mt-4" />
                <p className="mt-4 text-muted-foreground max-w-xl">
                  Professionell handtvätt och städning — från snabb utvändig tvätt till komplett in- och utvändig behandling.
                </p>
              </div>
            </ScrollReveal>

            {/* Wash pricing cards */}
            <ScrollReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {washMain.map((service, i) => (
                <WashCard key={service.id} service={service} index={i} />
              ))}
            </ScrollReveal>

            {/* Addons */}
            {washAddons.length > 0 && (
              <ScrollReveal>
                <div>
                  <h3 className="font-heading text-lg font-600 text-foreground mb-1">
                    Tillägg
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kan bokas i samband med tvätt, städ eller service.
                  </p>
                  <div className="bg-muted/30 rounded-xl border border-border/50 px-4 sm:px-6">
                    {washAddons.map((service) => (
                      <AddonItem key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <StickyMobileCTA />
    </>
  );
}
