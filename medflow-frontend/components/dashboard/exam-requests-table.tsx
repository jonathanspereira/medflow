"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CircleAlert, Pencil, Plus, RefreshCcw, Trash2, X } from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  deleteExamRequestAction,
  updateExamRequestStatusAction,
} from "@/actions/exam-requests";
import type { ExamRequestRow } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function statusBadgeVariant(status: ExamRequestRow["status"]) {
  if (status === "AUTHORIZED") {
    return "default";
  }

  if (status === "REJECTED") {
    return "destructive";
  }

  if (status === "CANCELLED") {
    return "outline";
  }

  return "secondary";
}

function statusLabel(status: ExamRequestRow["status"]) {
  if (status === "PENDING") {
    return "Pendente";
  }

  if (status === "ANALYZING") {
    return "Em análise";
  }

  if (status === "AUTHORIZED") {
    return "Autorizada";
  }

  if (status === "REJECTED") {
    return "Negada";
  }

  return "Cancelado";
}

export function ExamRequestsTable({
  data,
  patientOptions,
}: {
  data: ExamRequestRow[];
  patientOptions: string[];
}) {
  const examOptionsByType = {
    procedimento: ["Laser CO2", "Laser Fracionado", "Depilação a Laser"],
    exame: ["Ressonância Magnética", "Tomografia", "Ultrassom", "Raio-X"],
  } as const;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [detailsRow, setDetailsRow] = useState<ExamRequestRow | null>(null);
  const [updateRow, setUpdateRow] = useState<ExamRequestRow | null>(null);
  const [nextStatus, setNextStatus] = useState<ExamRequestRow["status"]>("PENDING");
  const [newRequestPatient, setNewRequestPatient] = useState("");
  const [newRequestType, setNewRequestType] = useState<"procedimento" | "exame">(
    "exame"
  );
  const [newRequestExam, setNewRequestExam] = useState(
    examOptionsByType.exame[0]
  );

  const filteredData = useMemo(() => {
    function normalizeText(value: string) {
      return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    const normalizedFilter = normalizeText(nameFilter.trim());

    if (!normalizedFilter) {
      return data;
    }

    return data.filter((item) =>
      normalizeText(item.patientName).includes(normalizedFilter)
    );
  }, [data, nameFilter]);

  const handleDelete = useCallback(
    (examRequestId: string) => {
      const confirmed = window.confirm(
        "Tem certeza que deseja deletar esta solicitação?"
      );

      if (!confirmed) {
        return;
      }

      setActionError(null);
      setActionSuccess(null);
      setUpdatingId(examRequestId);

      startTransition(async () => {
        try {
          await deleteExamRequestAction(examRequestId);
          router.refresh();
        } catch (error) {
          setActionError(
            error instanceof Error ? error.message : "Falha ao deletar solicitação."
          );
        } finally {
          setUpdatingId(null);
        }
      });
    },
    [router]
  );

  const handleStatusUpdate = useCallback(() => {
    if (!updateRow) {
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja atualizar o status desta solicitação?"
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);
    setUpdatingId(updateRow.id);

    startTransition(async () => {
      try {
        await updateExamRequestStatusAction(updateRow.id, nextStatus);
        setUpdateRow(null);
        setActionSuccess("Status atualizado com sucesso.");
        router.refresh();
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Falha ao atualizar status."
        );
      } finally {
        setUpdatingId(null);
      }
    });
  }, [nextStatus, router, updateRow]);

  const columns = useMemo<ColumnDef<ExamRequestRow>[]>(
    () => [
      {
        accessorKey: "patientName",
        header: "Paciente",
      },
      {
        accessorKey: "convenio",
        header: "Convênio",
      },
      {
        accessorKey: "requestingPhysician",
        header: "Médico solicitante",
      },
      {
        accessorKey: "examName",
        header: "Exame",
      },
      {
        accessorKey: "requestType",
        header: "Tipo",
        cell: ({ row }) =>
          row.original.requestType === "procedimento"
            ? "Procedimento (laser)"
            : "Exame (imagem)",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant(row.original.status)}>
            {statusLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: "requestDate",
        header: "Data da solicitação",
      },
      {
        accessorKey: "protocol",
        header: "Protocolo",
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const isRowPending = isPending && updatingId === row.original.id;

          return (
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                type="button"
                variant="ghost"
                title="Informações"
                onClick={() => setDetailsRow(row.original)}
              >
                <CircleAlert />
              </Button>
              <Button
                size="icon"
                type="button"
                variant="ghost"
                title="Atualizar"
                onClick={() => {
                  setUpdateRow(row.original);
                  setNextStatus(row.original.status);
                }}
              >
                <RefreshCcw />
              </Button>
              <Button
                size="icon"
                type="button"
                variant="ghost"
                title="Editar"
                onClick={() => setActionError("Edição em desenvolvimento.")}
              >
                <Pencil />
              </Button>
              <Button
                size="icon"
                type="button"
                variant="destructive"
                title="Deletar"
                disabled={isRowPending}
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, isPending, updatingId]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-2">
      {actionError ? (
        <p className="text-destructive text-xs font-medium">{actionError}</p>
      ) : null}
      {actionSuccess ? (
        <p className="text-emerald-600 text-xs font-medium">{actionSuccess}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-xs">
          <Input
            className="pe-8"
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="Buscar por nome do paciente"
            value={nameFilter}
          />
          {nameFilter ? (
            <Button
              size="icon-xs"
              type="button"
              variant="ghost"
              className="absolute inset-e-1 top-1/2 -translate-y-1/2"
              onClick={() => setNameFilter("")}
              title="Limpar busca"
            >
              <X />
            </Button>
          ) : null}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" type="button">
              <Plus />
              Nova solicitação
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Nova solicitação</AlertDialogTitle>
              <AlertDialogDescription>
                Preencha os dados básicos para registrar uma nova solicitação.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="new-request-patient">Paciente</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="new-request-patient"
                    list="registered-patients-list"
                    placeholder="Buscar paciente cadastrado"
                    value={newRequestPatient}
                    onChange={(event) => setNewRequestPatient(event.target.value)}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon-sm"
                        type="button"
                        variant="outline"
                        title="Novo paciente"
                      >
                        <Plus />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Novo paciente</AlertDialogTitle>
                        <AlertDialogDescription>
                          Preencha os dados básicos para cadastrar um paciente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="grid gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="new-patient-name-inline">Nome</Label>
                          <Input id="new-patient-name-inline" placeholder="Nome do paciente" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-patient-birth-inline">Data de nascimento</Label>
                          <Input id="new-patient-birth-inline" type="date" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-patient-convenio-inline">Convênio</Label>
                          <Input id="new-patient-convenio-inline" placeholder="Nome do convênio" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-patient-email-inline">Email</Label>
                          <Input id="new-patient-email-inline" placeholder="paciente@email.com" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-patient-phone-inline">Telefone</Label>
                          <Input id="new-patient-phone-inline" placeholder="(11) 99999-9999" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Salvar (em desenvolvimento)</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <datalist id="registered-patients-list">
                  {patientOptions.map((patient) => (
                    <option key={patient} value={patient} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-1">
                <Label>Tipo</Label>
                <Select
                  onValueChange={(value: "procedimento" | "exame") => {
                    setNewRequestType(value);
                    setNewRequestExam(examOptionsByType[value][0]);
                  }}
                  value={newRequestType}
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="procedimento">Procedimento (laser)</SelectItem>
                    <SelectItem value="exame">Exame (imagem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Exame</Label>
                <Select onValueChange={setNewRequestExam} value={newRequestExam}>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Selecione o exame" />
                  </SelectTrigger>
                  <SelectContent>
                    {examOptionsByType[newRequestType].map((exam) => (
                      <SelectItem key={exam} value={exam}>
                        {exam}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-request-physician">Médico solicitante</Label>
                <Input id="new-request-physician" placeholder="Nome do médico" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Salvar (em desenvolvimento)</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="ring-border overflow-hidden rounded-md ring-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-muted-foreground text-center" colSpan={9}>
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(detailsRow)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsRow(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Informações da solicitação</AlertDialogTitle>
            <AlertDialogDescription>
              {detailsRow ? (
                <span className="grid gap-1 py-2 text-xs">
                  <span><strong>Criado:</strong> {detailsRow.createdByName}</span>
                  <span><strong>Status Whatsapp:</strong> {detailsRow.deliveryStatus}</span>
                  <span><strong>Status Email:</strong> Não enviado</span>
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>Fechar</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(updateRow)}
        onOpenChange={(open) => {
          if (!open) {
            setUpdateRow(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar solicitação</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o novo status para atualizar a solicitação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>Novo status</Label>
            <Select
              onValueChange={(value: ExamRequestRow["status"]) => setNextStatus(value)}
              value={nextStatus}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="ANALYZING">Em análise</SelectItem>
                <SelectItem value="AUTHORIZED">Autorizada</SelectItem>
                <SelectItem value="REJECTED">Negada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              {nextStatus === "AUTHORIZED"
                ? "Ao autorizar, considerar envio para WhatsApp e Email."
                : "Para este status, normalmente não há envio automático."}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={!updateRow || isPending}
              onClick={handleStatusUpdate}
            >
              Salvar atualização
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
