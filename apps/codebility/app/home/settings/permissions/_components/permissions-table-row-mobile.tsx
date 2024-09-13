import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@codevs/ui/accordion";

import { permissions_TableRowProps as TableRowProps } from "../_types/permissions";
import Switch from "./permissions-switch";

export const TableRowMobile = (permission: TableRowProps) => {
  const {
    id,
    name,
    dashboard,
    my_task,
    kanban,
    time_tracker,
    clients,
    interns,
    inhouse,
    projects,
    applicants,
    roles,
    permissions,
    services,
  } = permission;
  const backgroundColor =
    parseInt(id) % 2 === 0
      ? "bg-zinc-100 dark:bg-dark-200"
      : "dark:bg-[#383B45]";

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value={name}
          className="border-zinc-300 dark:border-zinc-800"
        >
          <AccordionTrigger className="p-4 hover:bg-muted/50">
            {name}
          </AccordionTrigger>
          <AccordionContent className={`p-4 ${backgroundColor}`}>
            <div className="grid-rows-[repeat12,1fr)] grid grid-cols-[repeat(2,1fr)] place-items-stretch gap-x-0 gap-y-4">
              <div className="px-4 font-light">Dashboard</div>
              <Switch id={id} name="dashboard" enabled={dashboard} />
              <div className="px-4 font-light">My Task</div>
              <Switch id={id} name="my_task" enabled={my_task} />
              <div className="px-4 font-light">Kanban</div>
              <Switch id={id} name="kanban" enabled={kanban} />
              <div className="px-4 font-light">Time Tracker</div>
              <Switch id={id} name="time_tracker" enabled={time_tracker} />
              <div className="px-4 font-light">Clients</div>
              <Switch id={id} name="clients" enabled={clients} />
              <div className="px-4 font-light">Interns</div>
              <Switch id={id} name="interns" enabled={interns} />
              <div className="px-4 font-light">In-House</div>
              <Switch id={id} name="inhouse" enabled={inhouse} />
              <div className="px-4 font-light">Projects</div>
              <Switch id={id} name="projects" enabled={projects} />
              <div className="px-4 font-light">Applicants</div>
              <Switch id={id} name="applicants" enabled={applicants} />
              <div className="px-4 font-light">Roles</div>
              <Switch id={id} name="roles" enabled={roles} />
              <div className="px-4 font-light">Permissions</div>
              <Switch id={id} name="permissions" enabled={permissions} />
              <div className="px-4 font-light">Services</div>
              <Switch id={id} name="services" enabled={services} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
