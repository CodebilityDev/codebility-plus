import React, { useState } from 'react'
import { convertToTitleCase, } from '../_lib/utils'
import Image from 'next/image'
import ViewProfile from './in-house-view-profile'
import Select from './in-house-select'
import CheckboxList from './in-house-checkbox-list'
import { Codev, Project } from '../_lib/codev'
import { InHouseProps } from '../_lib/in-house'
import { updateCodev } from '../actions'

interface Props {
  data: Codev;
  handleSaveButton: InHouseProps["handlers"]["handleSaveButton"];
}

function EditableCard({ data, handleSaveButton }: Props) {
  const [editableMember, setEditableMember] = useState<Codev>(data)

  const handleSelectChange = async (type: keyof Codev, value: any) => {
    try {
      await updateCodev(type, value, { codevId: editableMember.id, userId: editableMember.user_id});
    } catch (e) {
      console.log(e);
    }
    setEditableMember((prevMember) => ({
      ...prevMember,
      [type]: value,
    }))
  }

  const cleanProjects = (projects: Project[]) => {
    if (projects && projects.length > 0) {
      return projects.filter((item: Project) => item.name);
    }
    return [];
  };
  const cleanedData = cleanProjects(editableMember.projects);

  return (
    <div className="w-64 h-72 gap-4 flex flex-col justify-between p-4 rounded-md text-dark100_light900 dark:bg-dark-200 bg-light-300">
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <div className='text-lg font-bold'>{data.first_name} {data.last_name}</div>
          <Select
            type="internal_status"
            placeholder={convertToTitleCase(editableMember.internal_status)}
            handleChange={(value) => handleSelectChange("internal_status", value)}
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
          <ViewProfile user={editableMember}/>
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