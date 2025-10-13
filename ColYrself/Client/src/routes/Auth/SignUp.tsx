import { SignupForm } from '@/components/signup-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { Register } from '@/types/user'
export const Route = createFileRoute('/Auth/SignUp')({
  component: RouteComponent,
})

function RouteComponent() {
  async function fetchSignup(
    email: string, 
    username: string, 
    password: string, 
    repeatPassword: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}account/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, repeatPassword }),
    });

    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  }

  const mutation = useMutation({
    mutationFn: ({email, username, password, repeatPassword} : Register) => 
      fetchSignup(email, username, password, repeatPassword),
    onSuccess: (data) => {
      
    }
  })

  function handleSignUp(
    email: string, 
    username: string, 
    password: string, 
    repeatPassword: string) {
    if (password !== repeatPassword) {
      
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm
          handleSignUp={handleSignUp}
          handleGoogleSignUp={() => {}}
          isPending={mutation.isPending}
        ></SignupForm>
      </div>
    </div>
  )
}
