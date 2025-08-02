"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type Step = {
  title: string;
  description?: string;
  optional?: boolean;
};

type StepperContextValue = {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  steps: Step[];
  onChange: (step: number) => void;
};

const StepperContext = React.createContext<StepperContextValue>({
  activeStep: 0,
  orientation: "horizontal",
  steps: [],
  onChange: () => null,
});

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  steps: Step[];
  onStepChange?: (step: number) => void;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep = 0,
      orientation = "horizontal",
      steps,
      onStepChange = () => null,
      className,
      ...props
    },
    ref,
  ) => {
    // Default to vertical on large screens, horizontal on small
    const [currentOrientation, setCurrentOrientation] = React.useState<
      "horizontal" | "vertical"
    >(orientation);

    // Check screen size and adapt orientation if needed
    React.useEffect(() => {
      const handleResize = () => {
        if (orientation !== "vertical" && orientation !== "horizontal") {
          setCurrentOrientation(
            window.innerWidth < 768 ? "horizontal" : "vertical",
          );
        } else {
          setCurrentOrientation(orientation);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [orientation]);

    const contextValue = React.useMemo(
      () => ({
        activeStep,
        orientation: currentOrientation,
        steps,
        onChange: onStepChange,
      }),
      [activeStep, currentOrientation, steps, onStepChange],
    );

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "h-full w-full",
            currentOrientation === "horizontal"
              ? "flex flex-col space-y-6"
              : "grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]",
            className,
          )}
          {...props}
        />
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

const StepperHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = React.useContext(StepperContext);

  return (
    <div
      ref={ref}
      className={cn(
        orientation === "horizontal"
          ? "flex flex-row items-center justify-between overflow-clip"
          : "relative flex flex-col space-y-1",
        className,
      )}
      {...props}
    />
  );
});
StepperHeader.displayName = "StepperHeader";

const StepperStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ className, index, ...props }, ref) => {
  const { activeStep, orientation, onChange, steps } =
    React.useContext(StepperContext);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  const isActive = activeStep === index;
  const isCompleted = activeStep > index;
  const isClickable = isCompleted ? false : activeStep === index;

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "h-full min-w-[60px] flex-col items-center justify-center sm:min-w-[80px]"
          : "relative h-full flex-row items-start py-3",
        className,
      )}
      {...props}
    >
      {/* Vertical connector line - fixed position */}
      {orientation === "vertical" && !isLast && (
        <div
          className="absolute bottom-0 left-3 top-10 h-full w-[2px] -translate-x-[1px] bg-muted-foreground/30"
          aria-hidden="true"
        />
      )}

      {/* Colored overlay for completed sections */}
      {orientation === "vertical" && !isLast && isCompleted && (
        <div
          className="absolute bottom-0 left-3 top-10 h-full w-[2px] -translate-x-[1px] bg-primary"
          aria-hidden="true"
        />
      )}

      <div className="z-10 flex items-center">
        <button
          type="button"
          disabled={!isClickable}
          onClick={() => isClickable && onChange(index)}
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full border-2 bg-background p-2 text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm",
            isActive
              ? "border-primary bg-customBlue-200 text-primary-foreground"
              : isCompleted
                ? "from-customTeal w-full rounded-full border-primary bg-gradient-to-r via-customBlue-400 to-purple-950 text-primary-foreground"
                : isClickable
                  ? "border-border bg-background text-foreground hover:bg-muted"
                  : "border-muted-foreground/30 bg-muted text-muted-foreground",
            !isClickable && "cursor-not-allowed",
          )}
          aria-current={isActive ? "step" : undefined}
        >
          {isCompleted ? (
            <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <span className=" flex h-3 w-3 items-center justify-center text-center sm:h-4 sm:w-4">
              {index + 1}
            </span>
          )}
        </button>

        {orientation === "vertical" && step && (
          <div className="ml-3 mt-0">
            <div
              className={cn(
                "text-sm font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.title}
              {step.optional && isActive && (
                <span className="ml-1 text-xs text-muted-foreground">
                  (Optional)
                </span>
              )}
            </div>
            {step.description && isActive && (
              <div className="mt-1 text-xs text-muted-foreground">
                {step.description}
              </div>
            )}
          </div>
        )}
      </div>

      {orientation === "horizontal" && step && (
        <div className="mt-2 text-center">
          <div
            className={cn(
              "text-xs font-medium sm:text-sm",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span className={cn(isActive ? "block" : "")}>{step.title}</span>

            {step.optional && isActive && (
              <span className="ml-1 text-xs text-muted-foreground">
                (Optional)
              </span>
            )}
          </div>
          {step.description && isActive && (
            <div className="mobile:hidden mt-1 max-w-[80px] text-xs text-muted-foreground sm:max-w-[120px]">
              {step.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
StepperStep.displayName = "StepperStep";

const StepperConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ className, index, ...props }, ref) => {
  const { activeStep, orientation } = React.useContext(StepperContext);
  const isCompleted = activeStep > index;

  // Only render connector in horizontal mode
  if (orientation === "vertical") {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-[20px] flex-1 border-t sm:max-w-none", // Short on mobile, full length on desktop
        isCompleted ? "border-customBlue-100" : "border-muted-foreground/30",
        className,
      )}
      {...props}
    />
  );
});
StepperConnector.displayName = "StepperConnector";

const StepperBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { orientation } = React.useContext(StepperContext);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        orientation === "vertical" ? "mt-2 md:mt-0" : "mt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
StepperBody.displayName = "StepperBody";

const StepperContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { step: number }
>(({ className, step, children, ...props }, ref) => {
  const { activeStep } = React.useContext(StepperContext);
  const isActive = activeStep === step;

  if (!isActive) return null;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
});
StepperContent.displayName = "StepperContent";

export {
  Stepper,
  StepperHeader,
  StepperBody,
  StepperStep,
  StepperConnector,
  StepperContent,
};
