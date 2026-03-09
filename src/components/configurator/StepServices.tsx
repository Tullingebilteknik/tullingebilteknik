"use client";

import { motion } from "framer-motion";
import { serviceOptions } from "./serviceIcons";

interface StepServicesProps {
  selectedServices: string[];
  onToggleService: (service: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function StepServices({
  selectedServices,
  onToggleService,
  onNext,
  onBack,
}: StepServicesProps) {
  const canProceed = selectedServices.length > 0;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto min-h-[60vh] md:min-h-0 pb-24 md:pb-0">
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-300 text-white tracking-tight text-center mb-12">
        Vad behöver bilen hjälp med?
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.04 }}
      >
        {serviceOptions.map(({ label, icon: Icon }) => {
          const isActive = selectedServices.includes(label);
          return (
            <motion.button
              key={label}
              variants={cardVariants}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onToggleService(label)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 px-5 py-4 min-h-[48px] transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? "border border-white bg-[#111111]"
                  : "border border-transparent bg-[#111111]"
              }`}
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/30"
                }`}
                strokeWidth={1.5}
              />
              <span
                className={`font-heading text-sm transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/60"
                }`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Desktop nav */}
      <div className="hidden md:flex justify-between w-full pt-10">
        <button
          onClick={onBack}
          className="font-heading text-sm tracking-wider uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Tillbaka
        </button>
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
        <div className="flex gap-3">
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.98 }}
            className="py-4 px-6 font-heading text-sm tracking-wider uppercase text-white/40 border border-white/10"
          >
            &larr;
          </motion.button>
          <motion.button
            onClick={onNext}
            disabled={!canProceed}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 font-heading text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-white/20 disabled:border-white/10"
          >
            Nästa &rarr;
          </motion.button>
        </div>
      </div>
    </div>
  );
}
