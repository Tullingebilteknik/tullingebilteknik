"use client";

import { useState } from "react";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { createClient } from "@/lib/supabase/client";

const serviceOptions = [
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

const steps = ["Fordon", "Tjänst", "Kontakt"];

const inputClass =
  "w-full bg-white border border-border text-foreground rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50";

export function DiagnosticWizard() {
  const [step, setStep] = useState(0);
  const [carBrand, setCarBrand] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !phone.trim()) {
      setError("Namn och telefon krävs.");
      return;
    }

    setLoading(true);
    setError("");

    const parts = [];
    if (carBrand.trim()) parts.push(`Bilmärke: ${carBrand.trim()}`);
    if (regNumber.trim()) parts.push(`Reg.nr: ${regNumber.trim()}`);
    if (message.trim()) parts.push(message.trim());

    const supabase = createClient();
    const { error: insertError } = await supabase.from("leads").insert({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      service_interest: selectedService || null,
      message: parts.join("\n") || "Bokningsförfrågan via diagnostikverktyget",
      source_page: "diagnostic-wizard",
    });

    setLoading(false);

    if (insertError) {
      setError("Något gick fel. Försök igen eller ring oss direkt.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="success-check mx-auto mb-4" />
        <h3 className="font-heading text-2xl font-700 text-foreground mb-2">
          Tack för din förfrågan
        </h3>
        <p className="text-muted-foreground text-sm">
          Vi återkommer inom 24 timmar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressSteps steps={steps} currentStep={step} />

      <div className="mt-10">
        {/* Step 1: Vehicle */}
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Berätta om ditt fordon (valfritt)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Bilmärke
                </label>
                <input
                  type="text"
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  placeholder="T.ex. Volvo, BMW, Toyota"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Registreringsnummer
                </label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="ABC 123"
                  className={`${inputClass} uppercase placeholder:normal-case`}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(1)}
                className="font-heading font-semibold text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                Nästa <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Service selection */}
        {step === 1 && (
          <div className="animate-in fade-in duration-300">
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Vad behöver du hjälp med?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`premium-card rounded-lg px-4 py-3 text-left transition-all duration-200 ${
                    selectedService === service
                      ? "border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:border-primary/20"
                  }`}
                >
                  <span className="font-heading text-sm font-semibold">{service}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-6">
              <button
                onClick={() => setStep(0)}
                className="font-heading font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span>&larr;</span> Tillbaka
              </button>
              <button
                onClick={() => setStep(2)}
                className="font-heading font-semibold text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                Nästa <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Dina kontaktuppgifter
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Namn *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ditt namn"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="07X-XXX XX XX"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  E-post
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@email.se (valfritt)"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Meddelande
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Beskriv ditt ärende..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="font-heading font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span>&larr;</span> Tillbaka
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center bg-primary text-white font-heading font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Skickar..." : "Skicka"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
