import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NovaSolicitacaoPage() {
  return (
    <section className="space-y-4">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nova solicitação</CardTitle>
          <CardDescription>
            Preencha os dados básicos para registrar uma nova solicitação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3">
            <div className="space-y-1">
              <Label htmlFor="patientName">Paciente</Label>
              <Input id="patientName" placeholder="Nome do paciente" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="examName">Exame</Label>
              <Input id="examName" placeholder="Ex.: Ressonância magnética" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="requestingPhysician">Médico solicitante</Label>
              <Input id="requestingPhysician" placeholder="Nome do médico" />
            </div>
            <Button className="w-fit" type="button">Salvar (em desenvolvimento)</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
