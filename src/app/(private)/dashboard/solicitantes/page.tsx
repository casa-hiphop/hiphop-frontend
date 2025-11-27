"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Pencil, Trash2, Mail, Phone, Building2 } from "lucide-react"

type Solicitante = {
  id: number
  nome: string
  email: string
  telefone: string
  unidade: string
  cargo: string
  emprestimosAtivos: number
  totalEmprestimos: number
}

export default function SolicitantesPage() {
  const [currentPage, setCurrentPage] = useState("Solicitantes")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    unidade: "",
    cargo: "",
  })

  const [solicitantes, setSolicitantes] = useState<Solicitante[]>([
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@empresa.com",
      telefone: "(11) 98765-4321",
      unidade: "Unidade São Paulo",
      cargo: "Engenheiro",
      emprestimosAtivos: 2,
      totalEmprestimos: 15,
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@empresa.com",
      telefone: "(11) 91234-5678",
      unidade: "Unidade Rio de Janeiro",
      cargo: "Técnica",
      emprestimosAtivos: 1,
      totalEmprestimos: 8,
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro.costa@empresa.com",
      telefone: "(11) 99876-5432",
      unidade: "Unidade São Paulo",
      cargo: "Supervisor",
      emprestimosAtivos: 0,
      totalEmprestimos: 22,
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      email: "ana.oliveira@empresa.com",
      telefone: "(21) 98765-1234",
      unidade: "Unidade Rio de Janeiro",
      cargo: "Coordenadora",
      emprestimosAtivos: 3,
      totalEmprestimos: 31,
    },
    {
      id: 5,
      nome: "Carlos Pereira",
      email: "carlos.pereira@empresa.com",
      telefone: "(11) 97654-3210",
      unidade: "Unidade Belo Horizonte",
      cargo: "Operador",
      emprestimosAtivos: 1,
      totalEmprestimos: 12,
    },
  ])

  const filteredSolicitantes = solicitantes.filter(
    (s) =>
      s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.unidade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setSolicitantes(solicitantes.map((s) => (s.id === editingId ? { ...s, ...formData } : s)))
    } else {
      const newSolicitante: Solicitante = {
        id: Math.max(...solicitantes.map((s) => s.id)) + 1,
        ...formData,
        emprestimosAtivos: 0,
        totalEmprestimos: 0,
      }
      setSolicitantes([...solicitantes, newSolicitante])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (solicitante: Solicitante) => {
    setEditingId(solicitante.id)
    setFormData({
      nome: solicitante.nome,
      email: solicitante.email,
      telefone: solicitante.telefone,
      unidade: solicitante.unidade,
      cargo: solicitante.cargo,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este solicitante?")) {
      setSolicitantes(solicitantes.filter((s) => s.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      unidade: "",
      cargo: "",
    })
    setEditingId(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Solicitantes</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie os solicitantes cadastrados no sistema</p>
              </div>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  console.log("[v0] Dialog state changing to:", open)
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Solicitante
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Editar Solicitante" : "Novo Solicitante"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Digite o nome completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@empresa.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unidade">Unidade</Label>
                      <Input
                        id="unidade"
                        value={formData.unidade}
                        onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                        placeholder="Ex: Unidade São Paulo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        placeholder="Ex: Engenheiro"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        {editingId ? "Salvar Alterações" : "Cadastrar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search Bar */}
            <Card className="p-4 bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, email ou unidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Table */}
            <Card className="bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Solicitante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Unidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Cargo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Empréstimos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredSolicitantes.map((solicitante) => (
                      <tr key={solicitante.id} className="hover:bg-muted">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                              {solicitante.nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground">{solicitante.nome}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {solicitante.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {solicitante.telefone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {solicitante.unidade}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/15 text-primary">
                            {solicitante.cargo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          <div className="flex flex-col">
                            <span className="font-semibold text-primary">{solicitante.emprestimosAtivos} ativos</span>
                            <span className="text-muted-foreground text-xs">{solicitante.totalEmprestimos} total</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(solicitante)}
                              className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(solicitante.id)}
                              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredSolicitantes.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">Nenhum solicitante encontrado</div>
                )}
              </div>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 bg-card">
                <div className="text-sm text-muted-foreground">Total de Solicitantes</div>
                <div className="text-2xl font-bold text-foreground mt-1">{solicitantes.length}</div>
              </Card>
              <Card className="p-4 bg-card">
                <div className="text-sm text-muted-foreground">Com Empréstimos Ativos</div>
                <div className="text-2xl font-bold text-primary mt-1">
                  {solicitantes.filter((s) => s.emprestimosAtivos > 0).length}
                </div>
              </Card>
              <Card className="p-4 bg-card">
                <div className="text-sm text-muted-foreground">Total de Empréstimos</div>
                <div className="text-2xl font-bold text-foreground mt-1">
                  {solicitantes.reduce((acc, s) => acc + s.totalEmprestimos, 0)}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
