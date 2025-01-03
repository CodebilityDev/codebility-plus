import { useState } from "react";
import Image from "next/image";
import { Codev, Project } from "@/types/home/codev";

import { convertToTitleCase, statusColors } from "../_lib/utils";
import { InHouseProps } from "../_types/in-house";
import { updateCodev } from "../actions";
import CheckboxList from "./in-house-checkbox-list";
import Select from "./in-house-select";
import ViewProfile from "./in-house-view-profile";

interface Props {
  data: Codev;
  handleSaveButton: InHouseProps["handlers"]["handleSaveButton"];
}

export default function EditTabelBody({ data, handleSaveButton }: Props) {
  const [editableMember, setEditableMember] = useState<Codev>(data);
  const handleSelectChange = async (type: keyof Codev, value: any) => {
    try {
      await updateCodev(type, value, {
        codevId: editableMember.id,
        userId: editableMember.user_id,
      });
    } catch (e) {
      console.log(e);
    }
    setEditableMember((prevMember) => ({
      ...prevMember,
      [type]: value,
    }));
  };

  const cleanProjects = (projects: Project[]) => {
    if (projects && projects.length > 0) {
      return projects.filter((item: Project) => item.name);
    }
    return [];
  };
  const cleanedData = cleanProjects(editableMember.projects);
  return (
    <tr className="table-border-light_dark border-b-[1px] font-light">
      <td className="p-4">{editableMember.first_name}</td>
      <td className="table-border-light_dark border-r-[1px] p-4">
        {editableMember.last_name}
      </td>
      <td
        className={`${statusColors[convertToTitleCase(editableMember.internal_status)]} p-4`}
      >
        <Select
          type="internal_status"
          placeholder={convertToTitleCase(editableMember.internal_status)}
          handleChange={(value) => handleSelectChange("internal_status", value)}
        />
      </td>
      <td className="p-4">
        <Select
          type="type"
          placeholder={convertToTitleCase(editableMember.type)}
          handleChange={(value) => handleSelectChange("type", value)}
        />
      </td>
      <td className="p-4">
        <Select
          type="main_positon"
          placeholder={editableMember.main_position}
          handleChange={(value) => handleSelectChange("main_position", value)}
        />
      </td>
      <td className="flex flex-col p-4">
        <CheckboxList
          initialItems={cleanedData}
          handleChange={(value) => handleSelectChange("projects", value)}
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
          <ViewProfile user={editableMember} />
          <button onClick={() => handleSaveButton(editableMember)}>
            <Image
              src={
                "https://codebility-cdn.pages.dev/assets/svgs/icon-checkbox.svg"
              }
              alt="Checkbox Icon"
              width={0}
              height={0}
              style={{ width: "1.25rem", height: "auto" }}
            />
          </button>
        </span>
      </td>
    </tr>
  );
}
