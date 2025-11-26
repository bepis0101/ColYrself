import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { Toaster } from 'sonner'
import { useAuth, type AuthContextType } from './contexts/AuthContext';

const router = createRouter({ 
  routeTree,
  context: {
    auth: null as AuthContextType | null
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  const auth = useAuth();
  return (
    <>
      <RouterProvider router={router} context={{ auth }}/>
      <Toaster position='bottom-center' />
    </>
  )
}