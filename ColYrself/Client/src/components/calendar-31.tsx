import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import CreateEvent from "./create-event"
import type { Meeting } from "@/routes/_authenticated/dashboard"


export default function Calendar31({ meetings }: { meetings: Meeting[] }) {
  const [date, setDate] = React.useState<Date>(
    new Date()
  )

  return (
    <Card className="py-4 w-full flex gap-12 flex-col">
      <CardContent className="px-4 flex flex-row justify-center w-full">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate)}
          disabled={{ before: new Date() }}
          className="scale-110 origin-top"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t !pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <CreateEvent date={date} />
        </div>
        <div className="flex w-full flex-col gap-2">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{meeting.name}</div>
              <div className="font-small">{meeting.time}</div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
