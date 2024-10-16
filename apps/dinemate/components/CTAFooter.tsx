'use client'
import React, { useState } from 'react'
import { Button } from '@codevs/ui/button'
import { IPayment, paymentService } from '~/modules/payment/payment.service'
import { useRouter } from 'next/navigation'
import Loading from './Loading'
import { CreateOrderDto } from '~/modules/orders/orders.type'
import { useGlobalStore } from '~/hooks/useGlobalStore'


interface IProps {
  type: string
  data?: IPayment
  cartId: string;
  orderData: CreateOrderDto;
}
const CTAFooter = ({type, data, orderData, cartId}: IProps) => {
  const [loading, setLoading] = useState<boolean>(false)  
  const router = useRouter()
  const footerOptions = [
    {
      type: "cart-confirm",
      name: "Confirm Order",
      fn: () => {
        setLoading(true)
        paymentService(data?.items!, data?.total!, orderData, cartId)
        .then((res) => {
          router.push(res)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
      }
    },
    {
      type: "assist",
      name: "Submit",
      fn: () => {
        console.log("Submit");
        
      }
    }
  ]
  const cta = footerOptions.find((item) => item.type === type)

  return (
    <div className="fixed bottom-0 left-0 w-screen h-[69px] border-t border-custom-secondary bg-white z-50 py-2 px-4">
      <Button 
        type='button'
        className="w-full h-full font-bold"
        onClick={cta?.fn}
      >{loading ? <Loading /> : cta?.name}</Button>
    </div>
  )
}

export default CTAFooter