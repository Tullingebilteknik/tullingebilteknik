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
} from "lucide-react";
import type { Service } from "@/lib/types";

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
  return (
    <section className="py-20 sm:py-28 bg-background bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left-aligned header with line */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <p className="font-mono text-xs uppercase tracking-widest text-primary shrink-0">
              Våra tjänster
            </p>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-700 uppercase text-foreground">
            Allt din bil behöver — under ett tak
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Från enkel service till avancerad diagnostik. Vi tar hand om din bil oavsett märke och
            modell.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Settings;
            return (
              <Link
                key={service.id}
                href={`/tjanster#${service.slug}`}
                className="glass-panel corner-marks group relative rounded-sm p-6 transition-all duration-300 hover:border-primary/25 hover:-translate-y-0.5 hover:edge-glow"
              >
                <Icon className="h-8 w-8 text-primary/60 mb-4 transition-all group-hover:text-primary drop-shadow-[0_0_4px_oklch(0.75_0.15_195_/_20%)]" />
                <h3 className="font-heading font-600 text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/tjanster"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            Se alla tjänster i detalj
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
