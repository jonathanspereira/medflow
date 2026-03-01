import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function signInAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/login?error=missing-email");
  }

  const cookieStore = await cookies();
  cookieStore.set("medauth_org_id", "demo-org", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("medauth_user_id", email.toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "missing-email";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Entrar no MedAuth</CardTitle>
          <CardDescription>
            Acesse sua clínica para gerenciar autorizações e mensagens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInAction} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="medico@clinica.com" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            {hasError ? (
              <p className="text-destructive text-xs">Informe um e-mail válido para continuar.</p>
            ) : null}
            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </form>
          <div className="mt-3 text-center">
            <Link className="text-primary text-xs hover:underline" href="/esqueceu-senha">
              Esqueceu sua senha?
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
