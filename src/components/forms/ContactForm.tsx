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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-6"}>
        <div className="floating-label-group">
          <input id="name" name="name" required placeholder=" " />
          <label htmlFor="name">Namn *</label>
        </div>

        <div className="floating-label-group">
          <input id="phone" name="phone" type="tel" required placeholder=" " />
          <label htmlFor="phone">Telefon *</label>
        </div>

        <div className="floating-label-group">
          <input id="email" name="email" type="email" placeholder=" " />
          <label htmlFor="email">E-post</label>
        </div>

        <div className="floating-label-group">
          <select id="service_interest" name="service_interest" defaultValue="">
            <option value="" disabled>Välj tjänst (valfritt)</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <label htmlFor="service_interest">Tjänst</label>
        </div>
      </div>

      <div className="floating-label-group">
        <textarea
          id="message"
          name="message"
          required
          placeholder=" "
          rows={compact ? 3 : 5}
          style={{ resize: "none" }}
        />
        <label htmlFor="message">Meddelande *</label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground font-heading font-600 text-sm px-8 py-3 rounded-full transition-all hover:shadow-[0_4px_16px_oklch(0.72_0.12_75/25%)] hover:-translate-y-px disabled:opacity-50"
      >
        {loading ? "Skickar..." : "Skicka förfrågan"}
      </button>
    </form>
  );
}
