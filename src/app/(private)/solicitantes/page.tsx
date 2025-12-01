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
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Eye,
  Loader2,
} from "lucide-react";
import { api } from "@/api";
import { useToast } from "@/hooks/toast";
import type { IRequester } from "@/api/requesters";
import { formatTelefone } from "@/utils/masks";

export default function SolicitantesPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingRequester, setViewingRequester] = useState<IRequester | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [requesters, setRequesters] = useState<IRequester[]>([]);

  useEffect(() => {
    loadRequesters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRequesters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.requesters.getAll();
      setRequesters(response.requesters || []);
    } catch (error) {
      console.error("Erro ao carregar solicitantes:", error);
      showToast("error", {
        title: "Erro ao carregar solicitantes",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequesters = requesters.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação do telefone
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      showToast("error", {
        title: "Telefone inválido",
        description: "O telefone deve ter 10 ou 11 dígitos",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Remove a máscara antes de enviar
      const phoneWithoutMask = formData.phone.replace(/\D/g, "");

      if (editingId) {
        await api.requesters.update(editingId, {
          ...formData,
          phone: phoneWithoutMask,
        });
        showToast("success", {
          title: "Solicitante atualizado com sucesso!",
        });
      } else {
        await api.requesters.create({
          ...formData,
          phone: phoneWithoutMask,
        });
        showToast("success", {
          title: "Solicitante cadastrado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      await loadRequesters();
    } catch (error) {
      console.error("Erro ao salvar solicitante:", error);
      showToast("error", {
        title: "Erro ao salvar solicitante",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (requester: IRequester) => {
    setEditingId(requester.id);
    // Aplica a máscara no telefone ao editar
    const formattedPhone = formatTelefone(requester.phone);
    setFormData({
      name: requester.name,
      email: requester.email,
      phone: formattedPhone,
    });
    setIsDialogOpen(true);
  };

  const handleView = async (id: string) => {
    try {
      const response = await api.requesters.getById(id);
      setViewingRequester(response.requester);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Erro ao carregar solicitante:", error);
      showToast("error", {
        title: "Erro ao carregar solicitante",
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
      await api.requesters.delete(deletingId);
      showToast("success", {
        title: "Solicitante excluído com sucesso!",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await loadRequesters();
    } catch (error) {
      console.error("Erro ao excluir solicitante:", error);
      showToast("error", {
        title: "Erro ao excluir solicitante",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
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
                  Solicitantes
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie os solicitantes cadastrados no sistema
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
                    Novo Solicitante
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Editar Solicitante" : "Novo Solicitante"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Digite o nome completo"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="email@exemplo.com"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const formatted = formatTelefone(e.target.value);
                          // Limita a 15 caracteres (formato: (00) 00000-0000)
                          const maxLength = 15;
                          const limited = formatted.slice(0, maxLength);
                          setFormData({ ...formData, phone: limited });
                        }}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        required
                        disabled={submitting}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Formato: (00) 00000-0000 ou (00) 0000-0000
                      </p>
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
                  placeholder="Buscar por nome, email ou telefone..."
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
                          Solicitante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Contato
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
                      {filteredRequesters.map((requester) => (
                        <tr key={requester.id} className="hover:bg-muted">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                {requester.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">
                                  {requester.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              {requester.email}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              {requester.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(requester.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(requester.id)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(requester)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(requester.id)}
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

                  {filteredRequesters.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchTerm
                        ? "Nenhum solicitante encontrado com os filtros aplicados"
                        : "Nenhum solicitante cadastrado"}
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
            <DialogTitle>Detalhes do Solicitante</DialogTitle>
          </DialogHeader>
          {viewingRequester && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xl">
                  {viewingRequester.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {viewingRequester.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">E-mail</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {viewingRequester.email}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {viewingRequester.phone}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data de Cadastro
                  </Label>
                  <p className="text-foreground mt-1">
                    {formatDate(viewingRequester.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Última Atualização
                  </Label>
                  <p className="text-foreground mt-1">
                    {formatDate(viewingRequester.updated_at)}
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
              Tem certeza que deseja excluir este solicitante? Esta ação não
              pode ser desfeita.
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
