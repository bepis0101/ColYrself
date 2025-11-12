import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import type { TimeLike } from 'fs';

interface Meeting {
  id: string;
  date: string;
  time: string;
  invitedIds: string[];
  isPrivate: boolean;
}

export const Route = createFileRoute('/dashboard')({
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
    <div>
      {
        isLoading || !data || data.length === 0 ? (
          <p>No active meetings.</p>
        ) : data.map((meeting) => (
          <div key={meeting.id}>
            <h2>Meeting ID: {meeting.id}</h2>
          </div>
        ))
      }
    </div>
  )
}
