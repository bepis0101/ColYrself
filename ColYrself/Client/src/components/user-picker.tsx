import type { User } from "@/types/user";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useQuery } from "@tanstack/react-query";

interface IUserPickerProps {
  chosen: User[];
  pickUser: (user?: User) => void;
}

export default function UserPicker({chosen, pickUser} : IUserPickerProps) {
  const [open, setOpen] = React.useState(false);

  async function fetchUsers() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}account/users`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json'},
      credentials: "include",
    });
    if(!res.ok) throw new Error("You need to log in");
    return res.json();
  }

  const { data } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const availableUsers = React.useMemo(() => {
    if(!data) return [];
    return data.filter(user => !chosen.find(c => c.id === user.id));
  }, [data, chosen]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="justify-between">
          Select people to invite
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search for people"
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No people found</CommandEmpty>
            <CommandGroup>
              {availableUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  onSelect={() => {
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
  );
}
