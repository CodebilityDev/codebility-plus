"use client"

import { useStore } from "~/hooks/useStore"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { createPortal } from "react-dom"

export default function OrdersNav() {
  const session = useStore(s => s.session)

  if (!session || !session.orderId) {
    return <></>
  }

  return (
    createPortal(
      <Link href={"/timer"} className="z-[999] text-white bg-custom-primary fixed bottom-20 right-4 flex flex-row items-center rounded-md shadow-sm px-3 py-1 gap-x-2">
        <p>To Orders</p>
        <ArrowRight size={20} />
      </Link>,
      document.body
    )
    
  )
}