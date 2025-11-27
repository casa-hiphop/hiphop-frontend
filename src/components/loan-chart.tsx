"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", emprestimos: 45 },
  { month: "Fev", emprestimos: 52 },
  { month: "Mar", emprestimos: 48 },
  { month: "Abr", emprestimos: 61 },
  { month: "Mai", emprestimos: 55 },
  { month: "Jun", emprestimos: 67 },
]

export function LoanChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Empréstimos nos Últimos 6 Meses</h3>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe a evolução dos empréstimos</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: "12px" }} />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
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
