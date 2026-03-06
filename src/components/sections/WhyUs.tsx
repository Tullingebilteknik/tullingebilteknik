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
    <section className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <p className="font-mono text-xs uppercase tracking-widest text-primary shrink-0">
              Varför välja oss
            </p>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-700 uppercase text-foreground">
            Kvalitet och förtroende sedan dag ett
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reasons.map((reason) => (
            <div
              key={reason.num}
              className="glass-panel rounded-sm p-6 flex items-start gap-5"
            >
              <div className="shrink-0 w-16 h-16 flex items-center justify-center border border-primary/20 rounded-sm">
                <span className="font-mono text-3xl font-bold text-primary">{reason.num}</span>
              </div>
              <div>
                <h3 className="font-heading uppercase text-sm tracking-wider text-foreground font-600 mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
