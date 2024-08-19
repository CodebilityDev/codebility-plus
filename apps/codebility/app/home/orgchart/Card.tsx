import Image from "next/image"
import { defaultAvatar } from "@/public/assets/images"
import { org_CardT } from "@/types/protectedroutes"

const Card = ({ orgChartData }: { orgChartData: org_CardT[] }) => {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-8 xl:gap-4">
      {orgChartData.map((item: org_CardT) => (
        <li key={item.name} className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center">
            <div className={`h-3 w-3 rounded-full bg-black-300`}>{/* Dot */}</div>
            <div className="flex h-36 w-32 flex-col items-center justify-center gap-1 p-2 text-center lg:w-40">
              <Image src={item.image || defaultAvatar} alt="filter" width={50} height={50} className="rounded-full" />
              <p className="text-sm font-semibold capitalize">{item.name}</p>
              <p className="text-xs capitalize">{item.position}</p>
            </div>
          </div>

          {item.children && item.children?.length > 0 && (
            <ul className="flex flex-row items-center justify-center">
              <Card orgChartData={item.children} />
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

export default Card
