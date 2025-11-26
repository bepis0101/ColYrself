import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { TvMinimalPlayIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateEvent from '@/components/create-event';

interface Meeting {
  id: string;
  name: string;
  date: string;
  time: string;
  invitedIds: string[];
  organizerId: string;
  isPrivate: boolean;
}

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  async function fetchActiveMeetings() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}meetings/getallmymeetings`, {
      method: 'GET',
      credentials: 'include',
    });
    if(!res.ok) {
      const errorData = await res.text();
      throw new Error(errorData || 'Failed to fetch meetings');
    }
    return res.json();
  }

  const { data, isLoading } = useQuery<Meeting[]>({
    queryKey: ['activeMeetings'],
    queryFn: fetchActiveMeetings,
    refetchInterval: 60000,
    select: (meetings) => {
      return meetings
        .filter(x => Date.parse(x.date) >= Date.now())
        .sort((a, b) => {
          if(a.date === b.date) {
            return Date.parse(a.time) - Date.parse(b.time);
          }
          return Date.parse(a.date + "T" + a.time) - Date.parse(b.date + "T" + b.time);
        });
    }
  });
  
  return (
    <>
      <div className="align-center justify-center flex flex-col">
        {
          isLoading || !data || data.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia itemType='icon'>
                  <TvMinimalPlayIcon />
                </EmptyMedia>
                <EmptyTitle>No active meetings found</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <div className='flex flex-row'>
                  <CreateEvent />
                </div>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Join</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{meeting.name}</TableCell>
                    <TableCell>{meeting.organizerId}</TableCell>
                    <TableCell>{meeting.date}</TableCell>
                    <TableCell>{meeting.time}</TableCell>
                    <TableCell>
                      <Link to={`/dashboard`} className="text-blue-600 hover:underline">
                        Join Meeting
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
      </div>
    </>

  )
}
