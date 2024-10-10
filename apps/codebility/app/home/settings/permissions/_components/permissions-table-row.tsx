// import { permissions_TableRowProps as TableRowProps } from "../_types/permissions";
// import Switch from "./permissions-switch";

// export const TableRow = (permission: TableRowProps) => {
//   const {
//     id,
//     name,
//     dashboard,
//     tasks,
//     kanban,
//     time_tracker,
//     clients,
//     interns,
//     in_house,
//     projects,
//     applicants,
//     roles,
//     permissions,
//     services,
//     orgchart,
//     settings,
//     resume
//   } = permission;
//   const backgroundColor =
//     parseInt(id) % 2 === 0
//       ? "bg-zinc-100 dark:bg-dark-200"
//       : "dark:bg-[#383B45]";

//   return (
//     <>
//       <div
//         className={` flex items-center text-nowrap p-4 font-light md:text-lg lg:text-xl ${backgroundColor}`}
//       >
//         {name}
//       </div>
//       <Switch
//         id={id}
//         name="dashboard"
//         enabled={dashboard}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="tasks"
//         enabled={tasks}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="kanban"
//         enabled={kanban}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="time_tracker"
//         enabled={time_tracker}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="clients"
//         enabled={clients}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="interns"
//         enabled={interns}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="in_house"
//         enabled={in_house}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="projects"
//         enabled={projects}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="applicants"
//         enabled={applicants}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="roles"
//         enabled={roles}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="permissions"
//         enabled={permissions}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="services"
//         enabled={services}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="settings"
//         enabled={settings}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="resume"
//         enabled={resume}
//         className={backgroundColor}
//       />
//       <Switch
//         id={id}
//         name="orgchart"
//         enabled={orgchart}
//         className={backgroundColor}
//       />
//     </>
//   );
// };
