import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@codevs/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@codevs/ui/popover";
import { Button } from "../button";

// FIXME: This change directory drilling should be changed to a better path, this is a temporary for now
import { DateRange } from "../../../../../packages/ui/types/react-day-picker";

interface DateRangePickerProps {
	label?: string;
	value: DateRange;
	onChange: (value: DateRange) => void;
}

export function DateRangePicker({
	label,
	value,
	onChange,
}: DateRangePickerProps) {
	function handleOnSelect(date: DateRange) {
		onChange(date);
	}

	return (
		<div className="grid gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="value"
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!value && "text-muted-foreground",
						)}
					>
						<CalendarIcon />
						{value?.from ? (
							value.to ? (
								<>
									{format(value.from, "LLL dd, y")} -{" "}
									{format(value.to, "LLL dd, y")}
								</>
							) : (
								format(value.from, "LLL dd, y")
							)
						) : (
							<span>Pick a value</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={value.from}
						selected={value}
						onSelect={(date) =>
							handleOnSelect({
								from: date?.from,
								to: date?.to,
							})
						}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
