"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "@codevs/ui";

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-[var(--cb-space-8)]", className)}
    {...props}
  />
));

Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "group rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] transition-colors data-[state=open]:border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] data-[state=open]:bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)]",
      className,
    )}
    {...props}
  />
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-16)] px-[var(--cb-space-20)] py-[var(--cb-space-16)] text-left text-sm font-medium text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <Plus className="ml-auto h-[var(--cb-size-18)] w-[var(--cb-size-18)] shrink-0 text-[color:var(--cb-text-muted)] group-data-[state=open]:hidden" />
      <Minus className="ml-auto hidden h-[var(--cb-size-18)] w-[var(--cb-size-18)] shrink-0 text-[color:var(--cb-p200)] group-data-[state=open]:block" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-[color:var(--cb-text-secondary)] transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="px-[var(--cb-space-20)] pb-[var(--cb-space-20)]">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
