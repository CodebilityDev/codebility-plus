import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@codevs/ui/accordion";

import { permissions_TableRowProps as TableRowProps } from "../_types/permissions";
import Switch from "./PermissionsSwitch";

export const TableRowMobile = (permission: TableRowProps) => {
  const {
    id,
    name,
    dashboard,
    tasks,
    kanban,
    time_tracker,
    interns,
    orgchart,
    applicants,
    in_house,
    clients,
    projects,
    settings,
    resume,
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Dashboard</div>
                <Switch id={id} name="dashboard" enabled={dashboard} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">My Task</div>
                <Switch id={id} name="tasks" enabled={tasks} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Kanban</div>
                <Switch id={id} name="kanban" enabled={kanban} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Time Tracker</div>
                <Switch id={id} name="time_tracker" enabled={time_tracker} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Interns</div>
                <Switch id={id} name="interns" enabled={interns} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Org Chart</div>
                <Switch id={id} name="orgchart" enabled={orgchart} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Applicants</div>
                <Switch id={id} name="applicants" enabled={applicants} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">In-House</div>
                <Switch id={id} name="in_house" enabled={in_house} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Clients</div>
                <Switch id={id} name="clients" enabled={clients} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Projects</div>
                <Switch id={id} name="projects" enabled={projects} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Settings</div>
                <Switch id={id} name="settings" enabled={settings} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Resume</div>
                <Switch id={id} name="resume" enabled={resume} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Roles</div>
                <Switch id={id} name="roles" enabled={roles} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Permissions</div>
                <Switch id={id} name="permissions" enabled={permissions} />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="px-4 font-light">Services</div>
                <Switch id={id} name="services" enabled={services} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
