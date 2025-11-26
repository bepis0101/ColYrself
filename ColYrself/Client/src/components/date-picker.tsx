import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface IDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export default function DatePicker({date, setDate} : IDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            disabled={{before: new Date()}}
            onSelect={(date) => {
              if(!date) return;
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}