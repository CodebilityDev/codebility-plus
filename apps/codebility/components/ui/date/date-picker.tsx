import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@codevs/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@codevs/ui/popover"
import { Button } from "../button"
import { Calendar } from "@codevs/ui/calendar"

interface DatePickerProps {
  label?: string
  value: Date
  onChange: (value: Date) => void
}

export default function DatePicker({
  label,
  value,
  onChange,
}: DatePickerProps) {

  function handleOnSelect(date: Date) {
    onChange(date)
  }

  return (
    <div>
      <div className="*:not-first:mt-2">
        <Label>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                !value && "text-muted-foreground"
              )}
            >
              <span
                className={cn("truncate", !value && "text-muted-foreground")}
              >
                {value ? format(value, "PPP") : "Select a date"}
              </span>
              <CalendarIcon
                size={16}
                className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar mode="single" selected={value} onSelect={(date) => handleOnSelect(date as Date)} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

