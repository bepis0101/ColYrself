import Calendar31 from '@/components/calendar-31'
import { createFileRoute } from '@tanstack/react-router'
import type { Meeting } from './dashboard'
import { useQuery } from '@tanstack/react-query';
import { fetchActiveMeetings } from './dashboard';

export const Route = createFileRoute('/_authenticated/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  
  const { data, isLoading } = useQuery<Meeting[]>({
    queryKey: ['allActiveMeetings'],
    queryFn: fetchActiveMeetings,
  });

  return (
  <div className="flex flex-row justify-center items-center p-6 ">
    {
      !isLoading && <Calendar31 meetings={data || []} />  
    }
  </div>
)
}
