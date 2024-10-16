
import BackButton from '@/components/BackButton'
import NotificationButton from '@/components/NotificationButton'
import TimerComponent from "@/components/timer/timer"

export default function TimerPage(){

    return(
    
    <>

<header className='flex justify-between items-center mt-[1.25em] text-[white]'>
        <BackButton />
        <h1 className="text-[white]">Timer</h1>
        <NotificationButton/>
      </header>


    <main className='mt-[2em]'>

    <TimerComponent  />

</main>
    
    
    </>
    
)
}