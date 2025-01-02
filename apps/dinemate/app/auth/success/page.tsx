import { Button } from "@codevs/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function Success() {
  return (
    <div className="self-center max-w-[360px] h-[60vh] flex flex-col items-center justify-center">
      <section className="flex flex-col items-center gap-y-6">
        <div className="flex items-center justify-center w-[106px] aspect-square rounded-full border-2 border-custom-primary bg-custom-primary/10">
          <Check size={40} className="stroke-custom-primary" />
        </div>
        <h1 className="text-2xl font-bold">Success!</h1>
        <div className="flex flex-col items-center w-full gap-y-4">
          <p className="text-custom-muted font-semibold text-center w-5/6">Congratulations! You have been successfully authenticated.</p>
          <Link href={"/app"} className="w-full">
            <Button className="h-14 text-base w-full font-bold">Confirm</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}