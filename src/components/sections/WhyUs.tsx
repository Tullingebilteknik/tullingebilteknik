import { Award, Clock, Users, Wrench } from "lucide-react";

const reasons = [
  {
    icon: Wrench,
    title: "Modern utrustning",
    description:
      "Vi investerar kontinuerligt i den senaste diagnosutrustningen för att snabbt och korrekt identifiera problem.",
  },
  {
    icon: Users,
    title: "Erfarna mekaniker",
    description:
      "Vårt team har mångårig erfarenhet av alla bilmärken. Vi löser även de mest komplexa problemen.",
  },
  {
    icon: Clock,
    title: "Snabba ledtider",
    description:
      "Vi värdesätter din tid. De flesta jobb utförs samma dag eller senast dagen efter.",
  },
  {
    icon: Award,
    title: "Kvalitetsgaranti",
    description:
      "Vi använder originaldelar eller kvalitetsdelar med garanti. Ditt förtroende är vår prioritet.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-3">
            Varför välja oss
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Kvalitet och förtroende sedan dag ett
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="text-center">
                <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
