"use client";

import { StepperContext } from "@/providers/applicant/waiting/StepperContext";
import { cn } from "@/utils/global/cn";
import { CheckIcon } from "lucide-react";
import * as React from "react";

export const StepperStep = React.forwardRef<
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
