import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/users')({
  component: RouteComponent,
})

async function fetchUsers() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}account/users`, {
    credentials: 'include',
    method: "GET"
  })
  if(!res.ok) {
    throw new Error("Cannot fetch all users")
  }
  return res.json();
}

function RouteComponent() {
  const { data } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div className='m-9 p-3 border-1 rounded-2xl'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
