'use client'

import * as React from "react"
import {
  Home,
  LucideProps,
  ToolCase,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarFooterContent } from "./footer.sidebar"
import SidebarContentContent from "./content-sidebar"
import SidebarHeaderHeader from "./header-sidebar"

export interface IDrawerOption {
  title: string,
  url: string,
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
}

export const menus: IDrawerOption[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Solicitantes",
    url: "/dashboard/solicitantes",
    icon: Home,
  },
  {
    title: "Ferramentas",
    url: "/tool-register",
    icon: ToolCase,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-0">
        <SidebarHeaderHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarContentContent />
      </SidebarContent>
      <SidebarFooter>
        {isMobile && (
          <SidebarFooterContent />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
