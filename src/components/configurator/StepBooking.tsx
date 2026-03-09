"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import flatpickr from "flatpickr";
import { Swedish } from "flatpickr/dist/l10n/sv";

interface StepBookingProps {
  name: string;
  phone: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSubmit: (preferredTime: string) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

export function StepBooking({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  onBack,
  loading,
  error,
}: StepBookingProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const canSubmit = name.trim().length >= 2 && phone.trim().length >= 3;

  useEffect(() => {
    if (!dateRef.current) return;

    fpRef.current = flatpickr(dateRef.current, {
      minDate: "today",
      dateFormat: "Y-m-d",
      disableMobile: true,
      static: true,
      locale: Swedish,
      onChange: (_dates, dateStr) => {
        setSelectedDate(dateStr);
      },
    });

    return () => {
      fpRef.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-[60vh] md:min-h-0 pb-24 md:pb-0">
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-300 text-white tracking-tight text-center mb-12">
        När vill du lämna in bilen?
      </h2>

      {/* Contact fields */}
      <div className="w-full space-y-12 mb-14">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Namn *"
          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-white text-white text-3xl sm:text-4xl font-heading font-300 tracking-tight py-6 outline-none transition-colors duration-300 placeholder:text-white/15 placeholder:font-300"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Telefon *"
          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-white text-white text-3xl sm:text-4xl font-heading font-300 tracking-tight py-6 outline-none transition-colors duration-300 placeholder:text-white/15 placeholder:font-300"
        />
      </div>

      {/* Primary CTA: Snarast möjligt */}
      <motion.button
        onClick={() => onSubmit("Snarast")}
        disabled={!canSubmit || loading}
        whileTap={{ scale: 0.98 }}
        className="w-full px-12 py-5 min-h-[56px] font-heading font-600 text-lg tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "oklch(0.72 0.12 75)",
          color: "#0A0A0A",
        }}
      >
        {loading ? "Skickar..." : "Snarast möjligt"}
      </motion.button>

      <p className="text-white/30 text-sm text-center mt-4 max-w-xs">
        Vi ringer upp dig direkt för att bekräfta en tid som passar.
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 w-full my-10">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/20 text-xs uppercase tracking-widest font-heading whitespace-nowrap">
          eller välj datum
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Flatpickr date picker */}
      <div className="w-full space-y-3">
        <input
          ref={dateRef}
          type="text"
          readOnly
          placeholder="Välj datum"
          className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-4 outline-none focus:border-white/50 transition-colors duration-300 cursor-pointer placeholder:text-white/30 font-heading tracking-wide"
        />
        <motion.button
          onClick={() => onSubmit(selectedDate)}
          disabled={!canSubmit || !selectedDate || loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 font-heading text-sm tracking-wider uppercase text-white border border-white/20 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white"
        >
          {loading ? "Skickar..." : "Boka vald dag"}
        </motion.button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {/* Desktop back */}
      <div className="hidden md:flex justify-start w-full pt-10">
        <button
          onClick={onBack}
          className="font-heading text-sm tracking-wider uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Tillbaka
        </button>
      </div>

      {/* Mobile back */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-20 md:hidden" style={{ backgroundColor: "oklch(0.12 0.005 260)" }}>
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 font-heading text-sm tracking-wider uppercase text-white/40 border border-white/10"
        >
          &larr; Tillbaka
        </motion.button>
      </div>
    </div>
  );
}
