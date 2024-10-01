"use client";

import { Button } from "@codevs/ui/button";
import { cn } from "@codevs/ui/utils";

import useBuilderForm from "../_hooks/useBuilderForm";
import SidebarItems from "../_lib/builder-form-sidebar-items";

function BuilderFormsSidebar() {
  const { current, updateForm } = useBuilderForm();
  return (
    <div className="flex flex-col gap-y-4">
      {SidebarItems.map((items) => {
        const { target } = items;
        return (
          <Button
            onClick={() => updateForm(target)}
            key={target}
            className={cn(
              "hover:bg-primary hover:text-background",
              current === target
                ? "bg-primary text-background"
                : "bg-background text-foreground/30",
            )}
          >
            <items.Icon />
          </Button>
        );
      })}
    </div>
  );
}

export default BuilderFormsSidebar;
