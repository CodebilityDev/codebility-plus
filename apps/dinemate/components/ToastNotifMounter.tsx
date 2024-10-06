"use client"

import { useStore } from "~/hooks/useStore"
import { useToast } from "~/hooks/use-toast"
import { useEffect, useState } from "react"
import { ordersService } from "~/modules"
import { OrderStatus } from "~/modules/orders/orders.type"
import { capitalize } from "lodash"
import axios from "axios"
import { AssistStatus } from "~/modules/assist/assist.types"
import { assistService } from "~/modules"

export default function ToastNotifMounter() {
  const session = useStore(s => s.session)
  const {toast} = useToast()

  const [prevOrderStatus, setPrevOrderStatus] = useState<OrderStatus|null>(null)
  const [prev, setPrevMembers] = useState<string[]>([])

  const handleAssistNotif = async () => {
    if (!session) return;
    const assist = await assistService.getAssistStatus(session.user._id)

    if (!assist) {
      console.error("not assist data found")
      return;
    }
    const localAssist = localStorage.getItem("assist")
    if (!localAssist) {
      localStorage.setItem("assist", JSON.stringify(assist))
      return;
    }
    const prevAssist = JSON.parse(localAssist)
    assist.forEach(a => {
      const hasPrev = prevAssist.find((p:{id:string;status:OrderStatus}) => p.id === a.id)
      if (hasPrev && hasPrev.status !== a.status) {
        toast({
          title: `Your assist request has been ${capitalize(a.status.toLocaleLowerCase())}`
        })
      }
      
    })
    localStorage.setItem("assist", JSON.stringify(assist))

  }

  const handeNewMemberNotif = async () => {
    if (!session) return;
    const members = session.members.filter(m => m !== session.user._id)
    members.forEach(m => {
      const prevMember = prev.find(p => p === m)
      if (!prevMember) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${m}`, {
          withCredentials: true
        })
        .then(res => {
          if (res.status === 200) {
            toast({
              title: `${res.data.username} has joined your group.`
            })
          }
        })
      }
    })
    setPrevMembers(members)
  }

  const handleOrderStatusNotif =  async () => {
    console.log("handleOrderStatusNotif")
    if (!session || !session?.orderId) {
    console.log("session or order id not found", {session})
      return;
    }
    console.log("getting order status...")
    const res = await ordersService.getOrderStatus(session.orderId)
    if (!res) return;
    // will notif members that the order is created
    if (!prevOrderStatus && session.creator !== session.user._id) {
      setPrevOrderStatus(res.status)
      toast({
        title: "Your order has been processed."
      })
      return;
    }
    // status has been updated
    if (prevOrderStatus !== res.status) {
      toast({
        title: `Your order status has been set to ${capitalize(res.status.toLocaleLowerCase())}`
      })
      setPrevOrderStatus(res.status)
      return;
    }
  }


  useEffect(() => {
    handleOrderStatusNotif()    
    handeNewMemberNotif()
    handleAssistNotif()
  }, [session])


  return (
    <></>
  )
}