"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { StepVehicle } from "./StepVehicle";
import { StepServices } from "./StepServices";
import { StepBooking } from "./StepBooking";

const stepVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

const stepLabels = ["Fordon", "Tjänster", "Bokning"];

export function ServiceConfigurator() {
  const [step, setStep] = useState(0);
  const [regNumber, setRegNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  async function handleSubmit(preferredTime: string) {
    if (!name.trim() || !phone.trim()) {
      setError("Namn och telefon krävs.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("leads").insert({
      name: name.trim(),
      phone: phone.trim(),
      email: null,
      service_interest: selectedServices.join(", ") || null,
      message: `Reg.nr: ${regNumber.trim()}\nBil: ${carModel.trim()}\nÖnskad tid: ${preferredTime}`,
      source_page: "service-configurator",
      reg_number: regNumber.trim() || null,
      car_model: carModel.trim() || null,
      selected_services: selectedServices.length > 0 ? selectedServices : null,
      preferred_time: preferredTime,
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
      <section
        className="min-h-[70vh] flex items-center justify-center px-4"
        style={{ backgroundColor: "oklch(0.12 0.005 260)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <svg
            className="configurator-check mx-auto mb-6"
            width="80"
            height="80"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M18 28l7 7 13-14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <h3 className="font-heading text-2xl sm:text-3xl font-300 text-white mb-2">
            Mottaget. Vi hörs snart.
          </h3>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      style={{ backgroundColor: "oklch(0.12 0.005 260)" }}
    >
      {/* Eyebrow */}
      <p
        className="text-center text-xs font-semibold tracking-[0.2em] uppercase mb-10"
        style={{ color: "oklch(0.72 0.12 75)" }}
      >
        Boka service
      </p>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-8 mb-16">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === step
                  ? "bg-white"
                  : i < step
                  ? "bg-white/40"
                  : "bg-white/15"
              }`}
            />
            <span
              className={`font-heading text-xs tracking-wider uppercase transition-colors duration-300 ${
                i === step
                  ? "text-white"
                  : i < step
                  ? "text-white/50"
                  : "text-white/20"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <StepVehicle
              regNumber={regNumber}
              carModel={carModel}
              onRegNumberChange={setRegNumber}
              onCarModelChange={setCarModel}
              onNext={() => setStep(1)}
            />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <StepServices
              selectedServices={selectedServices}
              onToggleService={toggleService}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <StepBooking
              name={name}
              phone={phone}
              onNameChange={setName}
              onPhoneChange={setPhone}
              onSubmit={handleSubmit}
              onBack={() => setStep(1)}
              loading={loading}
              error={error}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
