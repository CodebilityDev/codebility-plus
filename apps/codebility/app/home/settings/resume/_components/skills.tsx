/* eslint-disable no-unused-vars */
import Image from "next/image"

import { useModal } from "@/hooks/use-modal"
import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import React, { useEffect, useState } from "react"
import { Box } from "@/Components/shared/dashboard"
import { useTechStackStore } from "@/hooks/use-techstack"
import { resume_SkillsT } from "@/types/protectedroutes"
import { getProfile, updateProfile } from "../action"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const Skills = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading] = useState(false)

  const { onOpen } = useModal()
  const { stack, setStack } = useTechStackStore()

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await getProfile()
      if (error) throw error;
      return data;
    },
  });
 
  useEffect(() => {
    if (profile?.tech_stacks) {
      setStack(profile.tech_stacks.map((stack: string) => stack.toLowerCase()));
    }
  }, [profile, setStack]);
  const handleEditMode = () => {
    setIsEditMode(true)
    onOpen("techStackModal")
  }

  const handleCancel = async () => {
    try {
      setStack(profile?.tech_stacks.map((stack: string) => stack.toLowerCase()));
      setIsEditMode(false)
    } catch(error) {
      toast.error("Failed to update your tech stack")
    }
    
  }

  const handleSave = () => {
    updateProfile({ tech_stacks: stack })
    setIsEditMode(false)
    toast.success("Successfully updated your tech stacks!")
  }
  return (
    <Box className="relative bg-light-900 dark:bg-dark-100">
      <IconEdit
        className="w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        onClick={handleEditMode}
      />
      <p className="text-lg">Skills</p>
      <div className="mt-4 flex h-full w-full flex-wrap items-center justify-start gap-2">
        {stack &&
          stack.map((item: any, i: any) => (
            <div key={i} className="flex items-center">
              {item && (
                <Image
                  src={`/assets/svgs/icon-${item.toLowerCase()}.svg`}
                  alt={`${item} icon`}
                  width={40}
                  height={40}
                  title={item}
                  className="h-[40px] w-[40px] transition duration-300 hover:-translate-y-0.5"
                />
              )}
            </div>
          ))}
      </div>
      {isEditMode ? (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="hollow" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="default" type="submit" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : null}
    </Box>
  )
}

export default Skills
