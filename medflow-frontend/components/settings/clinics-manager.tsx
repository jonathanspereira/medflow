"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ClinicTeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Administrador" | "Solicitante" | "Usuário";
};

type ClinicRow = {
  id: string;
  name: string;
  adminName: string;
  teamSize: number;
  teamMembers: ClinicTeamMember[];
};

export function ClinicsManager({ clinics }: { clinics: ClinicRow[] }) {
  const [selectedClinic, setSelectedClinic] = useState<ClinicRow | null>(null);

  return (
    <>
      <div className="ring-border overflow-hidden rounded-lg ring-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clínica</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead>Equipe</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.length ? (
              clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell>{clinic.name}</TableCell>
                  <TableCell>{clinic.adminName}</TableCell>
                  <TableCell>{clinic.teamSize} usuário(s)</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedClinic(clinic)}
                      >
                        Gerenciar equipe
                      </Button>
                      <Button size="sm" type="button" variant="destructive">
                        Remover clínica
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  Nenhuma clínica encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(selectedClinic)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedClinic(null);
          }
        }}
      >
        <AlertDialogContent className="w-[95vw] max-w-7xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Equipe da clínica {selectedClinic ? `• ${selectedClinic.name}` : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedClinic
                ? "Visualize os usuários vinculados e suas funções."
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

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
                {selectedClinic?.teamMembers.length ? (
                  selectedClinic.teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" type="button" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" type="button" variant="destructive">
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground text-center">
                      Nenhum usuário vinculado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <AlertDialogAction>Fechar</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
