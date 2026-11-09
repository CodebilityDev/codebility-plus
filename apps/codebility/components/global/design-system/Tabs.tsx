"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@codevs/ui";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "scrollbar-hide inline-flex h-[50px] max-w-full items-center gap-[var(--cb-space-4)] overflow-x-auto rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] p-[var(--cb-space-4)]",
      className,
    )}
    {...props}
  />
));

TabsList.displayName = "TabsList";

export interface TabProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  count?: number;
}

const Tab = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabProps
>(({ className, count, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-[var(--cb-size-40)] items-center justify-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] px-[var(--cb-space-16)] text-sm font-medium text-[color:var(--cb-text-muted)] transition-colors hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] data-[state=active]:bg-[color:var(--cb-primary)] data-[state=active]:text-[color:var(--cb-text)] disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    {count === undefined ? null : (
      <span className="text-[11px] leading-4 text-[color:var(--cb-text-muted)] group-data-[state=active]:text-[color:var(--cb-text-secondary)]">
        {count}
      </span>
    )}
  </TabsPrimitive.Trigger>
));

Tab.displayName = "Tab";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-[var(--cb-space-16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]",
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, Tab, TabsContent };
