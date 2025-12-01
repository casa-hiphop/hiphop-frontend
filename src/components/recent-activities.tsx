"use client"

import { Card } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle, UserPlus } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "return",
    message: "Furadeira devolvida",
    time: "12:30",
    icon: CheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    type: "new",
    message: "Novo solicitante cadastrado",
    time: "11:15",
    icon: UserPlus,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    type: "warning",
    message: "Atraso na devolução detectado",
    time: "10:45",
    icon: AlertCircle,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    type: "return",
    message: "Martelo devolvido",
    time: "09:20",
    icon: CheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 5,
    type: "new",
    message: "Nova ferramenta cadastrada",
    time: "08:50",
    icon: Clock,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export function RecentActivities() {
  return (
    <Card className="p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Atividades Recentes</h3>
        <p className="text-sm text-muted-foreground mt-1">Últimas movimentações</p>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
