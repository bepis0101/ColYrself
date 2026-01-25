import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react";
import type { MouseEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { FieldDescription } from "./ui/field"

export interface ILoginProps {
  handleGoogleLogin?: MouseEventHandler;
  handleNormalLogin: (username: string, password: string) => void;
  isPending?: boolean;
}

export function LoginForm({
  className,
  handleGoogleLogin,
  handleNormalLogin,
  isPending,
  ...props
}: React.ComponentProps<"div"> & ILoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNormalLogin(username, password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username" 
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    {password.length > 0 && (<button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>)}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <Spinner />}
                  {isPending ? 'Loading...' : 'Login'}
                </Button>
              </div>
              <FieldDescription className="text-center">
                
                  Don&apos;t have an account?{" "}
                  <Link to="/auth/signup">Sign up</Link>
                
              </FieldDescription>
            </div>
          </form>
          {/* <div className="mt-6 flex flex-col gap-4">
            <div className="relative text-center text-sm">
              <div className="absolute inset-0 top-1/2 border-t border-border" />
              <span className="relative bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleLogin}
              disabled={isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>
          </div> */}
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  )
}
