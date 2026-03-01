import { getPatientsListData } from "@/app/(private)/_lib/private-data";
import { Plus } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PacientesPage() {
  const patients = await getPatientsListData();

  return (
    <section className="space-y-3">
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" type="button">
              <Plus />
              Novo paciente
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
                <Label htmlFor="new-patient-name">Nome</Label>
                <Input id="new-patient-name" placeholder="Nome do paciente" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-patient-email">Email</Label>
                <Input id="new-patient-email" placeholder="paciente@email.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-patient-phone">Telefone</Label>
                <Input id="new-patient-phone" placeholder="(11) 99999-9999" />
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
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Convênio</TableHead>
              <TableHead>Data de nascimento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Última solicitação</TableHead>
              <TableHead>Solicitações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length ? (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.convenio}</TableCell>
                  <TableCell>{patient.patientBirthDate}</TableCell>
                  <TableCell>{patient.patientPhone}</TableCell>
                  <TableCell>{patient.patientEmail}</TableCell>
                  <TableCell>{patient.lastRequestDate}</TableCell>
                  <TableCell>{patient.requestsCount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
