import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { PenIcon, TrashIcon, TvMinimalPlayIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateEvent from '@/components/create-event';

export interface Meeting {
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

  function parseMeetingTime(meeting: Meeting, now: number) {
    const time = Date.parse(meeting.date + 'T' + meeting.time);
    if(time < now) {
      return `Started ${Math.floor((now - time) / (1000 * 60))} minutes ago`;
    } else {
      return `Starts in ${Math.floor((time - now) / (1000 * 60))} minutes`;
    }
  }

  const { data, isLoading } = useQuery<Meeting[]>({
    queryKey: ['activeMeetings'],
    queryFn: fetchActiveMeetings,
    refetchInterval: 60000,
    select: (meetings) => {
      return meetings
        .filter((meeting) => {
          const now = new Date();
          const date = new Date(meeting.date + 'T' + meeting.time);
          return Math.abs(now.getTime() - date.getTime()) <= 60 * 60 * 1000;
        })
        .sort((a, b) => {
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
            <div className="m-9 p-3 border-1 rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.name}</TableCell>
                      <TableCell>{parseMeetingTime(meeting, Date.now())}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-row justify-end space-x-2 items-center">
                          <Link to={`/dashboard`} className="text-blue-600 hover:underline mr-9">
                            Join Meeting
                          </Link>
                          <div className="w-8 h-8 cursor-pointer flex justify-center 
                          p-1 border-1 border-black rounded-md hover:bg-secondary/50">
                            <PenIcon />
                          </div>
                          <div className="w-8 h-8 cursor-pointer flex justify-center 
                          p-1 border-1 border-red-500 rounded-md hover:bg-secondary/50">
                            <TrashIcon color='red' />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        }
      </div>
    </>

  )
}
