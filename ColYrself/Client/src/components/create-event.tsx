import * as React from "react"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { DialogFooter, DialogHeader } from "./ui/dialog"
import UserPicker from "./user-picker"
import type { User } from "@/types/user"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import DatePicker from "./date-picker"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "./ui/badge"
import { X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export interface IMeetingDetails {
  invited: string[]
  name: string
  date: Date
  time: string
  isPrivate: boolean
}

function isPast(formVm: IMeetingDetails) {
  const [hours, minutes] = formVm.time.split(":").map(Number)
  const dt = new Date(formVm.date)
  dt.setHours(hours, minutes, 0, 0)
  return dt < new Date()
}

export default function CreateEvent({ date }: { date?: Date }) {
  const [open, setOpen] = React.useState(false)

  const defaultForm = React.useCallback(() => ({
    date: date ?? new Date(new Date().setHours(0, 0, 0, 0)),
    invited: [],
    isPrivate: true,
    name: "",
    time: ""
  }) as IMeetingDetails, [date])

  const [formVm, setFormVm] = React.useState<IMeetingDetails>(defaultForm())
  const [chosen, setChosen] = React.useState<User[]>([])

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (date) {
      setFormVm(prev => ({ ...prev, date }))
    }
  }, [date])

  React.useEffect(() => {
    setFormVm(prev => ({ ...prev, invited: chosen.map(x => x.id) }))
  }, [chosen])

  function pickUser(user?: User) {
    if (!user) return
    setChosen(prev => [...prev, user])
  }

  async function fetchSubmitEvent(vm: IMeetingDetails) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}meetings/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vm),
      credentials: "include"
    })

    if (!res.ok) {
      const errorData = await res.text()
      toast.error("Failed to create meeting: " + errorData)
      throw new Error(errorData || "Meeting creation failed")
    }
    return {}
  }

  const eventCreationMutation = useMutation({
    mutationFn: (vm: IMeetingDetails) => fetchSubmitEvent(vm),
    onSuccess: () => {
      toast.success("Meeting created successfully")
      queryClient.invalidateQueries({ queryKey: ['allActiveMeetings'] });
      queryClient.invalidateQueries({ queryKey: ['activeMeetings'] });
      setOpen(false)
    },
    onError: () => {
      console.error("Meeting creation failed")
    }
  })

  function handleSubmitEvent() {
    if (formVm.time === "") {
      toast.error("Time cannot be empty")
      return
    }

    if (isPast(formVm)) {
      toast.error("Date cannot be earlier than now")
      return
    }

    if (formVm.invited.length === 0 && formVm.isPrivate) {
      toast.error("Invite some people if you want the meeting to be private")
      return
    }

    eventCreationMutation.mutate(formVm)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create meeting</Button>

      <Dialog
        open={open}
        onOpenChange={isOpen => {
          setOpen(isOpen)

          if (!isOpen) {
            setChosen([])
            setFormVm(defaultForm())
          }
        }}
      >
        <DialogContent>
          <form
            className="flex flex-col gap-3"
            onSubmit={e => {
              e.preventDefault()
              handleSubmitEvent()
            }}
          >
            <DialogHeader>
              <DialogTitle>Plan a meeting</DialogTitle>
              <DialogDescription>Fill information to schedule a meeting</DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel>Meeting name</FieldLabel>
                <Input
                  id="meeting-name"
                  type="text"
                  value={formVm.name}
                  onChange={e => setFormVm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Invited people</FieldLabel>
                {chosen.length > 0 && (
                  <div className="flex w-full flex-wrap gap-2">
                    {chosen.map(x => (
                      <Tooltip key={x.id}>
                        <TooltipTrigger asChild>
                          <Badge onClick={() => setChosen(chosen.filter(y => y.id !== x.id))}>
                            {x.username}
                            <X color="red" />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Remove from invited</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
                <UserPicker chosen={chosen} pickUser={pickUser} />
              </Field>
              <Field>
                <FieldLabel>Meeting date</FieldLabel>
                <div className="flex flex-row justify-between gap-3">
                  <DatePicker
                    date={formVm.date}
                    setDate={(d: Date) => setFormVm(prev => ({ ...prev, date: d }))}
                  />
                  <Input
                    type="time"
                    id="time-picker"
                    step="60"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    value={formVm.time}
                    onChange={e => setFormVm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </Field>

              <div className="flex items-center space-x-2 mb-9">
                <Label htmlFor="accept-outside">Accept people who are not invited?</Label>
                <Switch
                  id="accept-outside"
                  checked={!formVm.isPrivate}
                  onCheckedChange={isChecked =>
                    setFormVm(prev => ({ ...prev, isPrivate: !isChecked }))
                  }
                />
              </div>
            </FieldGroup>

            <DialogFooter>
              <Button type="submit">Add meeting</Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
