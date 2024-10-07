import BackButton from '~/components/BackButton'
import NotificationButton from '~/components/NotificationButton'
import React from 'react'
import Navbar from '~/components/Navbar'
import PaymentMethod from '~/components/home/PaymentMethod'

const PaymentMethodPage = () => {
  return (
    <>

      <header className='flex justify-between items-center mt-[1.25em]'>
        <BackButton href={"/cart/confirmation"} />
        <h1>Payment Method</h1>
        <NotificationButton/>
      </header>


      <main className='flex-1'>
        <PaymentMethod />
      </main>
      

      <footer className=''>
        <Navbar/>
      </footer>


     

    </>
  )
}

export default PaymentMethodPage