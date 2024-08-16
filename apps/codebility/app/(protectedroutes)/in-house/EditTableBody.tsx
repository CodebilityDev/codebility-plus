import ViewProfile from "@/app/(protectedroutes)/in-house/ViewProfile"
import CheckboxList from "@/app/(protectedroutes)/in-house/CheckboxList"
import Select from "@/app/(protectedroutes)/in-house/Select"
import Image from 'next/image'
import { TeamMemberT } from "@/types"
import { useState } from "react"
import { inhouse_EditTableBodyT } from "@/types/protectedroutes"
import { convertToTitleCase, statusColors } from "@/app/(protectedroutes)/in-house/utils"

export default function EditTabelBody({ member, handleSaveButton }: inhouse_EditTableBodyT) {
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
    <tr className="table-border-light_dark border-b-[1px] font-light">
      <td className="p-4">{editableMember.first_name}</td>
      <td className="table-border-light_dark border-r-[1px] p-4">{editableMember.last_name}</td>
      <td className={`${statusColors[convertToTitleCase(editableMember.status_internal)]} p-4`}>
        <Select
          type="status_internal"
          placeholder={convertToTitleCase(editableMember.status_internal)}
          handleChange={(value) => handleSelectChange("status_internal", value)}
        />
      </td>
      <td className="p-4">
        <Select
          type="main_positon"
          placeholder={editableMember.main_position}
          handleChange={(value) => handleSelectChange("main_position", value)}
        />
      </td>
      <td className="p-4 flex flex-col">
        <CheckboxList
          initialItems={cleanedData}
          handleChange={((value) => handleSelectChange("projects", value))}
        />
      </td>
      <td className="p-4">
        <Select
          type="nda_status"
          placeholder={editableMember.nda_status}
          handleChange={(value) => handleSelectChange("nda_status", value)}
        />
      </td>
      <td className="p-4">
        <span className="flex gap-4 pl-2">
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
      </td>
    </tr>
  )
}
