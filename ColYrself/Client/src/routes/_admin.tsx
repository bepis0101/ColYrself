import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/AuthContext'
import { createFileRoute, Outlet, redirect, type ParsedLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ context, location }: { context: any, location: ParsedLocation}) => {
    if(!context.auth.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href
        }
      })
    }
    if(!context.auth.user.isAdmin) {
      throw redirect({
        to: '/',
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

  return (
    <>
    { !user && isLoading ? (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    ) : (
      <Outlet />
    ) }
    </>
  )
}
