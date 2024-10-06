
import Cart from "~/components/myCart"
import BackButton from '~/components/BackButton'
import NotificationButton from '~/components/NotificationButton'

export default function MyCart(){


    return (
    
       <>


<header className='flex justify-between items-center mt-[1.25em] text-[white]'>
        <BackButton />
        <h1 className="text-[white]">Cart</h1>
        <NotificationButton/>
      </header>


          <main className='mt-[3.2em]'>


            <Cart/>

          </main>
        
        </>
    
    )
}