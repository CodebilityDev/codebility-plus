/* eslint-disable no-unused-vars */
import React from "react"
import toast from "react-hot-toast"
import { useCallback, useEffect, useRef, useState } from "react"

import { Input } from "@codevs/ui/input"
import { Button } from "@/Components/ui/button"
import { IconEdit, IconDelete } from "@/public/assets/svgs"
import Box from "@/Components/shared/dashboard/Box"

import { Textarea } from "@codevs/ui/textarea"
import { getWorkExperience, updateWorkExperience, deleteWorkExperience, createWorkExperience, updateProfile } from "./action"
import { useQuery } from "@tanstack/react-query"
import exp from "constants"

type ExperienceType = {
  id?: string
  userWorkExpId?: string
  position: string
  description: string
  date_from: string
  date_to: string
  created_at?: string
  updated_at?: string
}

const Experience = () => {
  const [experienceData, setExperienceData] = useState<ExperienceType[]>([])
  const [isLoadingMain, setIsLoadingMain] = useState(false)
  const [isEditMain] = useState(false)

  interface EditModePerItem {
    [key: string]: boolean
  }
  const editModePerItem: React.MutableRefObject<EditModePerItem> = useRef({})
  const { data: workExp, error } = useQuery({
    queryKey: ["work_exp"],
    queryFn: async () => {
      const { data, error } = await getWorkExperience()
      if (error) throw error;
      return data;
    },
  }); 
  
  const getWorkExperiences = useCallback(async () => {
    try {
      setIsLoadingMain(true)
      const res: any = await getWorkExperience()
      setExperienceData([...res.data])
      const updateObject: any = {}
      res.data.map((item: any, index: number) => {
        updateObject[index] = false
      })
      editModePerItem.current = updateObject
      setIsLoadingMain(false)
    } catch (e: any) {
      setIsLoadingMain(false)
    } finally {
      setIsLoadingMain(false)
    }
  }, [])

  useEffect(() => {
    getWorkExperiences();
  }, [getWorkExperiences]);

  const handleUpdateExperience = (itemNo: number, e: any) => {
    const updatedExperiences = experienceData.map((item, id) => {
      if (id === itemNo) {
        return { ...item, [e.target.name]: e.target.value }
      }
      return item
    })
    setExperienceData(updatedExperiences)
  }

  const handleDeleteExperience = async (itemNo: number, id: string) => {
    try {
      setIsLoadingMain(true)

      if (id) {
        await deleteWorkExperience(id)
      }
      const updatedExperiences = experienceData.filter((_, id) => id !== itemNo)
      setExperienceData(updatedExperiences)
      delete editModePerItem.current[itemNo]
      let newObj: any = {}
      let i = 0
      for (let key in editModePerItem.current) {
        newObj[i++] = editModePerItem.current[key]
      }
      editModePerItem.current = newObj

      toast.success("Work Experience deleted..")
      setIsLoadingMain(false)
    } catch (e) {
      toast.error("Something went wrong..")
      setIsLoadingMain(false)
    }
  }

  const handleEditModePerItem = (itemNo: number, editable: boolean) => {
    editModePerItem.current = { ...editModePerItem.current, [itemNo]: editable }
  }

  // const handleUpdateProfileSkills = async (data: any) => {
  //   try {
  //     const updatedData = { ...data }
  //     await updateProfile(updatedData).then((response) => {
  //       if (response) {
  //         toast.success("Successfully Updated!")
  //       } else if (!response) {
  //         toast.error("Something went wrong")
  //       }
  //     })
  //   } catch (e) {
  //     toast.error("Something went wrong!")
  //   } finally {
  //     return
  //   }
  // }

  return (
    <>
      <Box className="relative flex flex-col gap-2 bg-light-900 dark:bg-dark-100">
        <p className="text-lg">Experience</p>

        <Button
          onClick={() => {
            const experienceLast = experienceData[experienceData.length - 1]
            const editModeMap = Object.keys(editModePerItem.current).some((key) => {
              if (editModePerItem.current[key] === true) return true
              return false
            })

            if (
              experienceLast?.position === "" ||
              experienceLast?.description === "" ||
              experienceLast?.date_to === "" ||
              experienceLast?.date_from === ""
            ) {
              toast.error("Fill the empty fields first..")
            } else if (editModeMap) {
              toast.error("Save your changes first..")
            } else {
              setExperienceData((prev) => [...prev, { position: "", description: "", date_from: "", date_to: "" }])
              toast.success("Added new experience entry")
            }
          }}
          variant="outlined"
          className="text-black w-[10rem] border border-black-100 px-[20px] py-6 dark:border-white"
        >
          Add Experience
        </Button>
        {experienceData?.map((item, index) => (
          <ExperienceForm
            handleUpdateExperience={handleUpdateExperience}
            itemNo={index}
            experience={item}
            totalNo={experienceData.length}
            key={index}
            editModePerItem={editModePerItem}
            handleEditModePerItem={handleEditModePerItem}
            handleDeleteExperience={handleDeleteExperience}
            updateExperience={getWorkExperiences}
      
            isLoadingMain={isLoadingMain}
            isEditMain={isEditMain}
          />
        ))}
      </Box>
      {/* <div>{tech_stacks && <Skills tech_stacks={tech_stacks} updateProfile={handleUpdateProfileSkills} />}</div> */}
    </>
  )
}

