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
  Building2,
  MapPin,
} from "lucide-react";
import { api } from "@/api";
import { useToast } from "@/hooks/toast";
import type { IUnit } from "@/api/units";
import { formatCEP } from "@/utils/masks";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function UnidadesPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingUnit, setViewingUnit] = useState<IUnit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cep: "",
    number: "",
  });
  const [addressData, setAddressData] = useState({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [units, setUnits] = useState<IUnit[]>([]);

  useEffect(() => {
    loadUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.units.getAll();
      setUnits(response.units || []);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      showToast("error", {
        title: "Erro ao carregar unidades",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setAddressData({
        street: "",
        neighborhood: "",
        city: "",
        state: "",
      });
      return;
    }

    try {
      setLoadingCep(true);
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        showToast("error", {
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado",
        });
        setAddressData({
          street: "",
          neighborhood: "",
          city: "",
          state: "",
        });
        return;
      }

      setAddressData({
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      });
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      showToast("error", {
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço",
      });
    } finally {
      setLoadingCep(false);
    }
  };

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (
      !formData.name ||
      !formData.description ||
      !formData.cep ||
      !formData.number
    ) {
      showToast("error", {
        title: "Campos inválidos",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      showToast("error", {
        title: "CEP inválido",
        description: "O CEP deve ter 8 dígitos",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await api.units.update(editingId, {
          ...formData,
          cep: cleanCep,
        });
        showToast("success", {
          title: "Unidade atualizada com sucesso!",
        });
      } else {
        await api.units.create({
          ...formData,
          cep: cleanCep,
        });
        showToast("success", {
          title: "Unidade cadastrada com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      await loadUnits();
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      showToast("error", {
        title: "Erro ao salvar unidade",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (unit: IUnit) => {
    setEditingId(unit.id);
    setFormData({
      name: unit.name,
      description: unit.description,
      cep: formatCEP(unit.cep),
      number: unit.number,
    });
    setAddressData({
      street: unit.street,
      neighborhood: unit.neighborhood,
      city: unit.city,
      state: unit.state,
    });
    setIsDialogOpen(true);
  };

  const handleView = async (id: string) => {
    try {
      const response = await api.units.getById(id);
      setViewingUnit(response.unit);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Erro ao carregar unidade:", error);
      showToast("error", {
        title: "Erro ao carregar unidade",
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
      await api.units.delete(deletingId);
      showToast("success", {
        title: "Unidade excluída com sucesso!",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await loadUnits();
    } catch (error) {
      console.error("Erro ao excluir unidade:", error);
      showToast("error", {
        title: "Erro ao excluir unidade",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      cep: "",
      number: "",
    });
    setAddressData({
      street: "",
      neighborhood: "",
      city: "",
      state: "",
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

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    const limited = formatted.slice(0, 9); // 00000-000
    setFormData({ ...formData, cep: limited });

    // Busca CEP quando tiver 8 dígitos
    const cleanCep = limited.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      searchCep(cleanCep);
    } else {
      setAddressData({
        street: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    }
  };

  return (
    <div className="flex bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Unidades</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie as unidades do sistema
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
                    Nova Unidade
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Editar Unidade" : "Nova Unidade"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome da Unidade *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Ex: Unidade São Paulo"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Descreva a unidade..."
                        rows={3}
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cep">CEP *</Label>
                        <div className="relative">
                          <Input
                            id="cep"
                            value={formData.cep}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            maxLength={9}
                            required
                            disabled={submitting}
                          />
                          {loadingCep && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          O endereço será preenchido automaticamente
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          value={formData.number}
                          onChange={(e) =>
                            setFormData({ ...formData, number: e.target.value })
                          }
                          placeholder="Ex: 1000"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    {/* Campos de endereço (read-only) */}
                    {(addressData.street ||
                      addressData.neighborhood ||
                      addressData.city ||
                      addressData.state) && (
                      <div className="space-y-3 p-4 bg-muted rounded-lg border">
                        <Label className="text-sm font-semibold">
                          Endereço (preenchido automaticamente)
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Rua
                            </Label>
                            <Input
                              value={addressData.street}
                              readOnly
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Bairro
                            </Label>
                            <Input
                              value={addressData.neighborhood}
                              readOnly
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Cidade
                            </Label>
                            <Input
                              value={addressData.city}
                              readOnly
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Estado
                            </Label>
                            <Input
                              value={addressData.state}
                              readOnly
                              className="bg-background"
                            />
                          </div>
                        </div>
                      </div>
                    )}

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
                  placeholder="Buscar por nome, descrição, cidade ou endereço..."
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
                          Unidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Endereço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Cidade/Estado
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
                      {filteredUnits.map((unit) => (
                        <tr key={unit.id} className="hover:bg-muted">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">
                                  {unit.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {unit.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-foreground">
                              <div className="font-medium">
                                {unit.street}, {unit.number}
                              </div>
                              <div className="text-muted-foreground">
                                {unit.neighborhood}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                CEP: {formatCEP(unit.cep)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {unit.city}/{unit.state}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(unit.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(unit.id)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(unit)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(unit.id)}
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

                  {filteredUnits.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchTerm
                        ? "Nenhuma unidade encontrada com os filtros aplicados"
                        : "Nenhuma unidade cadastrada"}
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
            <DialogTitle>Detalhes da Unidade</DialogTitle>
          </DialogHeader>
          {viewingUnit && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {viewingUnit.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="text-foreground mt-1">
                    {viewingUnit.description}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Endereço Completo
                  </Label>
                  <div className="text-foreground mt-1 space-y-1">
                    <p className="font-medium">
                      {viewingUnit.street}, {viewingUnit.number}
                    </p>
                    <p>{viewingUnit.neighborhood}</p>
                    <p>
                      {viewingUnit.city}/{viewingUnit.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {formatCEP(viewingUnit.cep)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data de Cadastro
                  </Label>
                  <p className="text-foreground mt-1">
                    {formatDate(viewingUnit.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Última Atualização
                  </Label>
                  <p className="text-foreground mt-1">
                    {formatDate(viewingUnit.updated_at)}
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
              Tem certeza que deseja excluir esta unidade? Esta ação não pode
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
