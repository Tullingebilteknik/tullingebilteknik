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
        const isUpcoming = i > currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            {/* Step indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`font-mono text-xs tracking-wider transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-primary/50"
                      : "text-muted-foreground/30"
                }`}
              >
                {isCompleted ? "✓" : `0${i + 1}`}
              </span>
              <span
                className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-primary/50"
                      : "text-muted-foreground/30"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 h-px relative">
                <div className="absolute inset-0 bg-muted-foreground/15" />
                <div
                  className="absolute inset-y-0 left-0 bg-primary/50 transition-all duration-500"
                  style={{ width: isCompleted ? "100%" : isActive ? "50%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
