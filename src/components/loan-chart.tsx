"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Loader2 } from "lucide-react"
import { api } from "@/api"
import type { IBorrow } from "@/api/borrows"
import { useToast } from "@/hooks/toast"

const MONTH_LABELS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const

function yearMonthFromIso(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

/** Últimos 6 meses (incluindo o mês atual), do mais antigo ao mais recente. */
function getLastSixMonthBuckets() {
  const now = new Date()
  const buckets: { key: string; label: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = MONTH_LABELS_PT[d.getMonth()]
    buckets.push({ key, label })
  }
  return buckets
}

function aggregateBorrowsByMonth(borrows: IBorrow[]) {
  const buckets = getLastSixMonthBuckets()
  const counts = new Map<string, number>()
  for (const b of buckets) {
    counts.set(b.key, 0)
  }
  for (const borrow of borrows) {
    const ym = yearMonthFromIso(borrow.created_at)
    if (ym && counts.has(ym)) {
      counts.set(ym, (counts.get(ym) ?? 0) + 1)
    }
  }
  return buckets.map((b) => ({
    month: b.label,
    emprestimos: counts.get(b.key) ?? 0,
  }))
}

export function LoanChart() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState<{ month: string; emprestimos: number }[]>(
    () => aggregateBorrowsByMonth([]),
  )

  const hasData = useMemo(() => series.some((p) => p.emprestimos > 0), [series])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const { borrows } = await api.borrows.getAll()
      setSeries(aggregateBorrowsByMonth(borrows ?? []))
    } catch (error) {
      console.error("Erro ao carregar empréstimos para o gráfico:", error)
      showToast("error", {
        title: "Erro ao carregar histórico de empréstimos",
        description:
          error instanceof Error ? error.message : "Tente atualizar a página.",
      })
      setSeries(aggregateBorrowsByMonth([]))
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center min-h-[380px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Empréstimos nos Últimos 6 Meses
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {hasData
            ? "Quantidade de empréstimos registrados por mês (data de cadastro)"
            : "Nenhum empréstimo registrado neste período — os valores aparecem quando houver cadastros"}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: "12px" }} />
          <YAxis
            allowDecimals={false}
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number | string) => [value, "Empréstimos"]}
          />
          <Line
            type="monotone"
            dataKey="emprestimos"
            stroke="#1E3A8A"
            strokeWidth={3}
            dot={{ fill: "#1E3A8A", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
