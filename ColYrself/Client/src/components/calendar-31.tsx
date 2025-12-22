import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import CreateEvent from "./create-event"
import type { Meeting } from "@/routes/_authenticated/dashboard"
import { Button } from "./ui/button"
import { Link } from "@tanstack/react-router"
import { PenIcon, TrashIcon } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export default function Calendar31({ meetings }: { meetings: Meeting[] }) {
  const [date, setDate] = React.useState<Date>(
    new Date()
  )
  const [open, setOpen] = React.useState(false);
  const [editMeetingId, setEditMeetingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return meetings.filter(x => new Date(x.date).getDate() === date.getDate())
  }, [date, meetings]);
  
  const queryClient = useQueryClient();

  async function fetchDeleteMeeting(meetingId: string) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}meetings/delete/${encodeURIComponent(meetingId)}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to delete meeting");
    }
    return {}
  }

  const deleteMutation = useMutation({ 
    mutationKey: ['deleteMeeting', editMeetingId],
    mutationFn: (meetingId: string) => fetchDeleteMeeting(meetingId),
    onSuccess: () => {
      toast.success("Meeting deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['allActiveMeetings'] });
      queryClient.invalidateQueries({ queryKey: ['activeMeetings'] });
    },
    onError: () => {
      toast.error("Failed to delete meeting");
    }
  });

  return (
    <React.Fragment>
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
          <div className={`flex items-center justify-between w-full ${filtered.length > 0 ? "mb-4" : ""}`}>
            <div className="text-sm font-medium">
              {date?.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <Button onClick={() => setOpen(true)}>Create Event</Button>
          </div>
          <div className="flex w-full flex-col gap-2">
            {filtered.map((meeting) => (
              <div
              key={meeting.id}
              className="bg-muted after:bg-primary/70 relative rounded-md 
              p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full
              flex flex-row justify-between
              "
              >
                <div>
                  <div className="font-medium">{meeting.name}</div>
                  <div className="font-small">{meeting.time.slice(0, 5)}</div>
                </div>
                <div className="flex flex-row justify-end space-x-2 items-center">
                  <Link to={`/dashboard`} className="text-blue-600 hover:underline mr-9">
                    Join Meeting
                  </Link>
                  <Button variant="outline" className="w-8 h-8 flex justify-center
                    p-1 border-1 border-gray-500 rounded-md hover:bg-secondary/50"
                    onClick={() => {setOpen(true); setEditMeetingId(meeting.id);}}
                  >
                    <PenIcon />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-8 h-8 flex justify-center
                      p-1 border-1 border-red-500 rounded-md hover:bg-secondary/50">
                        <TrashIcon color='red' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this meeting?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This acction cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(meeting.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
      <CreateEvent open={open} setOpen={setOpen} date={date} editMeetingId={editMeetingId} />
    </React.Fragment>
  )
}
