import { useMutation } from '@tanstack/react-query';
import { LoginForm } from "@/components/login-form";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Auth/Login')({
  component: Login,
})

export default function Login() {
  async function fetchLogin(email: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  }

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => fetchLogin(email, password),
    onSuccess: (data) => {
      
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  function handleGoogleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  function handleLogin(email: string, password: string) {
    mutation.mutate({ email, password });
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm 
          handleGoogleLogin={handleGoogleClick}
          handleNormalLogin={handleLogin}
          isPending={mutation.isPending}
        />
      </div>
    </div>
  );
}