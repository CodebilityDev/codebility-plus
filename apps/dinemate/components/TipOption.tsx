'use client'

import { useRouter } from "next/navigation"

const TipOption = ({amount = 'Not Now'}: {amount?: number | string}) => {
  const router = useRouter()
  const formattedAmount = amount === 'Not Now' ? amount : `₱ ${amount}.00`

  const handleTip = () => {
    console.log(amount);
    router.back()
  }
  return (
    <div className='rounded-full border px-5 py-3 flex justify-between items-center group relative'
      onClick={handleTip}
    >
      <span>{formattedAmount}</span>
      <input type="radio" value={amount} className='w-4 h-4' />
    </div>
  )
}

export default TipOption