"use client"

import { LayoutDashboard, Wrench, Building2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { id: "Ferramentas", label: "Cadastro de Ferramentas", icon: Wrench, url: "/dashboard/ferramentas" },
  { id: "Unidades", label: "Cadastro de Unidades", icon: Building2, url: "/dashboard/unidades" },
  { id: "Solicitantes", label: "Cadastro de Solicitantes", icon: Users, url: "/dashboard/solicitantes" },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Wrench className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">Ferramentoteca</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url || currentPage === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onPageChange(item.id)
                    router.push(item.url)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
