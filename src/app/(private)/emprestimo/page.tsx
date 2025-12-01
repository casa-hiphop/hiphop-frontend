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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  Wrench,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { api } from "@/api";
import { useToast } from "@/hooks/toast";
import type { IBorrow } from "@/api/borrows";
import type { ITool } from "@/api/tools";
import type { IUnit } from "@/api/units";
import type { IRequester } from "@/api/requesters";
import { Badge } from "@/components/ui/badge";

type FilterType = "all" | "pending" | "overdue" | "available-for-return";

export default function EmprestimoPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingBorrow, setViewingBorrow] = useState<IBorrow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tool_id: "",
    unit_id: "",
    requester_id: "",
    date: "",
    return_date: "",
  });

  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [tools, setTools] = useState<ITool[]>([]);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [requesters, setRequesters] = useState<IRequester[]>([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadBorrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      // Carregar dados para os selects
      const [toolsRes, unitsRes, requestersRes] = await Promise.all([
        api.tools.getAll(),
        api.units.getAll(),
        api.requesters.getAll(),
      ]);

      setTools(toolsRes || []);
      setUnits(unitsRes.units || []);
      setRequesters(requestersRes.requesters || []);

      await loadBorrows();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showToast("error", {
        title: "Erro ao carregar dados",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBorrows = async () => {
    try {
      setLoading(true);
      let response;

      switch (filter) {
        case "pending":
          response = await api.borrows.getPending();
          break;
        case "overdue":
          response = await api.borrows.getOverdue();
          break;
        case "available-for-return":
          response = await api.borrows.getAvailableForReturn();
          break;
        default:
          response = await api.borrows.getAll();
      }

      setBorrows(response.borrows || []);
    } catch (error) {
      console.error("Erro ao carregar empréstimos:", error);
      showToast("error", {
        title: "Erro ao carregar empréstimos",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBorrowStatus = (borrow: IBorrow) => {
    if (borrow.returned_at) {
      return {
        label: "Devolvido",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      };
    }

    const returnDate = new Date(borrow.return_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    returnDate.setHours(0, 0, 0, 0);

    if (returnDate < today) {
      return {
        label: "Em Atraso",
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle,
      };
    }

    return {
      label: "Pendente",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    };
  };

  const filteredBorrows = borrows.filter((b) => {
    const searchLower = searchTerm.toLowerCase();
    const toolName = tools.find((t) => t.id === b.tool_id)?.name || "";
    const requesterName =
      requesters.find((r) => r.id === b.requester_id)?.name || "";
    const unitName = units.find((u) => u.id === b.unit_id)?.name || "";

    return (
      toolName.toLowerCase().includes(searchLower) ||
      requesterName.toLowerCase().includes(searchLower) ||
      unitName.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.tool_id ||
      !formData.unit_id ||
      !formData.requester_id ||
      !formData.date ||
      !formData.return_date
    ) {
      showToast("error", {
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
      });
      return;
    }

    const borrowDate = new Date(formData.date);
    const returnDate = new Date(formData.return_date);

    if (returnDate < borrowDate) {
      showToast("error", {
        title: "Data inválida",
        description:
          "A data de devolução deve ser posterior à data de empréstimo",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await api.borrows.update(editingId, formData);
        showToast("success", {
          title: "Empréstimo atualizado com sucesso!",
        });
      } else {
        await api.borrows.create(formData);
        showToast("success", {
          title: "Empréstimo criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      await loadBorrows();
    } catch (error) {
      console.error("Erro ao salvar empréstimo:", error);
      showToast("error", {
        title: "Erro ao salvar empréstimo",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (borrow: IBorrow) => {
    setEditingId(borrow.id);
    setFormData({
      tool_id: borrow.tool_id,
      unit_id: borrow.unit_id,
      requester_id: borrow.requester_id,
      date: borrow.date.split("T")[0],
      return_date: borrow.return_date.split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleView = async (id: string) => {
    try {
      const response = await api.borrows.getById(id);
      setViewingBorrow(response.borrow);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Erro ao buscar empréstimo:", error);
      showToast("error", {
        title: "Erro ao buscar empréstimo",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await api.borrows.delete(deletingId);
      showToast("success", {
        title: "Empréstimo excluído com sucesso!",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await loadBorrows();
    } catch (error) {
      console.error("Erro ao excluir empréstimo:", error);
      showToast("error", {
        title: "Erro ao excluir empréstimo",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const handleReturn = async () => {
    if (!returningId) return;

    try {
      await api.borrows.returnBorrow(returningId);
      showToast("success", {
        title: "Empréstimo devolvido com sucesso!",
      });
      setIsReturnDialogOpen(false);
      setReturningId(null);
      await loadBorrows();
    } catch (error) {
      console.error("Erro ao devolver empréstimo:", error);
      showToast("error", {
        title: "Erro ao devolver empréstimo",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tool_id: "",
      unit_id: "",
      requester_id: "",
      date: "",
      return_date: "",
    });
    setEditingId(null);
  };

  const getToolName = (toolId: string) => {
    return (
      tools.find((t) => t.id === toolId)?.name || "Ferramenta não encontrada"
    );
  };

  const getRequesterName = (requesterId: string) => {
    return (
      requesters.find((r) => r.id === requesterId)?.name ||
      "Solicitante não encontrado"
    );
  };

  const getUnitName = (unitId: string) => {
    return units.find((u) => u.id === unitId)?.name || "Unidade não encontrada";
  };

  if (loading && borrows.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Empréstimos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os empréstimos de ferramentas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Empréstimo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Empréstimo" : "Novo Empréstimo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tool_id">Ferramenta *</Label>
                  <Select
                    value={formData.tool_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tool_id: value })
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ferramenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {tools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name} - {tool.brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_id">Unidade *</Label>
                  <Select
                    value={formData.unit_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unit_id: value })
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} - {unit.city}/{unit.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="requester_id">Solicitante *</Label>
                  <Select
                    value={formData.requester_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, requester_id: value })
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o solicitante" />
                    </SelectTrigger>
                    <SelectContent>
                      {requesters.map((requester) => (
                        <SelectItem key={requester.id} value={requester.id}>
                          {requester.name} - {requester.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data do Empréstimo *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return_date">Data de Devolução *</Label>
                  <Input
                    id="return_date"
                    type="date"
                    value={formData.return_date}
                    onChange={(e) =>
                      setFormData({ ...formData, return_date: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por ferramenta, solicitante ou unidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "overdue" ? "default" : "outline"}
            onClick={() => setFilter("overdue")}
            size="sm"
          >
            Em Atraso
          </Button>
          <Button
            variant={filter === "available-for-return" ? "default" : "outline"}
            onClick={() => setFilter("available-for-return")}
            size="sm"
          >
            Para Devolução
          </Button>
        </div>
      </div>

      {/* Lista de Empréstimos */}
      {filteredBorrows.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Nenhum empréstimo encontrado com os filtros aplicados"
              : "Nenhum empréstimo cadastrado"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBorrows.map((borrow) => {
            const status = getBorrowStatus(borrow);
            const StatusIcon = status.icon;

            return (
              <Card
                key={borrow.id}
                className="p-6 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        {getToolName(borrow.tool_id)}
                      </h3>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{getRequesterName(borrow.requester_id)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{getUnitName(borrow.unit_id)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Devolver até: {formatDate(borrow.return_date)}</span>
                  </div>
                  {borrow.returned_at && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        Devolvido em: {formatDate(borrow.returned_at)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(borrow.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    {!borrow.returned_at && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(borrow)}
                        className="flex-1"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(borrow.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {!borrow.returned_at && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setReturningId(borrow.id);
                        setIsReturnDialogOpen(true);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Devolver
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Empréstimo</DialogTitle>
          </DialogHeader>
          {viewingBorrow && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ferramenta</Label>
                  <p className="font-medium">
                    {getToolName(viewingBorrow.tool_id)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={getBorrowStatus(viewingBorrow).color}>
                      {getBorrowStatus(viewingBorrow).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Solicitante</Label>
                  <p className="font-medium">
                    {getRequesterName(viewingBorrow.requester_id)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Unidade</Label>
                  <p className="font-medium">
                    {getUnitName(viewingBorrow.unit_id)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data do Empréstimo
                  </Label>
                  <p className="font-medium">
                    {formatDate(viewingBorrow.date)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data de Devolução Prevista
                  </Label>
                  <p className="font-medium">
                    {formatDate(viewingBorrow.return_date)}
                  </p>
                </div>
                {viewingBorrow.returned_at && (
                  <div>
                    <Label className="text-muted-foreground">
                      Data de Devolução
                    </Label>
                    <p className="font-medium text-green-600">
                      {formatDate(viewingBorrow.returned_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Devolução */}
      <AlertDialog
        open={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Devolução</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja registrar a devolução deste empréstimo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReturningId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReturn}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Devolução
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Exclusão */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este empréstimo? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
