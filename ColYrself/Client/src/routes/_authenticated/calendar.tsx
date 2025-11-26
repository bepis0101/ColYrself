import Calendar31 from '@/components/calendar-31'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <div>
    <Calendar31 events={[]}>  
    </Calendar31>
  </div>
)
}
