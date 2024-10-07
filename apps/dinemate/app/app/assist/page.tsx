"use client"

import React, { useState } from 'react'
import AssistancePage from '~/components/home/Assistance'

import BgHandler from '~/components/home/BgHandler'
import { Button } from '@codevs/ui/button'
import { assistService } from '~/modules'
import { useToast } from '~/hooks/use-toast'
import { ToastAction } from '@codevs/ui/toast'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from '~/hooks/useStore'


const AssistPage = () => {
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {toast} = useToast()
  const router = useRouter()
  
  const session = useStore(s => s.session)

  const handleAssist = async () => {
    if (!session) {
      console.warn("invalid session data")
      return;
    }
    const data = {
      userId: session.user._id,
      userName: session.user.fullname,
      message: text,
      tableNumber: session.tableNumber,
      tableId: session.tableId
    }
    try {
      setIsSubmitting(true)
      const assist = await assistService.requestAssistance(data)
    if (assist) {
      toast({
        title: "Assistance request sent.",
        description: "Please wait for the waiter response.",
        duration: 5000,
        action: <ToastAction altText="Back to Home" onClick={() => router.push("/")}>
          Back to Home
        </ToastAction>     
      })
      setText("")
    } else {
      toast({
        variant: "destructive",
        title: "Assistance request failed!",
        description: "Something went wrong while requesting assistance.",
        action: <ToastAction altText="Retry" onClick={handleAssist}>
          Retry
        </ToastAction>
      })
    }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
    
  }

  return (
    <>
       
      <BgHandler />
       <main className='mt-[5em]'>
       <AssistancePage text={text} setText={setText} />
      </main>
      <div className="fixed bottom-0 left-0 w-screen h-[69px] border-t border-custom-secondary bg-white z-50 py-2 px-4">
                <Button 
                    type='button'
                    className="relative w-full h-full font-bold disabled:opacity-50"
                    onClick={handleAssist}
                    disabled={isSubmitting || text.length === 0}
                >                    
                    {
                      isSubmitting ?
                      <Loader 
                      size={24} 
                      color="white"
                      className='animate-spin'
                      /> :
                      "Send"
                    }
                </Button>
            </div>
    </>
  )
}

export default AssistPage