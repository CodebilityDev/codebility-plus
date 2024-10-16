"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BgHandler from "@/components/home/BgHandler"
import { useState } from "react"
import BackWithNotif from "@/components/BackWithNotif"

export default function DiscountPage() {

  const [ promoDiscountApplied, setPromoDiscountApplied ] = useState(false)
  const [ pwdOrSeniorIdDiscountApplied, setPwdOrdSeniorIdDiscountApplied ] = useState(false)
  const [ promoText, setPromoText ] = useState("")
  const [ pwdSeniorText, setPwdSeniorText ] = useState("")

  const applyPromo = async () => {
    if (!promoText) return
    // logic here
    console.log("promo")
    setPromoDiscountApplied(true)
  }

  const applyPwdOrSeniorId = async () => {
    if (!pwdSeniorText) return
    // logic here
    console.log("pwd senior")
    setPwdOrdSeniorIdDiscountApplied(true)
  }


  return (
    <main className="flex flex-col gap-y-3">
      <BackWithNotif backText="Back to Confirmation" href={"/cart/confirmation"} replace />
      <h1 className="text-center text-white text-2xl font-semibold">Discounts</h1>
      <section className="bg-white rounded-[20px] p-6 pb-14 flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <h2>Promo Code</h2>
          <div className="relative">
            <Input 
            placeholder="Enter the promo code"
            className="py-4 rounded-2xl  ring-custom-primary focus-visible:ring-custom-primary"
            value={promoText}
            onChange={(e) => setPromoText(e.currentTarget.value)}
             />
            <Button
            className={`absolute right-0 top-1/2 -translate-y-1/2 ${promoText ? "text-custom-primary" : "text-[#979797]"}`}
            variant={"ghost"}
            onClick={applyPromo}
            disabled={Boolean(!promoText)}
            >APPLY</Button>
            <p className="text-custom-primary text-[12px] absolute left-4 -bottom-5">
              {promoDiscountApplied ? "Discount Applied" : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <h2>PWD / Senior Discount ID No.</h2>
          <div className="relative">
            <Input 
            placeholder="Enter the last 4 digits here"
            className="py-4 rounded-2xl  ring-custom-primary focus-visible:ring-custom-primary"
            value={pwdSeniorText}
            onChange={(e) => setPwdSeniorText(e.currentTarget.value)}
             />
            <Button
            className={`absolute right-0 top-1/2 -translate-y-1/2 text-[#979797] ${pwdSeniorText ? "text-custom-primary" : "text-[#979797]"}`}
            variant={"ghost"}
            onClick={applyPwdOrSeniorId}
            disabled={Boolean(!pwdSeniorText)}
            >APPLY</Button>
            <p className="text-custom-primary text-[12px] absolute left-4 -bottom-5">
              {pwdOrSeniorIdDiscountApplied ? "Discount Applied" : ""}
            </p>
          </div>
        </div>
      </section>
      <BgHandler />
    </main>
  )
}