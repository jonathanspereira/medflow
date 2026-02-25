export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold">Acesso não autorizado</h1>
        <p className="text-muted-foreground text-sm">
          Defina os cookies de sessão medauth_org_id e medauth_user_id para acessar o
          dashboard multi-tenant.
        </p>
      </div>
    </main>
  );
}
