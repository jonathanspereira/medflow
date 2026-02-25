import { headers } from "next/headers";

export type AppSession = {
  userId: string;
  organizationId: string;
};

export async function getSession(): Promise<AppSession | null> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("x-user-id");
  const organizationId = requestHeaders.get("x-organization-id");

  if (!userId || !organizationId) {
    return null;
  }

  return { userId, organizationId };
}

export async function requireSession(): Promise<AppSession> {
  const session = await getSession();

  if (!session) {
    throw new Error("Sessão inválida ou ausente.");
  }

  return session;
}
