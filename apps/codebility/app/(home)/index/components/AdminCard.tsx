import Link from "next/link"
import Image from "next/image"

import { index_AdminCardT } from "@/types/home"

const AdminCard = ({ admin, color }: index_AdminCardT) => {
  return (
    <Link href={`/profiles/${admin.id}`} target="_blank">
      <div className={`flex h-full w-full flex-col items-center justify-between gap-4 rounded-lg   `}>
        <Image
          unoptimized
          alt={`${admin.first_name} Avatar`}
          src={admin.image_url || "/assets/svgs/icon-codebility-black.svg"}
          width={60}
          height={60}
          className={`${color} h-[250px] w-full  rounded-lg bg-cover object-cover`}
        />
        <div className="flex w-full flex-col gap-1">
          <p className="md:text-md text-sm text-white lg:text-lg">
            {admin.first_name} {admin.last_name}
          </p>
          {admin.main_position ? (
            <p className="text-sm text-gray lg:text-base">{admin.main_position}</p>
          ) : (
            <div className="text-sm lg:text-base">&nbsp;</div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default AdminCard
