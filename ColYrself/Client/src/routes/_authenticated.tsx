import { createFileRoute, Outlet, redirect, type ParsedLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }: { context: any, location: ParsedLocation}) => {
    if(!context.auth.user) {
      throw redirect({
        to: '/Auth/Login',
        search: {
          redirect: location.href
        }
      })
    }
  },
  component: () => <Outlet />,
})
