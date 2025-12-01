import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/AuthContext'
import { createFileRoute, Navigate, Outlet, redirect, type ParsedLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }: { context: any, location: ParsedLocation}) => {
    if(!context.auth.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href
        }
      })
    }
  },
  component: () => <AuthenticatedLayout />,
})

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="p-4"><Spinner /></div>
  }

  if (!user) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
