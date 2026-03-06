"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

// Gradient placeholders until real photos are added
const gradientMap: Record<string, string> = {
  Settings: "from-blue-900/20 to-slate-900/40",
  ShieldCheck: "from-emerald-900/20 to-slate-900/40",
  Circle: "from-amber-900/20 to-slate-900/40",
  Thermometer: "from-cyan-900/20 to-slate-900/40",
  Search: "from-purple-900/20 to-slate-900/40",
  ClipboardCheck: "from-lime-900/20 to-slate-900/40",
  Droplets: "from-sky-900/20 to-slate-900/40",
  Wind: "from-teal-900/20 to-slate-900/40",
  Cog: "from-orange-900/20 to-slate-900/40",
  Zap: "from-yellow-900/20 to-slate-900/40",
};

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeService = hoveredIndex !== null ? services[hoveredIndex] : null;
  const ActiveIcon = activeService ? iconMap[activeService.icon] || Settings : null;

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {/* Desktop: Hover reveal layout */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-12">
          {/* Service list — left side */}
          <ScrollReveal className="lg:col-span-3" stagger={0.08}>
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

          {/* Image reveal — right side */}
          <div className="lg:col-span-2 relative">
            <div className="sticky top-32 aspect-[4/5] rounded-xl overflow-hidden bg-muted">
              <AnimatePresence mode="wait">
                {activeService && ActiveIcon ? (
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute inset-0 bg-gradient-to-br ${gradientMap[activeService.icon] || "from-slate-900/20 to-slate-900/40"} flex items-center justify-center`}
                  >
                    <ActiveIcon className="h-24 w-24 text-white/10" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-sm text-white/60 leading-relaxed">
                        {activeService.description}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <p className="font-mono text-xs text-muted-foreground/30 uppercase tracking-widest">
                      Hovra för detaljer
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

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
  );
}
