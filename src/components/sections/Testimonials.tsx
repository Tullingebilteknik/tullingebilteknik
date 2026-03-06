const testimonials = [
  {
    name: "Anna K.",
    text: "Fantastisk service! De fixade mitt AC-problem på en dag och priset var mycket rimligt. Rekommenderas varmt!",
    rating: 5,
  },
  {
    name: "Erik L.",
    text: "Har gått hit i flera år nu. Alltid ärliga med vad som behöver göras och vad som kan vänta. Pålitlig verkstad.",
    rating: 5,
  },
  {
    name: "Maria S.",
    text: "Bästa verkstaden i Tullinge! Snabb service, bra priser och trevlig personal. Min bil har aldrig gått bättre.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-3">
            Kundrecensioner
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Vad våra kunder säger
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>

              <p className="text-sm font-semibold text-slate-900">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
