"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserDropdownTrigger from "../interface/user-dropdown/trigger";
import UserDropdownContent from "../interface/user-dropdown/content";
import { useAuth } from "@/contexts/auth";

export function SiteHeader() {
  const { user } = useAuth();

  const { open, isMobile } = useSidebar();

  return (
    <header
      className={`sticky top-0 z-50 bg-background flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear`}
    >
      <div
        className={`w-full flex justify-between items-center gap-${
          open ? "4" : "2"
        } pl-${isMobile ? "2" : open ? "4" : "2"} pr-2`}
      >
        {(!open || isMobile) && (
          <SidebarTrigger size={isMobile ? "lg" : "icon"} />
        )}
        <div
          className={`w-full flex gap-2 overflow-auto whitespace-nowrap`}
          style={{ flex: 1 }}
        ></div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <UserDropdownTrigger collapsed />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel>{user?.user?.name}</DropdownMenuLabel>
                <UserDropdownContent />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
