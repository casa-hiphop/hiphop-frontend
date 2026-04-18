"use client"

import { useCallback, useEffect, useState } from "react"
import { Wrench, Building2, Users, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { api } from "@/api"
import { useToast } from "@/hooks/toast"

type DashboardStats = {
  tools: {
    typesCount: number
    totalStock: number
    available: number
    borrowed: number
  }
  units: number
  requesters: number
}

export function StatsCards() {
  const { showToast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [tools, unitsRes, requestersRes, borrowsRes] = await Promise.all([
        api.tools.getAll(),
        api.units.getAll(),
        api.requesters.getAll(),
        api.borrows.getAll(),
      ])

      const toolsList = Array.isArray(tools) ? tools : []
      const totalStock = toolsList.reduce(
        (sum, t) => sum + (Number(t.quantity) || 0),
        0,
      )
      const borrows = borrowsRes?.borrows ?? []
      const borrowed = borrows.filter((b) => b.returned_at == null).length
      const available = Math.max(0, totalStock - borrowed)

      setStats({
        tools: {
          typesCount: toolsList.length,
          totalStock,
          available,
          borrowed,
        },
        units: unitsRes?.units?.length ?? 0,
        requesters: requestersRes?.requesters?.length ?? 0,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      showToast("error", {
        title: "Erro ao carregar números do painel",
        description:
          error instanceof Error ? error.message : "Tente atualizar a página.",
      })
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="p-5 flex items-center justify-center min-h-[140px]"
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const cards = [
    {
      title: "Ferramentas",
      icon: Wrench,
      total: stats.tools.totalStock,
      subtitle:
        stats.tools.typesCount === 1
          ? "1 tipo cadastrado"
          : `${stats.tools.typesCount} tipos cadastrados`,
      available: stats.tools.available,
      borrowed: stats.tools.borrowed,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-900",
    },
    {
      title: "Unidades",
      icon: Building2,
      total: stats.units,
      subtitle: "unidades cadastradas",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-900",
    },
    {
      title: "Solicitantes",
      icon: Users,
      total: stats.requesters,
      subtitle: "solicitantes cadastrados",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-900",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                  {stat.total}
                </p>
                {"subtitle" in stat && stat.subtitle && (
                  <p className="text-xs text-muted-foreground mb-3">{stat.subtitle}</p>
                )}

                {stat.available !== undefined && stat.borrowed !== undefined && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Disponíveis: </span>
                      <span className="font-semibold text-chart-2 tabular-nums">
                        {stat.available}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Emprestadas: </span>
                      <span className="font-semibold text-chart-1 tabular-nums">
                        {stat.borrowed}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-xl shrink-0 ${stat.iconBg}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
