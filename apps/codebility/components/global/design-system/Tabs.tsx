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
      "scrollbar-hide inline-flex h-[50px] max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1",
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
      "group inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] data-[state=active]:bg-[#9747ff] data-[state=active]:text-white disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    {count === undefined ? null : (
      <span className="text-[11px] leading-4 text-white/50 group-data-[state=active]:text-white/80">
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
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]",
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, Tab, TabsContent };
