import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/meetings')({
  component: RouteComponent,
})

interface Meeting {
  id: string;
  name: string;
  date: string;
  time: string;
  organizer: User;
  invitedUsers: User[];
}

async function fetchMeetings() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}meetings`, {
    credentials: 'include',
    method: "GET"
  })
  if(!res.ok) {
    throw new Error("Cannot fetch all meetings")
  }
  return res.json();
}

function RouteComponent() {

  const { data } = useQuery<Meeting[]>({
    queryKey: ['allMeetings'],
    queryFn: fetchMeetings,
  });

  return (
    <div className='m-9 p-3 border-1 rounded-2xl'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Invited users</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.map((meeting) => (
            <TableRow key={meeting.id}>
              <TableCell>{meeting.name}</TableCell>
              <TableCell>{meeting.date}</TableCell>
              <TableCell>{meeting.time}</TableCell>
              <TableCell>{meeting.organizer.username}</TableCell>
              <TableCell>{meeting.invitedUsers.map(user => user.username).join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
