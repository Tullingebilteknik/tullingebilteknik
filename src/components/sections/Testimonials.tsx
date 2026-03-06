const testimonials = [
  {
    id: "001",
    name: "Anna K.",
    text: "Fantastisk service! De fixade mitt AC-problem på en dag och priset var mycket rimligt. Rekommenderas varmt!",
  },
  {
    id: "002",
    name: "Erik L.",
    text: "Har gått hit i flera år nu. Alltid ärliga med vad som behöver göras och vad som kan vänta. Pålitlig verkstad.",
  },
  {
    id: "003",
    name: "Maria S.",
    text: "Bästa verkstaden i Tullinge! Snabb service, bra priser och trevlig personal. Min bil har aldrig gått bättre.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <p className="font-mono text-xs uppercase tracking-widest text-primary shrink-0">
              Kundrecensioner
            </p>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-700 uppercase text-foreground">
            Vad våra kunder säger
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`glass-panel rounded-sm p-8 relative ${i === 1 ? "md:mt-6" : ""}`}
            >
              <p className="font-mono text-xs text-primary/40 tracking-wider mb-4">
                RECENSION #{t.id}
              </p>

              {/* Decorative quote mark */}
              <span className="absolute top-6 right-6 font-heading text-6xl text-primary/10 leading-none select-none">
                &ldquo;
              </span>

              <p className="text-foreground/80 italic leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <p className="font-mono text-xs text-primary tracking-wider uppercase">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
