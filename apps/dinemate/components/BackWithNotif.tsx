import { ChevronLeft, Bell } from "lucide-react"
import Link, {LinkProps} from "next/link"
import { Button } from "@codevs/ui/button"

interface IBackWithNotif extends LinkProps {
  backText?: string;
}

export default function BackWithNotif({backText="", ...rest}:IBackWithNotif) {
  return (
    <nav className="w-full flex flex-row items-center justify-between text-white">
      <Link {...rest} className="flex flex-row items-center gap-x-1">
        <ChevronLeft size={20} />
        <p>{backText}</p>
      </Link>
      <Button variant={"ghost"}>
        <Bell size={20} />
      </Button>
    </nav>
  )
}