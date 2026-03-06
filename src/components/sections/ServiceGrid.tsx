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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-3">
            Våra tjänster
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Allt din bil behöver — under ett tak
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Från enkel service till avancerad diagnostik. Vi tar hand om din bil oavsett märke och
            modell.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Settings;
            return (
              <Link
                key={service.id}
                href={`/tjanster#${service.slug}`}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-amber-400 transition-colors group-hover:bg-amber-500 group-hover:text-slate-900">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tjanster"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            Se alla tjänster i detalj →
          </Link>
        </div>
      </div>
    </section>
  );
}
