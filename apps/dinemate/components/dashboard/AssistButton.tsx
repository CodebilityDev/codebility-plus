"use client"

import { AssistStatus } from "~/modules/assist/assist.types"
import { Button } from "@codevs/ui/button";
import { assistService } from "~/modules";
import { useState } from "react";
import { revalidate } from "~/lib/revalidate";

interface IAssistButton {
  status: AssistStatus;
  id: string;
}

export default function AssistButton({status, id}:IAssistButton) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleUpdateAssist = async () => {
    if (status === AssistStatus.Completed) {
      return;
    }

    let newStatus = status === AssistStatus.Pending ? AssistStatus.Seen : AssistStatus.Completed
    try {
      setIsLoading(true)
      const assist = await assistService.updateAssistStatus(id, newStatus)
      if (assist) {
        revalidate("/dashboard/assist")
      }
    } catch (error) {
      console.error("error updatting assist", error)
    } finally {
      setIsLoading(false)
    }
  }

  

  return (
    <Button className={`
    text-sm font-light hover:bg-custom-accent
    ${status === AssistStatus.Pending ? "bg-custom-primary" : status === AssistStatus.Seen ? "bg-green-500" : "bg-customBlue-500"}
    `}
    onClick={handleUpdateAssist}
    disabled={isLoading}
    >      
      <>
      {
        status === AssistStatus.Pending ?
        "Mark as Seen" :
        status === AssistStatus.Seen ?
        "Mark as Completed" :
        "Completed"
      }
      </>
    </Button>
)
}