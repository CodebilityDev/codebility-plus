"use client"

import { useRouter } from "next/navigation"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

import Loading from "@/app/(protectedroutes)/projects/loading"
import ProjectCard from "@/app/(protectedroutes)/projects/ProjectCard"
import { ProjectT } from "@/types/index"
import useAuthCookie from "@/hooks/use-cookie"
import { Button } from "@/Components/ui/button"
import H1 from "@/Components/shared/dashboard/H1"
import { getProjects } from "@/app/api/projects"
import { useModal } from "@/hooks/use-modal-projects"

const Projects = () => {
  const { data: authData } = useAuthCookie()
  const { userType } = authData || {}

  const { onOpen } = useModal()
  const router = useRouter()

  const {
    data: Projects,
    isLoading: LoadingProjects,
    error: ErrorProjects,
  }: UseQueryResult<ProjectT[]> = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await getProjects()
    },
    refetchInterval: 3000,
  })

  if (LoadingProjects) {
    return <Loading />
  }

  if (ErrorProjects) return

  if (userType?.projects === false) return router.push("/404")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>Projects</H1>
        <div className="flex items-center gap-4">
          {userType?.name === "ADMIN" && (
            <Button variant="default" className="items-center" onClick={() => onOpen("projectAddModal")}>
              Add New Project
            </Button>
          )}
        </div>
      </div>
      {Projects && Projects.length > 0 && <ProjectCard projects={Projects as ProjectT[]} />}
    </div>
  )
}

export default Projects