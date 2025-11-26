import type { User } from "@/types/user";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

interface IUserPickerProps {
  chosen: User[];
  pickUser: (user?: User) => void;
}

export default function UserPicker({chosen, pickUser} : IUserPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  
  React.useEffect(() => {
    const filteredUsers = users.filter(x => !chosen.find(y => y.id == x.id));
    setUsers(filteredUsers)
  }, [chosen])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            Select people to invite
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-full p-0">
          <Command>
            <CommandInput placeholder="Search for people" className="h-9" />
            <CommandList>
              <CommandEmpty>No people found</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={(id) => {
                      const user = users.find(x => x.id == id);
                      pickUser(user);
                    }}
                  >
                    {user.username}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}