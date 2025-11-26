import * as React from "react"
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import UserPicker from "./user-picker";
import type { User } from "@/types/user";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import DatePicker from "./date-picker";

export interface IMeetingDetails {
  invited: string[];
  name: string;
  date: Date;
  time: string;
  isPrivate: boolean;
}

export default function CreateEvent() {
  const [formVm, setFormVm] = React.useState({
    date: new Date(),
    invited: [],
    isPrivate: true,
    name: "",
    time: ""
  } as IMeetingDetails);
  const [chosen, setChosen] = React.useState<User[]>([]);

  function pickUser(user?: User) {
    if(!user) return;
    setChosen([...chosen, user])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Create meeting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-3">
          <DialogHeader>
            <DialogTitle>
              Plan a meeting
            </DialogTitle>
            <DialogDescription>
              Fill information to schedule a meeting
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Meeting name
              </FieldLabel>
              <Input
                id="meeting-name"
                type="text"
                value={formVm.name}
                onChange={(e) => setFormVm(prev => ({...prev, name: e.target.value}))}
                required
              />
            </Field>
            <Field>
              <FieldLabel>
                Invited people
              </FieldLabel>
              <UserPicker 
                chosen={chosen} 
                pickUser={pickUser}
              >
              </UserPicker>
            </Field>
            <Field>
              <FieldLabel>
                Meeting date
              </FieldLabel>
              <div className="flex flex-row justify-between gap-3">
                <DatePicker
                  date={formVm.date}
                  setDate={(date: Date) => { setFormVm(prev => ({...prev, date: date})) }}
                />
                <Input
                  type="time"
                  id="time-picker"
                  step="60"
                  defaultValue=""
                  className="bg-background appearance-none 
                  [&::-webkit-calendar-picker-indicator]:hidden 
                  [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(e) => { setFormVm(prev => ({ ...prev, time: e.target.value })) }}
                />
              </div>
            </Field>
            <div className="flex items-center space-x-2 mb-9">
              <Label htmlFor="accept-outside">Aceept people who are not invited? </Label>
              <Switch 
                id="accept-outside" 
                onCheckedChange={(isChecked) => setFormVm(prev => ({...prev, isPrivate: !isChecked}))}
              />
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit">Add meeting</Button>
            <DialogClose asChild>
              <Button variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}