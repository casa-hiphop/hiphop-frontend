import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth"
import { User } from "lucide-react"

type Props = {
  collapsed?: boolean
}

export default function UserDropdownTrigger({ collapsed = false }: Props) {
  const { user } = useAuth()

  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
        <AvatarFallback className="rounded-lg bg-[var(--primary)] text-[var(--background)] text-[1.2rem] pb-[3px] hover:bg-[var(--primary)]/90">
          <User />
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user?.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user?.email}
          </span>
        </div>
      )}
    </>
  )
}