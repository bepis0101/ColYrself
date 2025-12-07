import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'

import {
  CircleUser,
  ExternalLink,
  LogOut,
  Settings,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from '@/components/ui/spinner';

function TopMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur 
    supports-[backdrop-filter]:bg-background/60 justify-between">
      <div className="container flex h-14 max-w-screen items-center px-4">
        <div className="w-[180px] hidden md:flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block">Col Yrself</span>
          </Link>
          
        </div>

        <div className="flex-1 flex justify-center">
          <NavigationMenu className="flex-1 max-w-screen-lg">
            <NavigationMenuList className="w-full justify-center gap-8">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to='/dashboard'>
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to='/calendar'>
                    Calendar
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <a
                    href="http://github.com/bepis0101/ColYrself"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center gap-1.5">
                      Contribute
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {user && (
          <div className="w-[180px] flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://placehold.co/100x100/2196F3/FFFFFF?text=${user.username[0].toUpperCase()}`}
                      alt={`${user.username[0]}`}
                    />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!user && (
          <div className="w-[180px] flex items-center justify-end gap-2">
            <Button onClick={() => navigate({to: '/auth/login'})}>Log in</Button>
            <Button variant="outline" onClick={() => navigate({to: '/auth/signup'})}>Sign up</Button>
          </div>
        )}
      </div>
    </header>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  pendingComponent: () => (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <TopMenu />
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    </div>
  ),
})

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <TopMenu />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}