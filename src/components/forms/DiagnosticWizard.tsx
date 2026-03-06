"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="floating-label-group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required={required}
      />
      <label>{label}{required ? " *" : ""}</label>
    </div>
  );
}

function FloatingTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="floating-label-group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        rows={rows}
        style={{ resize: "none" }}
      />
      <label>{label}</label>
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function DiagnosticWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-10"
      >
        <div className="success-check mx-auto mb-4" />
        <h3 className="font-heading text-2xl font-700 text-foreground mb-2">
          Tack för din förfrågan
        </h3>
        <p className="text-muted-foreground text-sm">
          Vi återkommer inom 24 timmar.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressSteps steps={steps} currentStep={step} />

      <div className="mt-10 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Vehicle */}
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <p className="text-sm text-muted-foreground mb-6">
                Berätta om ditt fordon (valfritt)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FloatingInput
                  label="Bilmärke"
                  value={carBrand}
                  onChange={setCarBrand}
                />
                <FloatingInput
                  label="Registreringsnummer"
                  value={regNumber}
                  onChange={setRegNumber}
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => goTo(1)}
                  className="font-heading font-600 text-sm text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Nästa <span>&rarr;</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Service selection */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm text-muted-foreground mb-6">
                Vad behöver du hjälp med?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service)}
                    className={`rounded-lg px-4 py-3 text-left border transition-all duration-200 ${
                      selectedService === service
                        ? "border-primary bg-primary/5 text-foreground shadow-sm"
                        : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="font-heading text-sm font-600">{service}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => goTo(0)}
                  className="font-heading font-600 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <span>&larr;</span> Tillbaka
                </button>
                <button
                  onClick={() => goTo(2)}
                  className="font-heading font-600 text-sm text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Nästa <span>&rarr;</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact details */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <p className="text-sm text-muted-foreground mb-6">
                Dina kontaktuppgifter
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FloatingInput
                  label="Namn"
                  value={name}
                  onChange={setName}
                  required
                />
                <FloatingInput
                  label="Telefon"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                  required
                />
                <div className="sm:col-span-2">
                  <FloatingInput
                    label="E-post"
                    value={email}
                    onChange={setEmail}
                    type="email"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FloatingTextarea
                    label="Meddelande"
                    value={message}
                    onChange={setMessage}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => goTo(1)}
                  className="font-heading font-600 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <span>&larr;</span> Tillbaka
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center bg-primary text-primary-foreground font-heading font-600 text-sm px-8 py-2.5 rounded-full transition-all hover:shadow-[0_4px_16px_oklch(0.72_0.12_75/25%)] hover:-translate-y-px disabled:opacity-50"
                >
                  {loading ? "Skickar..." : "Skicka"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
