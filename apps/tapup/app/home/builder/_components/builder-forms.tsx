"use client";

import useBuilderForm from "../_hooks/useBuilderForm";
import builderFormSidebarItems, {
  SidebarItem,
} from "../_lib/builder-form-sidebar-items";
import BuilderFormsSidebar from "./builder-forms-sidebar";

function BuilderForms() {
  const { current } = useBuilderForm();
  const form = builderFormSidebarItems.find(
    (items) => items.target === current,
  );
  const { Form } = form as SidebarItem;
  return (
    <div className="flex-1">
      <div className="flex h-full w-full gap-x-7">
        <BuilderFormsSidebar />
        <div className="w-full">
          <div className="bg-background">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuilderForms;
