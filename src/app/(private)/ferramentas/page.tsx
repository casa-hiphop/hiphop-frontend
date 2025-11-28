'use client'

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Wrench, Save, Camera, Plus, Search, Pencil, Trash2 } from "lucide-react"

interface Ferramenta {
  id: number
  nome: string
  categoria: string
  descricao: string
  quantidade: number
  dataAquisicao: string
  imagem?: string
}

export default function ToolRegisterComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    quantidade: 1,
    dataAquisicao: new Date().toISOString().substring(0, 10),
  })
  const [imagem, setImagem] = useState<File | null>(null)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' }>({ text: '', type: 'info' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([
    {
      id: 1,
      nome: "Furadeira de Impacto",
      categoria: "Elétrica",
      descricao: "Furadeira 500W, marca Bosch",
      quantidade: 3,
      dataAquisicao: "2024-01-15",
    },
    {
      id: 2,
      nome: "Serra Circular",
      categoria: "Elétrica",
      descricao: "Serra 1200W, lâmina 180mm",
      quantidade: 2,
      dataAquisicao: "2024-02-20",
    },
    {
      id: 3,
      nome: "Martelo",
      categoria: "Manual",
      descricao: "Martelo unha 500g, cabo fibra",
      quantidade: 5,
      dataAquisicao: "2024-03-10",
    },
  ])

  const filteredFerramentas = ferramentas.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.categoria || formData.quantidade <= 0) {
      setMessage({ text: 'Por favor, preencha todos os campos obrigatórios.', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setMessage({ text: 'Enviando dados da ferramenta...', type: 'info' })
    
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setFerramentas(ferramentas.map((f) => (f.id === editingId ? { ...f, ...formData } : f)))
        setMessage({ text: `Ferramenta "${formData.nome}" atualizada com sucesso!`, type: 'success' })
      } else {
        const newFerramenta: Ferramenta = {
          id: Math.max(...ferramentas.map((f) => f.id)) + 1,
          ...formData,
        }
        setFerramentas([...ferramentas, newFerramenta])
        setMessage({ text: `Ferramenta "${formData.nome}" cadastrada com sucesso!`, type: 'success' })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
      setMessage({ text: 'Falha ao cadastrar. Verifique a conexão.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (ferramenta: Ferramenta) => {
    setEditingId(ferramenta.id)
    setFormData({
      nome: ferramenta.nome,
      categoria: ferramenta.categoria,
      descricao: ferramenta.descricao,
      quantidade: ferramenta.quantidade,
      dataAquisicao: ferramenta.dataAquisicao,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta ferramenta?")) {
      setFerramentas(ferramentas.filter((f) => f.id !== id))
      setMessage({ text: "Ferramenta excluída com sucesso!", type: 'success' })
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      categoria: "",
      descricao: "",
      quantidade: 1,
      dataAquisicao: new Date().toISOString().substring(0, 10),
    })
    setImagem(null)
    setEditingId(null)
    setMessage({ text: '', type: 'info' })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0])
    }
  }

  const messageStyles = {
    success: 'bg-green-100 text-green-800 border-green-400',
    error: 'bg-red-100 text-red-800 border-red-400',
    info: 'bg-blue-100 text-blue-800 border-blue-400',
  }

  return (
    <div className="flex bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Ferramentas</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie o cadastro de ferramentas no sistema</p>
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
                    Nova Ferramenta
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Editar Ferramenta" : "Nova Ferramenta"}</DialogTitle>
                  </DialogHeader>
                  
                  {message.text && (
                    <div className={`p-4 rounded-lg border-l-4 ${messageStyles[message.type]}`}>
                      <p className="font-medium">{message.text}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome da Ferramenta *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder="Ex: Furadeira de Impacto"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="categoria">Categoria *</Label>
                        <Input
                          id="categoria"
                          value={formData.categoria}
                          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                          placeholder="Ex: Elétrica, Manual..."
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="descricao">Descrição Detalhada</Label>
                        <Textarea
                          id="descricao"
                          value={formData.descricao}
                          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                          placeholder="Inclua modelo, voltagem, estado..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantidade">Quantidade *</Label>
                          <Input
                            id="quantidade"
                            type="number"
                            min="1"
                            value={formData.quantidade}
                            onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="dataAquisicao">Data de Aquisição</Label>
                          <Input
                            id="dataAquisicao"
                            type="date"
                            value={formData.dataAquisicao}
                            onChange={(e) => setFormData({ ...formData, dataAquisicao: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="imagem">Foto da Ferramenta</Label>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-shrink-0">
                            <Camera className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <Input
                            id="imagem"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="flex-1"
                          />
                        </div>
                        {imagem && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Arquivo selecionado: <span className="font-semibold">{imagem.name}</span>
                          </p>
                        )}
                      </div>
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
                      <Button 
                        type="submit" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting 
                          ? "Salvando..." 
                          : editingId 
                            ? "Salvar Alterações" 
                            : "Cadastrar Ferramenta"
                        }
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
                  placeholder="Buscar por nome, categoria ou descrição..."
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
                        Ferramenta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Data Aquisição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredFerramentas.map((ferramenta) => (
                      <tr key={ferramenta.id} className="hover:bg-muted">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              <Wrench className="w-4 h-4" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground">{ferramenta.nome}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/15 text-primary">
                            {ferramenta.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-foreground max-w-xs truncate" title={ferramenta.descricao}>
                            {ferramenta.descricao || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-foreground">
                            {ferramenta.quantidade}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {new Date(ferramenta.dataAquisicao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(ferramenta)}
                              className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(ferramenta.id)}
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

                {filteredFerramentas.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchTerm ? "Nenhuma ferramenta encontrada" : "Nenhuma ferramenta cadastrada"}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}