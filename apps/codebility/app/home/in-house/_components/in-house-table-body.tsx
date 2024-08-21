import ViewProfile from "./in-house-view-profile"
import Image from "next/image"
import { inhouse_TableBodyT } from "@/types/protectedroutes"
import { convertToTitleCase, statusColors } from "../_lib/utils"

export default function TableBody({ member, handleEditButton }: inhouse_TableBodyT) {
  const status_internal = convertToTitleCase(member.status_internal)

  return (
    <tr className="table-border-light_dark border-b-[1px] font-light" key={member.id}>
      <td className="p-4">{member.first_name}</td>
      <td className="table-border-light_dark border-r-[1px] p-4">{member.last_name}</td>
      <td className={`${statusColors[status_internal]} p-4`}>{status_internal}</td>
      <td className="p-4">{member.main_position}</td>
      <td className="p-4 flex flex-col">
        {member.projects?.map((item, key) => (
          <ul key={key} className="ml-4 flex items-center text-sm list-disc">
            {item.project && item.project.project_name ? (
              <li>{item.project.project_name}</li>
            ) : null}
          </ul>
        ))}
      </td>
      <td className="p-4">{member.nda_status || "-"}</td>
      <td className="p-4">
        <span className="flex gap-4 pl-2">
          <ViewProfile />
          <button onClick={() => handleEditButton(member.id)}>
            <Image
              src={"https://codebility-cdn.pages.dev/assets/svgs/icon-edit.svg"}
              alt="Edit Icon"
              width={0}
              height={0}
              style={{ width: '1rem', height: "auto" }}
            />
          </button>
        </span>
      </td>
    </tr>
  )
}
