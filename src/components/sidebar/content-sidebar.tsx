'use client'

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"
import React, { useEffect } from "react"
import { menus } from "."
import { usePathname } from "next/navigation"

export default function SidebarContentContent() {
  const { open, openMobile, setOpen, setOpenMobile, isMobile } = useSidebar()

  const pathname = usePathname()
  const sanitizedPathname = React.useMemo(() => pathname.split("?")[0].split("#")[0], [pathname])

  useEffect(() => {
    if (open) setOpen(open)
    if (openMobile) setOpenMobile(openMobile)
  }, [open, openMobile, setOpen, setOpenMobile, isMobile])

  return (
    <>
      <SidebarGroup className="flex flex-col gap-2 pt-0">
        <SidebarMenu style={{ paddingInline: open ? '4px' : '0px' }}>
          {menus.map((item) => {
            const isSelected = item.url === sanitizedPathname

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} className="flex items-center">
                  <SidebarMenuButton
                    size={(open || isMobile) ? 'lg' : 'default'}
                    tooltip={item.title}
                    className={`${isSelected ? 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15 pl-6 font-semibold' : 'pl-4 transition-all'} cursor-pointer`}
                  >
                    {item.icon && <item.icon className={`${isSelected && 'text-[var(--primary)]'}`} />}
                    <span className={`${isSelected && 'text-[var(--primary)]'}`}>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}