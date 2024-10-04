import React, { useState } from "react";
import Image from "next/image";
import { Codev, Project } from "@/types/home/codev";

import { convertToTitleCase } from "../_lib/utils";
import { InHouseProps } from "../_types/in-house";
import { updateCodev } from "../actions";
import CheckboxList from "./in-house-checkbox-list";
import Select from "./in-house-select";
import ViewProfile from "./in-house-view-profile";

interface Props {
  data: Codev;
  handleSaveButton: InHouseProps["handlers"]["handleSaveButton"];
}

function EditableCard({ data, handleSaveButton }: Props) {
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
    <div className="text-dark100_light900 dark:bg-dark-200 bg-light-300 flex w-full flex-col justify-between gap-4 rounded-md p-4">
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold capitalize">
          {data.first_name} {data.last_name}
        </div>
        <Select
          type="internal_status"
          placeholder={convertToTitleCase(editableMember.internal_status)}
          handleChange={(value) => handleSelectChange("internal_status", value)}
        />
        <Select
          className="text-sm"
          type="main_positon"
          placeholder={editableMember.main_position}
          handleChange={(value) => handleSelectChange("main_position", value)}
        />
        <Select
          className="text-sm"
          type="type"
          placeholder={editableMember.type}
          handleChange={(value) => handleSelectChange("type", value)}
        />
      </div>

      <div className="ml-2 flex-1">
        <div className="text-sm">Projects:</div>
        <CheckboxList
          className="text-sm"
          initialItems={cleanedData}
          handleChange={(value) => handleSelectChange("projects", value)}
        />
      </div>

      <div className="flex flex-col justify-between gap-2">
        <div className="flex w-full items-center gap-2">
          <div className="align-baseline">NDA: </div>
          <div className="w-full">
            <Select
              className="text-sm"
              type="nda_status"
              placeholder={editableMember.nda_status}
              handleChange={(value) => handleSelectChange("nda_status", value)}
            />
          </div>
        </div>
        <span className="flex justify-end gap-4">
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
      </div>
    </div>
  );
}

export default EditableCard;
