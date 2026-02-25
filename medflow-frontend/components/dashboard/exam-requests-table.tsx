"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateExamRequestStatusAction } from "@/actions/exam-requests";
import type { ExamRequestRow } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_OPTIONS: ExamRequestRow["status"][] = [
  "PENDING",
  "ANALYZING",
  "AUTHORIZED",
  "REJECTED",
];

function statusBadgeVariant(status: ExamRequestRow["status"]) {
  if (status === "AUTHORIZED") {
    return "default";
  }

  if (status === "REJECTED") {
    return "destructive";
  }

  return "secondary";
}

export function ExamRequestsTable({ data }: { data: ExamRequestRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = useCallback(
    (examRequestId: string, nextStatus: ExamRequestRow["status"]) => {
      setActionError(null);
      setUpdatingId(examRequestId);

      startTransition(async () => {
        try {
          await updateExamRequestStatusAction(examRequestId, nextStatus);
          router.refresh();
        } catch (error) {
          setActionError(
            error instanceof Error ? error.message : "Falha ao atualizar o status."
          );
        } finally {
          setUpdatingId(null);
        }
      });
    },
    [router]
  );

  const columns = useMemo<ColumnDef<ExamRequestRow>[]>(
    () => [
      {
        accessorKey: "protocol",
        header: "Protocolo",
      },
      {
        accessorKey: "patientName",
        header: "Paciente",
      },
      {
        accessorKey: "patientPhone",
        header: "Telefone",
      },
      {
        accessorKey: "requestingPhysician",
        header: "Médico solicitante",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "deliveryStatus",
        header: "Entrega",
      },
      {
        accessorKey: "createdAt",
        header: "Criado em",
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <select
            className="border-border bg-background h-7 rounded-md border px-2"
            disabled={isPending && updatingId === row.original.id}
            onChange={(event) =>
              handleStatusChange(row.original.id, event.target.value as ExamRequestRow["status"])
            }
            value={row.original.status}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ),
      },
    ],
    [handleStatusChange, isPending, updatingId]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="space-y-2">
      {actionError ? (
        <p className="text-destructive text-xs font-medium">{actionError}</p>
      ) : null}

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
              <TableCell className="text-muted-foreground text-center" colSpan={8}>
                Nenhuma solicitação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
