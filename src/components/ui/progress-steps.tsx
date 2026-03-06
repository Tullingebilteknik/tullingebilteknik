"use client";

import { motion } from "framer-motion";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            {/* Step indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary scale-125"
                    : isCompleted
                      ? "bg-primary/40"
                      : "bg-muted-foreground/20"
                }`}
              />
              <span
                className={`font-mono text-xs tracking-wider transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-primary/50"
                      : "text-muted-foreground/30"
                }`}
              >
                {isCompleted ? "\u2713" : `0${i + 1}`}
              </span>
              <span
                className={`text-sm font-500 transition-colors ${
                  isActive
                    ? "text-foreground"
                    : isCompleted
                      ? "text-foreground/50"
                      : "text-muted-foreground/30"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 h-px relative bg-border/50">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary/50"
                  initial={false}
                  animate={{
                    width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
