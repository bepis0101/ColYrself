import * as React from "react";
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'

import {
  CircleUser,
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

function TopMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="w-[180px] hidden md:flex">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block">Col Yrself</span>
          </a>
        </div>

        <div className="flex-1 flex justify-center">
          <NavigationMenu className="flex-1 max-w-screen-lg">
            <NavigationMenuList className="w-full justify-center gap-8">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/dashboard"
                  className={navigationMenuTriggerStyle()}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="http://github.com/bepis0101/ColYrself"
                  className={navigationMenuTriggerStyle()}
                >
                  Contribute
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
                  className="relative h-8 w-8 rounded-full cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://placehold.co/100x100/A0A0A0/FFFFFF?text=${user.username[0].toUpperCase()}`}
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
            <Button className="cursor-pointer" onClick={() => navigate({to: '/Auth/Login'})}>Log in</Button>
            <Button className="cursor-pointer" variant="outline" onClick={() => navigate({to: '/Auth/SignUp'})}>Sign up</Button>
          </div>
        )}
      </div>
    </header>
  );
}
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <TopMenu />
      <Outlet />
    </>
  )
}
