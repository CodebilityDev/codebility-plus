"use client"

import BackWithNotif from "~/components/BackWithNotif"
import BgHandler from "~/components/home/BgHandler"
import OrderListItem from "~/components/OrderListItem"
import Link from "next/link"
import { CreditCard, ChevronRight, BadgePercent, CircleDollarSign, Currency, Loader } from "lucide-react"
import { sampleOrderList } from "~/lib/data"
import CTAFooter from "~/components/CTAFooter"
import { IPayment } from "~/modules/payment/payment.service"
import { cartService } from "~/modules"
import { menuService } from "~/modules"
import type { IMenu } from "~/modules/menu/menu.types"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@codevs/ui/button"
import { useRouter } from "next/navigation"
import { ordersService } from "~/modules"
import { OrderType } from "~/modules/cart/cart.types"
import { useToast } from "~/hooks/use-toast"
import { ToastAction } from "@codevs/ui/toast"
import createAxiosInstance from "~/lib/apiRequests/Axios"
import { useStore } from "~/hooks/useStore"
import { setCookie } from "cookies-next"

export  default function ConfirmationPage() {
  const [cartContents, setCartContents] = useState<{
    menu: IMenu;
    menuId: string;
    amount: number;
    updatedAt: string;
}[]>([])
  const {toast} = useToast()
  const searchParams = useSearchParams()
  const paymentMode = searchParams.get("mode")
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const session = useStore(s => s.session)
  const updateSession = useStore(s => s.updateSession)

  const handleGetCartData = async () => {
    if (!session) {
      console.error("session is missing")
      return
    }
    const cartData = await cartService.getCart(session.cartId)
    if (cartData) {

        const menuIds = cartData.cartContents.map(c => c.menuId)
        console.log({
            menuIds
        })
        const menus = await menuService.getSpecificMenus(menuIds)
        if (!menus) {
          console.error("error retrieving menu data")
          return;
        }
        const cartWithMenuData = cartData.cartContents.map((c,i) => ({...c, menu:menus.find(m => m._id === c.menuId)})) as typeof cartContents
        setCartContents(cartWithMenuData)
    }

  }

  const handleCashPayment = async () => {
    if (!session) {
      console.error("failed to handleCashPayment, missing data", session)
      return;
    }        
    if (cartContents.length === 0) {
      console.error("cannot order with 0 items")
      return;
    }

    const data = {
      userId: session.user._id,
      tableNumber: session.tableNumber,
      members: session.members, // TODO: handle group order,
      orderType: session.orderType,
      orders: cartContents.map(c => ({
        menuId: c.menuId,
        amount: c.amount,
        updatedAt: c.updatedAt,
        userId: session.user._id
      }))
    }
    setIsLoading(true)
    const res = await ordersService.createOrder(data, session.cartId)
    if (res) {
      toast({
        title: "Order Submitted"
      })      
      await updateSession()
      router.replace("/timer") 
      
    } else {
      toast({
        variant: "destructive",
        title: "Order Failed",
        action: <ToastAction altText="retry" onClick={handleCashPayment}>Retry</ToastAction>
      })
    }
    setIsLoading(false)
  }

useEffect(() => {
  handleGetCartData()
}, [])

  
  const totalItems = cartContents.reduce((acc,curr) => {
    return acc+= curr.amount
  }, 0)
  const totalAmount  = cartContents.reduce((acc,curr) => {
    return acc+= (curr.amount * curr.menu.price)
  }, 0)

  const fakeDiscount = 0

  // const data: IPayment = {
  //   items: [
  //     {
  //       name: "Sample Item",
  //       unit_amount: {
  //         currency_code: "PHP",
  //         value: '100.00'
  //       },
  //       quantity: 1
  //     }
  //   ],
  //   total: '100.00'
  // };
  const paymentData: IPayment = {
    items: cartContents.map(c => {
      return {
        name: c.menu.name,
        unit_amount: {
          currency_code: "PHP",
          value: c.menu.price.toString()
        },
        quantity: c.amount
      }
    }),
    total: cartContents.reduce((acc,curr) => acc += (curr.amount * curr.menu.price),0).toString()
  }

  return (
    <main className="flex flex-col gap-y-3">
      <BackWithNotif backText="Back to Cart" href={"/app/cart"} replace />      
      <BgHandler />
        <h1 className="text-center text-white text-2xl font-semibold">Confirmation</h1>        
        <section className="flex flex-col text-custom-accent">
          <div className="flex flex-col gap-y-3">
            <Link href={"/app/payment"}
            className=" flex flex-row items-center justify-between bg-white rounded-[20px] px-6 py-5"
            >
              <div className="flex flex-row items-center gap-x-2">
                <CreditCard size={20} />
                <p>Mode of Payment</p>
              </div>
              <ChevronRight size={20} />
            </Link>
            <Link href={"/cart/confirmation/discounts"}
            className=" flex flex-row items-center justify-between bg-white rounded-[20px] px-6 py-5"
            >
              <div className="flex flex-row items-center gap-x-2">
                <BadgePercent size={20} />
                <p>Discounts</p>
              </div>
              <ChevronRight size={20} />
            </Link>
            <Link href={"/cart/confirmation/tip"}
            className=" flex flex-row items-center justify-between bg-white rounded-[20px] px-6 py-5"
            >
              <div className="flex flex-row items-center gap-x-2">
                <CircleDollarSign size={20} />
                <p>Tip</p>
              </div>
              <ChevronRight size={20} />
            </Link>
          </div>
        </section>
        <section className="bg-white rounded-[20px] p-6 pb-[100px] flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <h2>Orders</h2>
            <p className="text-[#979797]">Review your orders.</p>
          </div>
          <div className="flex flex-col gap-y-2">
            {
              cartContents.map(o => (
                <OrderListItem
                  amount={o.amount}
                  name={o.menu.name}
                  total={o.amount * o.menu.price}
                  key={o.menu._id} 
                />
              ))
            }
          </div>
          <div className="flex flex-col gap-y-5">
            <h3>Payment Summary</h3>
            <div className="text-[#979797] flex flex-row items-center justify-between">
              <p className="text-sm">Total Items  ({totalItems})</p>
              <p className="text-[12px]">₱ {totalAmount.toLocaleString()}</p>
            </div>
            { fakeDiscount > 0 && <div className="text-[#979797] flex flex-row items-center justify-between">
              <p className="text-sm">Discount</p>
              <p className="text-[12px]">₱ {fakeDiscount.toLocaleString()}</p>
            </div>}
            <div className="font-semibold flex flex-row items-center justify-between">
              <p>Total</p>
              <p>₱ {(totalAmount - fakeDiscount).toLocaleString()}</p>
            </div>
          </div>          
        </section>
        {
          !paymentMode ?
          <div className="fixed bottom-0 left-0 w-screen h-[69px] border-t border-custom-secondary bg-white z-50 py-2 px-4">
                <Button 
                    type='button'
                    className="w-full h-full font-bold"
                    onClick={() => router.push("/app/payment")}
                    disabled={isLoading}
                >
                  Select a payment method first
                </Button>
            </div> :
          paymentMode === "cash" ?
          <div className="fixed bottom-0 left-0 w-screen h-[69px] border-t border-custom-secondary bg-white z-50 py-2 px-4">
                <Button 
                    type='button'
                    className="w-full h-full font-bold"
                    onClick={handleCashPayment}
                    disabled={isLoading}
                >
                  {
                    isLoading ?
                    <Loader size={21} color="white" /> :
                    "Place Order"
                  }
                </Button>
            </div> :
        <CTAFooter 
        type="cart-confirm" 
        data={paymentData} 
        cartId={session!.cartId}
        orderData={
          {
            userId: session!.user._id,
            tableNumber: session!.tableNumber!,
            members: session!.members, // TODO: handle group order,
            orderType: session!.orderType,
            orders: cartContents.map(c => ({
              menuId: c.menuId,
              amount: c.amount,
              updatedAt: c.updatedAt,
              userId: session!.user._id
            }))
          }
        } />
        }
    </main>
  )
}