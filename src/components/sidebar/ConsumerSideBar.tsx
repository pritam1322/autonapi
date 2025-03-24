"use client";

import { 
  BookOpen, Calendar, ChartNoAxesCombined, ChevronsLeftRight, ChevronsUpDown, 
  CodeIcon, HomeIcon, KeyRound 
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, 
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "@/trpc-client/client";

// Define Consumer Menu
const consumerItems = [
  { title: "Dashboard", url: "/consumer/dashboard", icon: HomeIcon },
  { title: "Discover APIs", url: "/consumer/discoverapi", icon: CodeIcon },
  { title: "Subscribed APIs", url: "/aiTools", icon: Calendar },
  { title: "Analytics", url: "/emailJobApplication", icon: ChartNoAxesCombined },
  { title: "API Keys", url: "/projects", icon: KeyRound },
  { title: "Documentation", url: "/stats", icon: BookOpen },
];

// Define Provider Menu
const providerItems = [
  { title: "Dashboard", url: "/provider/upload", icon: HomeIcon },
  { title: "Documentation", url: "/provider/docs", icon: BookOpen },
];

export function ConsumerSidebar() {
    const { data: session } = useSession();
    const candidateName = session?.user?.name?.split(" ")[0] || "Username";
  

    const { data: user } = trpc.getuser.useQuery({ id : session?.user.id! });

    // Set menu based on role
    const menuItems = user?.role === "PROVIDER" ? providerItems : consumerItems;

    return (
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="min-h-10 text-md">
                  <SidebarMenuButton>
                    AutonAPI
                    <ChevronsLeftRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center">
                        <item.icon className="mr-2 w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="py-7">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {candidateName}
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <Link href="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
}
