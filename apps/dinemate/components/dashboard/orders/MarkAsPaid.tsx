"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ordersService } from "@/modules"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MarkAsPaid({orderId}:{orderId:string}) {
  const [ isLoading, setIsLoading ] = useState(false)
  const router = useRouter()
  const {toast} = useToast()

  const handlePaidOrder = async () => {
    try {
      setIsLoading(true)
      const status = await ordersService.markOrderAsPaid(orderId)
      if (status === 200) {
        router.refresh()
      } else {
        toast({
          title: "Something went wrong.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={isLoading} className="disabled:opacity-50 bg-custom-primary text-white px-2 py-1 rounded-md shadow-md">Mark as Paid</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark this User as Paid</AlertDialogTitle>          
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handlePaidOrder}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}