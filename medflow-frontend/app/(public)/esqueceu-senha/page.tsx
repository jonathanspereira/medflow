import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Informe seu e-mail para receber o link de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="recoveryEmail">E-mail</Label>
              <Input
                id="recoveryEmail"
                name="recoveryEmail"
                type="email"
                placeholder="medico@clinica.com"
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Enviar link de recuperação
            </Button>
          </form>
          <div className="mt-3 text-center">
            <Link className="text-primary text-xs hover:underline" href="/login">
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
