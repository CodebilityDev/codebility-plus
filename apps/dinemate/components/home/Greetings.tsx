'use client'
import { useStore } from "~/hooks/useStore"
import { capitalize } from "lodash"

const Greetings = () => {

  const session = useStore(s => s.session)  
  return (
    <h1 className='font-normal'>Hello, 
     <span className='font-bold '> {capitalize(session?.user?.fullname.split(' ')[0] || 'user')}!</span>
    </h1>
  )
}

export default Greetings