interface ExperienceFormProps {
  experience: ExperienceType
  handleUpdateExperience: (itemNo: number, e: any) => void
  itemNo: number
  totalNo: number
  editModePerItem: any
  handleEditModePerItem: (itemNo: number, editable: boolean) => void
  handleDeleteExperience: (itemNo: number, id: string, type: "delete" | "cancel") => void
  updateExperience: () => void
  

  isLoadingMain: boolean
  isEditMain: boolean
}

const ExperienceForm = ({
  experience,
  handleUpdateExperience,
  itemNo,
  totalNo,
  editModePerItem,
  handleEditModePerItem,
  handleDeleteExperience,
  updateExperience,

  
  isLoadingMain,
}: ExperienceFormProps) => {
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    handleEditModePerItem(
      itemNo,
      totalNo === itemNo + 1 &&
        experience.position === "" &&
        experience.description === "" &&
        experience.date_from === "" &&
        experience.date_to === ""
        ? true
        : false
    )
  }, [
    experience.position,
    experience.description,
    experience.date_from,
    experience.date_to,
    handleEditModePerItem,
    itemNo,
    totalNo,
  ])

  useEffect(() => {
    setEditMode(editModePerItem.current[itemNo])
  }, [editModePerItem, itemNo])

  const handleEditMode = () => {
    setEditMode(true)
    editModePerItem.current[itemNo] = true
  }

  const handleSaveAndUpdate = async (id: string | undefined) => {
    if (
      experience?.position === "" ||
      experience?.description === "" ||
      experience?.date_to === "" ||
      experience?.date_from === ""
    ) {
      toast.error("Fill the empty fields first..")
    } else {
      const data = {
       
        position: experience.position,
        description: experience.description,
        date_from: experience.date_from,
        date_to: experience.date_to,
        // company: "no ui",
        // location: "no ui",
      }
      try {
        setIsLoading(true)
        if (!id) {
         const {error} = await createWorkExperience(data)
          toast.success("Successfully Added!")
        } else {
          await updateWorkExperience(data)
          toast.success("Successfully Updated!")
        }
        handleEditModePerItem(itemNo, false)
        setEditMode(false)
      } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Something went wrong!")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="mt-8 flex w-full flex-col  rounded-md  bg-slate-50 px-[24px] py-[29px] dark:bg-dark-500">
        <div className="flex w-full items-end justify-end gap-2">
          <IconDelete
            onClick={() => {
              if (!isLoadingMain) handleDeleteExperience(itemNo, experience.id as string, "delete")
            }}
            className="cursor-pointer text-red-500 invert dark:invert-0"
          />
          {!editMode && (
            <IconEdit
              onClick={() => {
                if (!isLoadingMain) handleEditMode()
              }}
              className="cursor-pointer invert dark:invert-0"
            />
          )}
        </div>

        <div className="w-full">
          <label>
            Position
            <Input
              onChange={(e) => handleUpdateExperience(itemNo, e)}
              value={experience.position}
              type="text"
              name="position"
              variant={editMode ? "lightgray" : "darkgray"}
              className="rounded capitalize"
              disabled={!editMode || isLoading}
            />
          </label>
        </div>
        <div className="mt-4 w-full">
          <label>Description</label>
          <Textarea
            variant="resume"
            onChange={(e) => handleUpdateExperience(itemNo, e)}
            value={experience.description}
            name="description"
            className={` ${
              editMode
                ? " border border-lightgray bg-white text-black-100 dark:border-zinc-700 dark:bg-dark-200 dark:text-white"
                : " bg-white  text-dark-200 dark:bg-dark-200 dark:text-gray"
            }`}
            disabled={!editMode || isLoading}
          />
        </div>
        <div className="mt-4 flex w-full flex-col gap-8 lg:flex-row">
          <label className="flex-1">
            Date From
            <Input
              onChange={(e) => handleUpdateExperience(itemNo, e)}
              value={experience.date_from}
              type="text"
              name="date_from"
              variant={editMode ? "lightgray" : "darkgray"}
              className="rounded capitalize"
              disabled={!editMode || isLoading}
            />
          </label>
          <label className="flex-1">
            Date To
            <Input
              onChange={(e) => handleUpdateExperience(itemNo, e)}
              value={experience.date_to}
              type="text"
              name="date_to"
              variant={editMode ? "lightgray" : "darkgray"}
              className="rounded capitalize"
              disabled={!editMode || isLoading}
            />
          </label>
        </div>
        {editMode && (
          <div className="mt-6 flex flex-col-reverse items-center justify-center gap-2 md:flex-row md:justify-end">
            <Button
              onClick={() => {
                if (
                  experience.position === "" &&
                  experience.description === "" &&
                  experience.date_from === "" &&
                  experience.date_to === ""
                ) {
                  handleDeleteExperience(itemNo, experience.id as string, "cancel")
                } else {
                  handleEditModePerItem(itemNo, false)
                  setEditMode(false)
                }
              }}
              variant="outlined"
              className=" w-[10rem] border-black-100 px-[20px] py-6 text-black-100 dark:border-white dark:text-white"
              disabled={isLoading || isLoadingMain}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || isLoadingMain}
              onClick={() => handleSaveAndUpdate(experience.id)}
              variant="default"
              className=" w-[10rem] px-[20px] py-6"
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Experience
