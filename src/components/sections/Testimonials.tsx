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

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-3">
            Kundrecensioner
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-700 text-foreground">
            Vad våra kunder säger
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="premium-card rounded-lg p-8 relative"
            >
              <StarRating />

              <p className="mt-4 text-foreground/80 italic leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{t.name[0]}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
