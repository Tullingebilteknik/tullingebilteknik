import { Users, Star, Wrench, Clock } from "lucide-react";

const indicators = [
  { icon: Users, label: "500+ nöjda kunder" },
  { icon: Star, label: "4.9 ★ snittbetyg" },
  { icon: Wrench, label: "Alla bilmärken" },
  { icon: Clock, label: "Samma dag återkoppling" },
];

export function TrustBanner() {
  return (
    <section
      className="py-10 px-4 sm:px-6"
      style={{ backgroundColor: "oklch(0.12 0.005 260)" }}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {indicators.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <Icon
              className="h-5 w-5"
              strokeWidth={1.5}
              style={{ color: "oklch(0.72 0.12 75)" }}
            />
            <span className="font-heading text-xs sm:text-sm text-white/70 tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
