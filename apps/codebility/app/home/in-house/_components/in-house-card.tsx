import React from "react";
import Image from "next/image";
import { Codev } from "@/types/home/codev";

import { convertToTitleCase, statusColors } from "../_lib/utils";
import ViewProfile from "./in-house-view-profile";

interface Props {
  member: Codev;
  handleEditButton: (id: string) => void;
}

function Card({ member, handleEditButton }: Props) {
  return (
    <div className="text-dark100_light900 dark:bg-dark-200 bg-light-300 flex h-72 w-64 flex-col justify-between gap-4 rounded-md p-4">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="text-lg font-bold">
            {member.first_name} {member.last_name}
          </div>
          <div
            className={`${statusColors[convertToTitleCase(member.internal_status)]} text-sm`}
          >
            {convertToTitleCase(member.internal_status)}
          </div>
        </div>
        <div className="text-sm">{member.main_position}</div>
      </div>

      <div className="ml-2 flex-1">
        <div className="text-sm">Projects:</div>
        {member.projects?.map((item, key) => (
          <ul key={key} className="ml-4 flex list-disc items-center text-sm">
            {item ? <li>{item.name}</li> : null}
          </ul>
        ))}
      </div>

      <div className="flex justify-between ">
        <div className="flex gap-2">
          <div>NDA: </div>
          {member.nda_status || "-"}
        </div>
        <span className="flex gap-2">
          <ViewProfile user={member} />
          <button onClick={() => handleEditButton(member.id)}>
            <Image
              src={"https://codebility-cdn.pages.dev/assets/svgs/icon-edit.svg"}
              alt="Edit Icon"
              width={0}
              height={0}
              style={{ width: "1rem", height: "auto" }}
            />
          </button>
        </span>
      </div>
    </div>
  );
}

export default Card;
