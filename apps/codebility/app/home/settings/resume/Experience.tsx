/* eslint-disable no-unused-vars */
import React from "react"
import toast from "react-hot-toast"
import { useCallback, useEffect, useRef, useState } from "react"
import Skills from "@/app/home/settings/resume/Skills"
import { User } from "@/types"
import useToken from "@/hooks/use-token"
import { Input } from "@codevs/ui/input"
import { Button } from "@/Components/ui/button"
import { IconEdit, IconDelete } from "@/public/assets/svgs"
import Box from "@/Components/shared/dashboard/Box"

import {
  addWorkExperience,
  getWorkExperiencesPerUser,
  updateWorkExperience,
  deleteWorkExperience,
  updateProfile,
} from "@/app/api/resume"
import { Textarea } from "@codevs/ui/textarea"

type ExperienceType = {
  id?: string
  userWorkExpId?: string
  position: string
  short_desc: string
  dateFrom: string
  dateTo: string
  created_at?: string
  updated_at?: string
}

const Experience = ({ user }: { user: User }) => {
  const [experienceData, setExperienceData] = useState<ExperienceType[]>([])
  const [isLoadingMain, setIsLoadingMain] = useState(false)
  const [isEditMain] = useState(false)

  interface EditModePerItem {
    [key: string]: boolean
  }
  const editModePerItem: React.MutableRefObject<EditModePerItem> = useRef({})

  const { id, tech_stacks } = user
  const { token } = useToken()

  const getWorkExperiences = useCallback(async () => {
    try {
      setIsLoadingMain(true)
      const res: any = await getWorkExperiencesPerUser(id, token)
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
  }, [id, token])

  useEffect(() => {
    if (id && token) {
      getWorkExperiences()
    }
  }, [user.Work_Experience.length, token, id, getWorkExperiences])

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
        await deleteWorkExperience(id, token)
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

  const handleUpdateProfileSkills = async (data: any) => {
    try {
      const updatedData = { ...data }
      await updateProfile(id, updatedData, token).then((response) => {
        if (response) {
          toast.success("Successfully Updated!")
        } else if (!response) {
          toast.error(response.statusText)
        }
      })
    } catch (e) {
      toast.error("Something went wrong!")
    } finally {
      return
    }
  }

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
              experienceLast?.short_desc === "" ||
              experienceLast?.dateTo === "" ||
              experienceLast?.dateFrom === ""
            ) {
              toast.error("Fill the empty fields first..")
            } else if (editModeMap) {
              toast.error("Save your changes first..")
            } else {
              setExperienceData((prev) => [...prev, { position: "", short_desc: "", dateFrom: "", dateTo: "" }])
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
            userId={id}
            token={token}
            isLoadingMain={isLoadingMain}
            isEditMain={isEditMain}
          />
        ))}
      </Box>
      <div>{tech_stacks && <Skills tech_stacks={tech_stacks} updateProfile={handleUpdateProfileSkills} />}</div>
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
  userId: string
  token: string
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
  userId,
  token,
  isLoadingMain,
}: ExperienceFormProps) => {
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    handleEditModePerItem(
      itemNo,
      totalNo === itemNo + 1 &&
        experience.position === "" &&
        experience.short_desc === "" &&
        experience.dateFrom === "" &&
        experience.dateTo === ""
        ? true
        : false
    )
  }, [
    experience.position,
    experience.short_desc,
    experience.dateFrom,
    experience.dateTo,
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
      experience?.short_desc === "" ||
      experience?.dateTo === "" ||
      experience?.dateFrom === ""
    ) {
      toast.error("Fill the empty fields first..")
    } else {
      const data = {
        position: experience.position,
        short_desc: experience.short_desc,
        dateFrom: experience.dateFrom,
        dateTo: experience.dateTo,
        userWorkExpId: userId,
        company: "no ui",
        location: "no ui",
      }
      try {
        setIsLoading(true)
        if (!id) {
          await addWorkExperience(data, token)
          updateExperience()
          toast.success("Successfully Added!")
        } else {
          await updateWorkExperience(data, token, id)
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
            value={experience.short_desc}
            name="short_desc"
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
              value={experience.dateFrom}
              type="text"
              name="dateFrom"
              variant={editMode ? "lightgray" : "darkgray"}
              className="rounded capitalize"
              disabled={!editMode || isLoading}
            />
          </label>
          <label className="flex-1">
            Date To
            <Input
              onChange={(e) => handleUpdateExperience(itemNo, e)}
              value={experience.dateTo}
              type="text"
              name="dateTo"
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
                  experience.short_desc === "" &&
                  experience.dateFrom === "" &&
                  experience.dateTo === ""
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
