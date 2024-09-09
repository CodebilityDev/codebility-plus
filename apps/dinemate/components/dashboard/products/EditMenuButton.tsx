"use client"
import { useRouter } from "next/navigation"

export default function EditMenuButton({menuId}:{menuId:string}) {
  const router = useRouter()

  return (
    <button className="w-full bg-[#FF680D]  py-[0.4em] px-[0.6em] text-[0.7rem]  text-white font-normal  rounded-[0.125em]"
    onClick={() => {
      router.push(`/dashboard/products/update/${menuId}`)
    }}
    >
      Edit
    </button>

  )
}