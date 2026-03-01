import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type ProfileData = {
  userName: string;
  userEmail: string;
  userId: string;
  organizationName: string;
  organizationId: string;
};

async function getProfileData(): Promise<ProfileData> {
  const session = await getSession();

  if (!session) {
    return {
      userName: "N/D",
      userEmail: "N/D",
      userId: "N/D",
      organizationName: "N/D",
      organizationId: "N/D",
    };
  }

  const fallbackData: ProfileData = {
    userName: "Usuário",
    userEmail: "N/D",
    userId: session.userId,
    organizationName: "Organização",
    organizationId: session.organizationId,
  };

  if (!process.env.DATABASE_URL) {
    return fallbackData;
  }

  try {
    const [user, organization] = await Promise.all([
      prisma.user.findFirst({
        where: {
          id: session.userId,
          organizationId: session.organizationId,
        },
        select: {
          name: true,
          email: true,
        },
      }),
      prisma.organization.findFirst({
        where: {
          id: session.organizationId,
        },
        select: {
          name: true,
        },
      }),
    ]);

    return {
      userName: user?.name ?? fallbackData.userName,
      userEmail: user?.email ?? fallbackData.userEmail,
      userId: fallbackData.userId,
      organizationName: organization?.name ?? fallbackData.organizationName,
      organizationId: fallbackData.organizationId,
    };
  } catch {
    return fallbackData;
  }
}

export default async function PerfilPage() {
  const profile = await getProfileData();

  return (
    <section className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados do usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <p><strong>Nome:</strong> {profile.userName}</p>
            <p><strong>Email:</strong> {profile.userEmail}</p>
            <p><strong>ID:</strong> {profile.userId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados da organização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <p><strong>Clínica:</strong> {profile.organizationName}</p>
            <p><strong>ID da organização:</strong> {profile.organizationId}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
