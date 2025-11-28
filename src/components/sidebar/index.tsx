'use client'

import * as React from "react"
import {
  Home,
  LucideProps,
  ToolCase,
  SquaresUnite
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
    url: "/solicitantes",
    icon: Home,
  },
  {
    title: "Ferramentas",
    url: "/ferramentas",
    icon: ToolCase,
  },
  {
    title: "Unidades",
    url: "/unidades",
    icon: SquaresUnite,
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
