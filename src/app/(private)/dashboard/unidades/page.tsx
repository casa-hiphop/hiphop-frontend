"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Building2, Search, MapPin } from "lucide-react"
import { useState } from "react"

type Unidade = {
  id: number
  nome: string
  codigo: string
  cidade: string
  endereco: string
}

export default function UnidadesPage() {
  const [currentPage, setCurrentPage] = useState("Unidades")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    cidade: "",
    endereco: "",
  })

  const [unidades, setUnidades] = useState<Unidade[]>([
    { id: 1, nome: "Unidade São Paulo", codigo: "SP01", cidade: "São Paulo", endereco: "Av. Paulista, 1000" },
    { id: 2, nome: "Unidade Rio de Janeiro", codigo: "RJ01", cidade: "Rio de Janeiro", endereco: "Rua Atlântica, 200" },
    { id: 3, nome: "Unidade Belo Horizonte", codigo: "BH01", cidade: "Belo Horizonte", endereco: "Av. Afonso Pena, 50" },
  ])

  const filteredUnidades = unidades.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cidade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setUnidades(unidades.map((u) => (u.id === editingId ? { ...u, ...formData } : u)))
    } else {
      const newUnidade: Unidade = {
        id: Math.max(...unidades.map((u) => u.id)) + 1,
        ...formData,
      }
      setUnidades([...unidades, newUnidade])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (unidade: Unidade) => {
    setEditingId(unidade.id)
    setFormData({
      nome: unidade.nome,
      codigo: unidade.codigo,
      cidade: unidade.cidade,
      endereco: unidade.endereco,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta unidade?")) {
      setUnidades(unidades.filter((u) => u.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", codigo: "", cidade: "", endereco: "" })
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
                <h1 className="text-2xl font-bold text-foreground">Cadastro de Unidades</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie as unidades do sistema</p>
              </div>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Unidade
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Editar Unidade" : "Nova Unidade"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome da Unidade</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Unidade São Paulo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigo">Código</Label>
                      <Input
                        id="codigo"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        placeholder="Ex: SP01"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        placeholder="Ex: São Paulo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        placeholder="Rua/Avenida, número"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm() }}>
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
                  placeholder="Buscar por nome, código ou cidade..."
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unidade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cidade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Endereço</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredUnidades.map((unidade) => (
                      <tr key={unidade.id} className="hover:bg-muted">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-medium text-foreground">{unidade.nome}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{unidade.codigo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {unidade.cidade}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{unidade.endereco}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(unidade)}
                              className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(unidade.id)}
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

                {filteredUnidades.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">Nenhuma unidade encontrada</div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
