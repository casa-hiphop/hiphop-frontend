"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export default function FerramentasPage() {
  const [currentPage, setCurrentPage] = useState("Ferramentas")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Cadastro de Ferramentas</h1>
            <p className="text-sm text-muted-foreground">Em breve: CRUD de ferramentas.</p>
            <Card className="p-6 bg-card">
              <div className="text-muted-foreground">Página placeholder para ferramentas.</div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
