"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const services = [
  "Service & underhåll",
  "Bromsar",
  "Däck & hjul",
  "AC-service",
  "Felsökning & diagnostik",
  "Besiktningsförberedelse",
  "Oljebyte",
  "Avgassystem",
  "Koppling & växellåda",
  "Elektronik & elsystem",
  "Övrigt",
];

interface ContactFormProps {
  sourcePage?: string;
  compact?: boolean;
}

const inputClass =
  "w-full bg-white border border-border text-foreground rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50";

export function ContactForm({ sourcePage = "unknown", compact = false }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service_interest: (formData.get("service_interest") as string) || null,
      message: formData.get("message") as string,
      source_page: sourcePage,
    };

    const supabase = createClient();
    const { error: insertError } = await supabase.from("leads").insert(data);

    setLoading(false);

    if (insertError) {
      setError("Något gick fel. Försök igen eller ring oss direkt.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="success-check mx-auto mb-4" />
        <h3 className="font-heading text-xl font-700 text-foreground mb-2">
          Tack för din förfrågan!
        </h3>
        <p className="text-sm text-muted-foreground">Vi återkommer till dig så snart som möjligt.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Namn *
          </label>
          <input id="name" name="name" required placeholder="Ditt namn" className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefon *
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="07X-XXX XX XX" className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-post
          </label>
          <input id="email" name="email" type="email" placeholder="din@email.se" className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="service_interest" className="text-sm font-medium text-foreground">
            Tjänst
          </label>
          <select
            id="service_interest"
            name="service_interest"
            className={`${inputClass} appearance-none`}
            defaultValue=""
          >
            <option value="" disabled>Välj tjänst (valfritt)</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Meddelande *
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Beskriv ditt ärende..."
          rows={compact ? 3 : 5}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white font-heading font-semibold text-sm px-8 py-3 rounded-lg transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Skickar..." : "Skicka förfrågan"}
      </button>
    </form>
  );
}
