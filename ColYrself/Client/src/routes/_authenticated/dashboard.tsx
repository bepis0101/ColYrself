import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { PenIcon, TrashIcon, TvMinimalPlayIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateEvent from '@/components/create-event';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import React from 'react';
import type { User } from '@/types/user';


export interface Meeting {
  id: string;
  name: string;
  date: string;
  time: string;
  invitedUsers: User[];
  organizerId: string;
  isPrivate: boolean;
}

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

export async function fetchActiveMeetings() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}meetings/active`, {
    method: 'GET',
    credentials: 'include',
  });
  if(!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || 'Failed to fetch meetings');
  }
  return res.json();
}

function RouteComponent() {
  function parseMeetingTime(meeting: Meeting, now: number) {
    const time = Date.parse(meeting.date + 'T' + meeting.time);
    if(Math.abs(time - now) < 1000 * 60) {
      return "Starting now";
    }
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

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({ 
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

  const [open, setOpen] = React.useState(false);
  const [editMeetingId, setEditMeetingId] = React.useState<string | null>(null);
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
                  <Button onClick={() => { setEditMeetingId(null); setOpen(true); }}>Create Event</Button>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        }
      </div>
      <CreateEvent
        open={open} 
        setOpen={setOpen} 
        editMeetingId={editMeetingId} 
      />
    </>

  )
}
