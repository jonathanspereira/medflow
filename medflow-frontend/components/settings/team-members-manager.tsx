"use client";

import { useMemo, useState } from "react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Administrador" | "Solicitante" | "Usuário";
};

function roleToValue(role: TeamMember["role"]) {
  if (role === "Administrador") {
    return "administrador";
  }

  if (role === "Solicitante") {
    return "solicitante";
  }

  return "usuario";
}

function valueToRole(value: string): TeamMember["role"] {
  if (value === "administrador") {
    return "Administrador";
  }

  if (value === "solicitante") {
    return "Solicitante";
  }

  return "Usuário";
}

export function TeamMembersManager({ teamMembers }: { teamMembers: TeamMember[] }) {
  const initialRoles = useMemo(
    () => Object.fromEntries(teamMembers.map((member) => [member.id, roleToValue(member.role)])),
    [teamMembers]
  );

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(initialRoles);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" type="button">Adicionar usuário</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Adicionar usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Preencha os dados para convidar um novo usuário para a equipe.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="new-team-member-name">Nome</Label>
                <Input id="new-team-member-name" placeholder="Nome do usuário" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-team-member-email">Email</Label>
                <Input id="new-team-member-email" type="email" placeholder="usuario@clinica.com" />
              </div>
              <div className="space-y-1">
                <Label>Função</Label>
                <Select defaultValue="atendente">
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="solicitante">Solicitante</SelectItem>
                    <SelectItem value="usuario">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Adicionar (em desenvolvimento)</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="ring-border overflow-hidden rounded-lg ring-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.length ? (
              teamMembers.map((member) => {
                const isEditing = editingMemberId === member.id;
                const selectedRoleValue = selectedRoles[member.id] ?? roleToValue(member.role);

                return (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{valueToRole(selectedRoleValue)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          disabled={!isEditing}
                          onValueChange={(value) =>
                            setSelectedRoles((current) => ({
                              ...current,
                              [member.id]: value,
                            }))
                          }
                          value={selectedRoleValue}
                        >
                          <SelectTrigger size="sm" className="w-36">
                            <SelectValue placeholder="Função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrador">Administrador</SelectItem>
                            <SelectItem value="solicitante">Solicitante</SelectItem>
                            <SelectItem value="usuario">Usuário</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (isEditing) {
                              setEditingMemberId(null);
                              return;
                            }

                            setEditingMemberId(member.id);
                          }}
                        >
                          {isEditing ? "Salvar função" : "Editar função"}
                        </Button>
                        <Button size="sm" type="button" variant="destructive">
                          Remover
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
