export const Header = () => {
  const Headers = [
    "Name",
    "Dashboard",
    "My Task",
    "Kanban",
    "Time Tracker",
    "Clients",
    "Interns",
    "In-House",
    "Projects",
    "Applicants",
    "Roles",
    "Permissions",
    "Services",
  ]

  return (
    <>
      {Headers.map((header, index) => (
        <div
          key={index}
          className={` dark:bg-dark-100:flex items-center p-2 text-base font-light lg:p-4 lg:text-xl ${
            index === 0 ? "justify-start" : "justify-center"
          }`}
        >
          {header}
        </div>
      ))}
    </>
  )
}