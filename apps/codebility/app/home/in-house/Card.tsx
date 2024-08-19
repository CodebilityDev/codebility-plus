import React from 'react'
import { convertToTitleCase, statusColors } from '@/app/home/in-house/utils'
import Image from 'next/image'
import ViewProfile from '@/app/home/in-house/ViewProfile'
import { inhouse_TableBodyT } from '@/types/protectedroutes'

function Card({ member, handleEditButton }: inhouse_TableBodyT) {
  return (
    <div className="w-64 h-72 gap-4 flex flex-col justify-between p-4 rounded-md text-dark100_light900 dark:bg-dark-200 bg-light-300">
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <div className='text-lg font-bold'>{member.first_name} {member.last_name}</div>
          <div className={`${statusColors[convertToTitleCase(member.status_internal)]} text-sm`}>{convertToTitleCase(member.status_internal)}</div>
        </div>
        <div className='text-sm'>{member.main_position}</div>
      </div>

      <div className="ml-2 flex-1">
        <div className='text-sm'>Projects:</div>
        {member.projects?.map((item, key) => (
          <ul key={key} className="ml-4 flex items-center text-sm list-disc">
            {item.project && item.project.project_name ? (
              <li>{item.project.project_name}</li>
            ) : null}
          </ul>
        ))}
      </div>

      <div className='flex justify-between '>
        <div className="flex gap-2">
          <div>NDA: </div>
          {member.nda_status || "-"}
        </div>
        <span className="flex gap-2">
          <ViewProfile />
          <button
            onClick={() => handleEditButton(member.id)}
          >
            <Image
              src={"https://codebility-cdn.pages.dev/assets/svgs/icon-edit.svg"}
              alt="Edit Icon"
              width={0}
              height={0}
              style={{ width: '1rem', height: "auto" }}
            />
          </button>
        </span>
      </div>
    </div>
  )
}

export default Card;