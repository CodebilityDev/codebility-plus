"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@codevs/ui";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.List, { ref: ref, className: cn("inline-flex h-10 items-center justify-center text-muted-foreground", className), ...props })));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.Trigger, { ref: ref, className: cn("data-[state=active]:tab-gradient text-md inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-bold data-[state=active]:text-white", className), ...props })));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.Content, { ref: ref, className: cn("ring-offset-background focus-visible:outline-none", className), ...props })));
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
//# sourceMappingURL=tabs.js.map