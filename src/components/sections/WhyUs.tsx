const reasons = [
  {
    num: "01",
    title: "Modern utrustning",
    description:
      "Vi investerar kontinuerligt i den senaste diagnosutrustningen för att snabbt och korrekt identifiera problem.",
  },
  {
    num: "02",
    title: "Erfarna mekaniker",
    description:
      "Vårt team har mångårig erfarenhet av alla bilmärken. Vi löser även de mest komplexa problemen.",
  },
  {
    num: "03",
    title: "Snabba ledtider",
    description:
      "Vi värdesätter din tid. De flesta jobb utförs samma dag eller senast dagen efter.",
  },
  {
    num: "04",
    title: "Kvalitetsgaranti",
    description:
      "Vi använder originaldelar eller kvalitetsdelar med garanti. Ditt förtroende är vår prioritet.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 sm:py-28 bg-muted section-angle-top">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <p className="font-mono text-xs uppercase tracking-widest text-primary shrink-0">
              Varför välja oss
            </p>
            <div className="flex-1 h-px bg-primary/15" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-700 text-foreground">
            Kvalitet och förtroende sedan dag ett
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-5">
            {reasons.slice(0, 2).map((reason) => (
              <ReasonCard key={reason.num} reason={reason} />
            ))}
          </div>
          <div className="space-y-5 sm:mt-8">
            {reasons.slice(2, 4).map((reason) => (
              <ReasonCard key={reason.num} reason={reason} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReasonCard({ reason }: { reason: typeof reasons[number] }) {
  return (
    <div className="reveal relative bg-white rounded-lg p-8 border border-border/50 border-l-2 border-l-primary/40 shadow-sm hover:border-l-secondary hover:shadow-md transition-all duration-300">
      {/* Ghost number */}
      <span className="absolute -top-2 -left-1 font-heading text-7xl font-bold text-primary/[0.04] select-none pointer-events-none leading-none">
        {reason.num}
      </span>
      {/* Content */}
      <div className="relative pl-1 pt-4">
        <span className="font-mono text-xs tracking-wider text-primary/60 uppercase">{reason.num}</span>
        <h3 className="font-heading text-lg font-semibold text-foreground mt-1 mb-2">
          {reason.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
      </div>
    </div>
  );
}
