import Calendar31 from '@/components/calendar-31'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { Meeting } from './dashboard'
export const Route = createFileRoute('/_authenticated/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient();
  const meetings = queryClient.getQueryData<Meeting[]>(['activeMeetings']);
  
  return (
  <div className="flex flex-row justify-center items-center p-6 ">
    <Calendar31 meetings={meetings || []}>  
    </Calendar31>
  </div>
)
}
