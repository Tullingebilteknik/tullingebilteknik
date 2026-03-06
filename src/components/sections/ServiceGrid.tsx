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
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-3">
            Våra tjänster
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-700 text-foreground">
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
                className="premium-card group rounded-lg p-6 transition-all duration-300"
              >
                <Icon className="h-8 w-8 text-primary mb-4 transition-colors group-hover:text-primary/80" />
                <h3 className="font-heading font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/tjanster"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Se alla tjänster i detalj
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
