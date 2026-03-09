"use client";

import { motion } from "framer-motion";

interface StepVehicleProps {
  regNumber: string;
  carModel: string;
  onRegNumberChange: (v: string) => void;
  onCarModelChange: (v: string) => void;
  onNext: () => void;
}

export function StepVehicle({
  regNumber,
  carModel,
  onRegNumberChange,
  onCarModelChange,
  onNext,
}: StepVehicleProps) {
  const canProceed = regNumber.trim().length >= 3 && carModel.trim().length >= 3;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-[60vh] md:min-h-0 pb-24 md:pb-0">
      <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-300 text-white tracking-tight text-center mb-16">
        Vilken bil gäller det?
      </h2>

      <div className="w-full space-y-8">
        <div className="relative">
          <input
            type="text"
            value={regNumber}
            onChange={(e) => onRegNumberChange(e.target.value.toUpperCase())}
            autoCapitalize="characters"
            placeholder="Registernummer"
            className="w-full bg-transparent border-0 border-b border-white/20 focus:border-white text-white text-lg py-4 outline-none transition-colors duration-300 placeholder:text-white/30"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={carModel}
            onChange={(e) => onCarModelChange(e.target.value)}
            placeholder="Bilmärke & Modell"
            className="w-full bg-transparent border-0 border-b border-white/20 focus:border-white text-white text-lg py-4 outline-none transition-colors duration-300 placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Desktop button */}
      <div className="hidden md:flex justify-end w-full pt-12">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="font-heading text-sm tracking-wider uppercase flex items-center gap-2 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-white/70 hover:text-white"
        >
          Nästa <span>&rarr;</span>
        </button>
      </div>

      {/* Mobile sticky button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-20 md:hidden" style={{ backgroundColor: "oklch(0.12 0.005 260)" }}>
        <motion.button
          onClick={onNext}
          disabled={!canProceed}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 font-heading text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-white/20 disabled:border-white/10"
        >
          Nästa &rarr;
        </motion.button>
      </div>
    </div>
  );
}
