import React, { useState } from 'react'
import { convertToTitleCase, } from '@/app/(protectedroutes)/in-house/utils'
import Image from 'next/image'
import ViewProfile from '@/app/(protectedroutes)/in-house/ViewProfile'
import { TeamMemberT } from '@/types'
import Select from '@/app/(protectedroutes)/in-house/Select'
import CheckboxList from '@/app/(protectedroutes)/in-house/CheckboxList'
import { inhouse_EditTableBodyT } from '@/types/protectedroutes'

function EditableCard({ member, handleSaveButton }: inhouse_EditTableBodyT) {
  const [editableMember, setEditableMember] = useState<TeamMemberT>(member)

  const handleSelectChange = (type: keyof TeamMemberT, value: any) => {
    setEditableMember((prevMember) => ({
      ...prevMember,
      [type]: value,
    }))
  }

  const cleanProjects = (projects: any) => {
    if (projects && projects.length > 0) {
      return projects.filter((item: any) => item.project && item.project.project_name);
    }
    return [];
  };
  const cleanedData = cleanProjects(editableMember.projects);

  return (
    <div className="w-64 h-72 gap-4 flex flex-col justify-between p-4 rounded-md text-dark100_light900 dark:bg-dark-200 bg-light-300">
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <div className='text-lg font-bold'>{member.first_name} {member.last_name}</div>
          <Select
            type="status_internal"
            placeholder={convertToTitleCase(editableMember.status_internal)}
            handleChange={(value) => handleSelectChange("status_internal", value)}
          />
        </div>
        <Select
          className="text-sm"
          type="main_positon"
          placeholder={editableMember.main_position}
          handleChange={(value) => handleSelectChange("main_position", value)}
        />
      </div>

      <div className="ml-2 flex-1">
        <div className='text-sm'>Projects:</div>
        <CheckboxList
          className='text-sm'
          initialItems={cleanedData}
          handleChange={((value) => handleSelectChange("projects", value))}
        />
      </div>

      <div className='flex justify-between gap-2'>
        <div className="flex gap-1 w-full content-center">
          <div className='align-baseline'>NDA: </div>
          <div className="w-full">
            <Select
              className='text-sm'
              type="nda_status"
              placeholder={editableMember.nda_status}
              handleChange={(value) => handleSelectChange("nda_status", value)}
            />
          </div>
        </div>
        <span className="flex gap-2">
          <ViewProfile />
          <button onClick={() => handleSaveButton(editableMember)}>
            <Image
              src={"https://codebility-cdn.pages.dev/assets/svgs/icon-checkbox.svg"}
              alt="Checkbox Icon"
              width={0}
              height={0}
              style={{ width: '1.25rem', height: "auto" }}
            />
          </button>
        </span>
      </div>
    </div>
  )
}

export default EditableCard;