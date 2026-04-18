"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  CheckCircle,
  AlertCircle,
  Package,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { api } from "@/api"
import type { IBorrow } from "@/api/borrows"
import { useToast } from "@/hooks/toast"

type ActivityRow = {
  id: string
  sortKey: number
  message: string
  timeLabel: string
  icon: typeof Package
  iconColor: string
  bgColor: string
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function formatActivityWhen(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR })
}

function buildActivities(
  borrows: IBorrow[],
  toolNames: Map<string, string>,
  requesterNames: Map<string, string>,
): ActivityRow[] {
  const today = startOfDay(new Date())
  const rows: ActivityRow[] = []

  for (const b of borrows) {
    const toolName = toolNames.get(b.tool_id) ?? "Ferramenta"
    const reqName = requesterNames.get(b.requester_id) ?? "Solicitante"

    rows.push({
      id: `${b.id}-emprestimo`,
      sortKey: new Date(b.created_at).getTime(),
      message: `Empréstimo registrado: ${toolName} — ${reqName}`,
      timeLabel: formatActivityWhen(b.created_at),
      icon: Package,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    })

    if (b.returned_at) {
      const ref =
        typeof b.returned_at === "string" ? b.returned_at : String(b.returned_at)
      rows.push({
        id: `${b.id}-devolucao`,
        sortKey: new Date(ref).getTime(),
        message: `Devolução registrada: ${toolName}`,
        timeLabel: formatActivityWhen(ref),
        icon: CheckCircle,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
      })
    } else {
      const returnDay = startOfDay(new Date(b.return_date))
      if (returnDay < today) {
        rows.push({
          id: `${b.id}-atraso`,
          sortKey: new Date(b.updated_at ?? b.return_date).getTime(),
          message: `Em atraso: ${toolName} (prevista para ${format(new Date(b.return_date), "dd/MM/yyyy", { locale: ptBR })})`,
          timeLabel: formatActivityWhen(b.updated_at ?? b.return_date),
          icon: AlertCircle,
          iconColor: "text-orange-600",
          bgColor: "bg-orange-50",
        })
      }
    }
  }

  return rows.sort((a, b) => b.sortKey - a.sortKey).slice(0, 12)
}

export function RecentActivities() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityRow[]>([])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [borrowsRes, tools, requestersRes] = await Promise.all([
        api.borrows.getAll(),
        api.tools.getAll(),
        api.requesters.getAll(),
      ])

      const borrows = borrowsRes?.borrows ?? []
      const toolNames = new Map(
        (Array.isArray(tools) ? tools : []).map((t) => [t.id, t.name]),
      )
      const requesterNames = new Map(
        (requestersRes?.requesters ?? []).map((r) => [r.id, r.name]),
      )

      setActivities(buildActivities(borrows, toolNames, requesterNames))
    } catch (error) {
      console.error("Erro ao carregar atividades:", error)
      showToast("error", {
        title: "Erro ao carregar atividades recentes",
        description:
          error instanceof Error ? error.message : "Tente atualizar a página.",
      })
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <Card className="p-6 h-full flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  return (
    <Card className="p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Atividades Recentes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Empréstimos, devoluções e pendências em atraso
        </p>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nenhuma atividade para exibir ainda.
          </p>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timeLabel}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
