import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4">
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Acesso não autorizado</h1>
        <p className="text-muted-foreground text-sm">
          Sua sessão não está ativa. Faça login para acessar a área privada do MedAuth.
        </p>
        <Button asChild>
          <Link href="/login">Ir para login</Link>
        </Button>
      </div>
    </main>
  );
}
