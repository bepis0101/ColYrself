import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/meetings')({
  component: RouteComponent,
})

async function fetchMeetings() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}meetings/`, {
    credentials: 'include',
    method: "GET"
  })
  if(!res.ok) {
    throw new Error("Cannot fetch all meetings")
  }
  return res.json();
}

function RouteComponent() {
  return (
    <div>
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
          {}
        </TableBody>
      </Table>
    </div>
  )
}
