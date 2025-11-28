"use client"

import { Wrench, Building2, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    title: "Ferramentas",
    icon: Wrench,
    total: 156,
    available: 98,
    borrowed: 58,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-900",
  },
  {
    title: "Unidades",
    icon: Building2,
    total: 12,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-900",
  },
  {
    title: "Solicitantes",
    icon: Users,
    total: 248,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-900",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mb-3">{stat.total}</p>

                {stat.available !== undefined && stat.borrowed !== undefined && (
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Disponíveis: </span>
                      <span className="font-semibold text-chart-2">{stat.available}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Emprestadas: </span>
                      <span className="font-semibold text-chart-1">{stat.borrowed}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
