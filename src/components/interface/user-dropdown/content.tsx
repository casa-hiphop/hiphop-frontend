import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth"
import { LogOutIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function UserDropdownContent() {
  const { logout } = useAuth()

  const { setTheme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onSelect={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          Tema
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={logout}>
        <LogOutIcon />
        Sair
      </DropdownMenuItem>
    </>
  )
}