import ViewProfile from "./in-house-view-profile"
import Image from "next/image"
import { convertToTitleCase, statusColors } from "../_lib/utils"
import { Codev } from '@/types/home/codev'

interface Props {
  member: Codev;
  handleEditButton: (id: string) => void
}

export default function TableBody({ member, handleEditButton }: Props) {
  const internal_status = convertToTitleCase(member.internal_status)

  return (
    <tr className="table-border-light_dark border-b-[1px] font-light" key={member.id}>
      <td className="p-4">{member.first_name}</td>
      <td className="table-border-light_dark border-r-[1px] p-4">{member.last_name}</td>
      <td className={`${statusColors[internal_status]} p-4`}>{internal_status}</td>
      <td className="p-4">{member.main_position}</td>
      <td className="p-4 flex flex-col">
        {member.projects?.map((item, key) => (
          <ul key={key} className="ml-4 flex items-center text-sm list-disc">
            {item ? (
              <li>{item.name}</li>
            ) : null}
          </ul>
        ))}
      </td>
      <td className="p-4">{member.nda_status || "-"}</td>
      <td className="p-4">
        <span className="flex gap-4 pl-2">
          <ViewProfile user={member}/>
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
