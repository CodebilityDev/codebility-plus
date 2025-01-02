
import Feedback from "@/components/feedback/feedback"
import BackButton from '@/components/BackButton'
import NotificationButton from '@/components/NotificationButton'

export default function FeedbackPage(){


    return (
    
        <>

<header className='flex justify-between items-center mt-[1.25em] text-[white]'>
        <BackButton />
        <h1 className="text-[white]">Feedback & Ratings</h1>
        <NotificationButton/>
      </header>


        
        <main className='mt-[2em]'>

            <Feedback />

     </main>


        
        
        </>
        
    )
}