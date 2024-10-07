import BackWithNotif from '@/components/BackWithNotif'
import TipOption from '@/components/TipOption'
import BgHandler from '@/components/home/BgHandler'
import React from 'react'

const TipPage = () => {
  return (
    <section className='flex flex-col gap-y-3'>
      <BackWithNotif backText="Back to Confirmation" href={"/cart/confirmation"} replace />
      <BgHandler />
      <h1 className='text-center text-white text-2xl font-semibold'>Tip</h1>
      <div className="bg-white  rounded-[20px] p-6 pb-14 flex flex-col">
        <h2 className='font-[500] mb-1'>Give Tip</h2>
        <span className='text-[#979797] text-sm'>100% of the tip go to our service crews.</span>
        <div className="flex flex-col gap-y-[10px] mt-4">
          <TipOption amount={20}/>
          <TipOption amount={50}/>
          <TipOption amount={100}/>
          <TipOption amount={200}/>
          <TipOption amount={500}/>
          <TipOption/>
        </div>
      </div>
    </section>
  )
}

export default TipPage