"use client"
import ToggleSwitch from "@/Components/ui/switch"
import { getRoles } from "@/app/api/settings"
import useToken from "@/hooks/use-token"
import { API } from "@/lib/constants"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@codevs/ui/accordion"
import { permissions_TableRowProps as TableRowProps } from "@/types/protectedroutes"

const PermissionsTable = () => {
  const { data: Roles } = useQuery({
    queryKey: ["Roles"],
    queryFn: async () => {
      return getRoles()
    },
    refetchInterval: 3000,
  })

  console.log(Roles)

  return (
    <>
      <div className="grid-rows-[repeat12,1fr)] hidden grid-cols-[min-content,repeat(12,1fr)] place-items-stretch gap-x-0 gap-y-0 md:grid">
        <Header />
        {Roles?.map((role: TableRowProps) => <TableRow key={role.id} {...role} />)}
      </div>
      <div className="block md:hidden">
        {Roles?.map((role: TableRowProps) => <TableRowMobile key={role.id} {...role} />)}
      </div>
    </>
  )
}

const Header = () => {
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

const TableRow = (permission: TableRowProps) => {
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
  } = permission
  const backgroundColor = parseInt(id) % 2 === 0 ? "bg-zinc-100 dark:bg-dark-200" : "dark:bg-[#383B45]"

  return (
    <>
      <div className={` flex items-center text-nowrap p-4 font-light md:text-lg lg:text-xl ${backgroundColor}`}>
        {name}
      </div>
      <Switch id={id} name="dashboard" enabled={dashboard} className={backgroundColor} />
      <Switch id={id} name="my_task" enabled={my_task} className={backgroundColor} />
      <Switch id={id} name="kanban" enabled={kanban} className={backgroundColor} />
      <Switch id={id} name="time_tracker" enabled={time_tracker} className={backgroundColor} />
      <Switch id={id} name="clients" enabled={clients} className={backgroundColor} />
      <Switch id={id} name="interns" enabled={interns} className={backgroundColor} />
      <Switch id={id} name="inhouse" enabled={inhouse} className={backgroundColor} />
      <Switch id={id} name="projects" enabled={projects} className={backgroundColor} />
      <Switch id={id} name="applicants" enabled={applicants} className={backgroundColor} />
      <Switch id={id} name="roles" enabled={roles} className={backgroundColor} />
      <Switch id={id} name="permissions" enabled={permissions} className={backgroundColor} />
      <Switch id={id} name="services" enabled={services} className={backgroundColor} />
    </>
  )
}

const TableRowMobile = (permission: TableRowProps) => {
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
  } = permission
  const backgroundColor = parseInt(id) % 2 === 0 ? "bg-zinc-100 dark:bg-dark-200" : "dark:bg-[#383B45]"

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={name} className="border-zinc-300 dark:border-zinc-800">
          <AccordionTrigger className="p-4 hover:bg-muted/50">{name}</AccordionTrigger>
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
  )
}

interface SwitchProps {
  id?: string
  enabled: boolean
  data?: boolean
  name: string
  className?: string
}

const Switch = ({ enabled, className, id, name }: SwitchProps) => {
  const { token } = useToken()
  const [isEnabled, setIsEnabled] = useState(enabled)

  const handleClick = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    const payload = { [name]: newState }
    await axios.patch(`${API.ROLES}/addpermissions/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return (
    <div className={`items-center justify-center md:flex md:p-2 lg:p-4 ${className}`}>
      <ToggleSwitch onClick={handleClick} enabled={!isEnabled} />
    </div>
  )
}

export default PermissionsTable
