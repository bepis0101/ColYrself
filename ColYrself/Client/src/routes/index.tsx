import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth();
  return <div>Hello {auth.user?.username || 'Guest'}!</div>
}
