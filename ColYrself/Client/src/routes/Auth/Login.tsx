import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginForm } from "@/components/login-form";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types/user';

export const Route = createFileRoute('/Auth/Login')({
  component: Login,
})

export default function Login() {
  const navigate = useNavigate();
  async function fetchLogin(username: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    if(!res.ok) {
      const errorData = await res.text();
      toast.error('Login failed: ' + errorData);
      throw new Error(errorData || 'Login failed');
    }
    return res.json();
  }
  const auth = useAuth()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => fetchLogin(username, password),
    onSuccess: (data) => {
      toast.success('Login successful!');
      const user: User = data.userObj as User;
      auth.login(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate({ to: '/' });
    },
  });

  function handleGoogleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  function handleLogin(username: string, password: string) {
    mutation.mutate({ username, password });
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