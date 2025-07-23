'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"; // Assuming Radix styled separator
import { VideoIcon, BotIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardUserButton from "./dashboard-user-button";

const firstSection = [
  { icon: VideoIcon, label: 'Meetings', href: '/meetings' },
  { icon: BotIcon, label: 'Agents', href: '/agents' },
];

const secondSection = [
  { icon: StarIcon, label: 'Upgrade', href: '/upgrade' },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const renderMenuSection = (items: typeof firstSection) =>
    items.map((item) => {
      const isActive = pathname === item.href;

      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            className={cn(
              "h-10 px-3 flex items-center gap-3 rounded-md transition-all duration-200",
              "hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar/10",
              isActive &&
                "bg-gradient-to-r from-sidebar-accent/20 to-sidebar/20 border border-sidebar-accent/20"
            )}
            isActive={isActive}
          >
            <Link href={item.href} className="flex items-center w-full gap-3">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <SidebarHeader className="px-4 pt-4 pb-2">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" height={36} width={36} alt="FinAI Logo" />
          <span className="text-lg font-bold text-sidebar-accent-foreground">
            FinAI
          </span>
        </Link>
      </SidebarHeader>

      <Separator className="my-2 opacity-10" />

      {/* Main Content */}
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuSection(firstSection)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4 opacity-10" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuSection(secondSection)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 py-3 border-t border-border bg-background/5">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
