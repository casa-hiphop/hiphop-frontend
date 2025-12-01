"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Wrench,
} from "lucide-react";
import { api } from "@/api";
import { useToast } from "@/hooks/toast";
import type { ITool } from "@/api/tools";

export default function FerramentasPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingTool, setViewingTool] = useState<ITool | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    quantity: 0,
  });

  const [tools, setTools] = useState<ITool[]>([]);

  useEffect(() => {
    loadTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.tools.getAll();
      setTools(response || []);
    } catch (error) {
      console.error("Erro ao carregar ferramentas:", error);
      showToast("error", {
        title: "Erro ao carregar ferramentas",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.name || !formData.brand || formData.quantity < 0) {
      showToast("error", {
        title: "Campos inválidos",
        description: "Preencha todos os campos obrigatórios corretamente",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await api.tools.update(editingId, formData);
        showToast("success", {
          title: "Ferramenta atualizada com sucesso!",
        });
      } else {
        await api.tools.create(formData);
        showToast("success", {
          title: "Ferramenta cadastrada com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      await loadTools();
    } catch (error) {
      console.error("Erro ao salvar ferramenta:", error);
      showToast("error", {
        title: "Erro ao salvar ferramenta",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tool: ITool) => {
    setEditingId(tool.id);
    setFormData({
      name: tool.name,
      description: tool.description,
      brand: tool.brand,
      quantity: tool.quantity,
    });
    setIsDialogOpen(true);
  };

  const handleView = async (id: string) => {
    try {
      const response = await api.tools.getById(id);
      setViewingTool(response);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Erro ao carregar ferramenta:", error);
      showToast("error", {
        title: "Erro ao carregar ferramenta",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      await api.tools.delete(deletingId);
      showToast("success", {
        title: "Ferramenta excluída com sucesso!",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await loadTools();
    } catch (error) {
      console.error("Erro ao excluir ferramenta:", error);
      showToast("error", {
        title: "Erro ao excluir ferramenta",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      brand: "",
      quantity: 0,
    });
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Ferramentas
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie o cadastro de ferramentas no sistema
                </p>
              </div>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Ferramenta
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Editar Ferramenta" : "Nova Ferramenta"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome da Ferramenta *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Ex: Furadeira de Impacto"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Marca *</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        placeholder="Ex: Bosch, Makita..."
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Inclua modelo, voltagem, estado..."
                        rows={3}
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                        disabled={submitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : editingId ? (
                          "Salvar Alterações"
                        ) : (
                          "Cadastrar"
                        )}
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
                  placeholder="Buscar por nome, descrição ou marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Table */}
            <Card className="bg-card">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Carregando...
                  </span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Ferramenta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Marca
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Data de Cadastro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {filteredTools.map((tool) => (
                        <tr key={tool.id} className="hover:bg-muted">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                <Wrench className="w-4 h-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">
                                  {tool.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/15 text-primary">
                              {tool.brand}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className="text-sm text-foreground max-w-xs truncate"
                              title={tool.description}
                            >
                              {tool.description || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-foreground">
                              {tool.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(tool.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(tool.id)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(tool)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(tool.id)}
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredTools.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchTerm
                        ? "Nenhuma ferramenta encontrada com os filtros aplicados"
                        : "Nenhuma ferramenta cadastrada"}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Ferramenta</DialogTitle>
          </DialogHeader>
          {viewingTool && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Wrench className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {viewingTool.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Marca</Label>
                  <p className="text-foreground mt-1">{viewingTool.brand}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="text-foreground mt-1">
                    {viewingTool.description || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantidade</Label>
                  <p className="text-foreground mt-1 font-semibold">
                    {viewingTool.quantity}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data de Cadastro
                  </Label>
                  <p className="text-foreground mt-1">
                    {formatDate(viewingTool.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Última Atualização
                  </Label>
                  <p className="text-foreground mt-1">
                    {formatDate(viewingTool.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ferramenta? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
