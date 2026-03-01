import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClinicsManager } from "@/components/settings/clinics-manager";
import { TeamMembersManager } from "@/components/settings/team-members-manager";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type ConfigSearchParams = {
  tab?: string;
  channel?: string;
  template?: string;
};

const tabs = [
  { id: "geral", label: "Geral" },
  { id: "integracoes", label: "Integrações" },
  { id: "notificacoes", label: "Notificações" },
  { id: "seguranca", label: "Segurança" },
  { id: "equipe", label: "Equipe" },
  { id: "clinicas", label: "Clínicas" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const notificationChannels = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
] as const;

const notificationTemplates = [
  { id: "authorized", label: "Autorizado" },
  { id: "rejected", label: "Negado" },
] as const;

type NotificationChannelId = (typeof notificationChannels)[number]["id"];
type NotificationTemplateId = (typeof notificationTemplates)[number]["id"];

type TeamMember = {
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
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: "Administrador" | "Solicitante" | "Usuário";
  }>;
};

function isTabId(value: string): value is TabId {
  return tabs.some((tab) => tab.id === value);
}

function resolveTab(tab?: string): TabId {
  if (tab && isTabId(tab)) {
    return tab;
  }

  return "geral";
}

function isNotificationChannelId(value: string): value is NotificationChannelId {
  return notificationChannels.some((channel) => channel.id === value);
}

function resolveNotificationChannel(channel?: string): NotificationChannelId {
  if (channel && isNotificationChannelId(channel)) {
    return channel;
  }

  return "whatsapp";
}

function isNotificationTemplateId(value: string): value is NotificationTemplateId {
  return notificationTemplates.some((template) => template.id === value);
}

function resolveNotificationTemplate(template?: string): NotificationTemplateId {
  if (template && isNotificationTemplateId(template)) {
    return template;
  }

  return "authorized";
}

function templatePlaceholder(
  channel: NotificationChannelId,
  template: NotificationTemplateId
) {
  if (channel === "whatsapp" && template === "authorized") {
    return "Olá {{paciente}}, sua solicitação {{protocolo}} foi autorizada.";
  }

  if (channel === "whatsapp" && template === "rejected") {
    return "Olá {{paciente}}, sua solicitação {{protocolo}} foi negada.";
  }

  if (channel === "email" && template === "authorized") {
    return "Prezado(a) {{paciente}}, informamos que sua solicitação {{protocolo}} foi autorizada.";
  }

  return "Prezado(a) {{paciente}}, informamos que sua solicitação {{protocolo}} foi negada.";
}

function TabContent({
  activeTab,
  activeNotificationChannel,
  activeNotificationTemplate,
  teamMembers,
  clinics,
}: {
  activeTab: TabId;
  activeNotificationChannel: NotificationChannelId;
  activeNotificationTemplate: NotificationTemplateId;
  teamMembers: TeamMember[];
  clinics: ClinicRow[];
}) {
  if (activeTab === "integracoes") {
    return (
      <div className="space-y-2 text-xs">
        <p className="font-medium">Integrações</p>
        <p className="text-muted-foreground">Configure conexões com n8n, WAHA e webhooks.</p>
      </div>
    );
  }

  if (activeTab === "notificacoes") {
    const selectedChannel = notificationChannels.find(
      (item) => item.id === activeNotificationChannel
    );
    const selectedTemplate = notificationTemplates.find(
      (item) => item.id === activeNotificationTemplate
    );

    return (
      <div className="space-y-4">
        <div className="space-y-2 text-xs">
          <p className="font-medium">Templates de mensagens</p>
          <p className="text-muted-foreground">
            Escolha um canal e um tipo de evento para editar um template por vez.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">Canal</p>
          <div className="bg-card ring-border inline-flex items-center gap-2 rounded-lg p-1 ring-1">
            {notificationChannels.map((channel) => (
              <Button
                key={channel.id}
                asChild
                size="sm"
                variant={activeNotificationChannel === channel.id ? "secondary" : "ghost"}
              >
                <Link
                  href={`/configuracao?tab=notificacoes&channel=${channel.id}&template=${activeNotificationTemplate}`}
                >
                  {channel.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">Template</p>
          <div className="bg-card ring-border inline-flex items-center gap-2 rounded-lg p-1 ring-1">
            {notificationTemplates.map((template) => (
              <Button
                key={template.id}
                asChild
                size="sm"
                variant={activeNotificationTemplate === template.id ? "secondary" : "ghost"}
              >
                <Link
                  href={`/configuracao?tab=notificacoes&channel=${activeNotificationChannel}&template=${template.id}`}
                >
                  {template.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="ring-border space-y-3 rounded-lg p-3 ring-1">
          <p className="text-sm font-medium">
            {selectedChannel?.label} — {selectedTemplate?.label}
          </p>
          <div className="space-y-1">
            <Label htmlFor="notification-template-editor">Mensagem</Label>
            <Textarea
              id="notification-template-editor"
              placeholder={templatePlaceholder(
                activeNotificationChannel,
                activeNotificationTemplate
              )}
              rows={8}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" type="button">Salvar templates (em desenvolvimento)</Button>
        </div>
      </div>
    );
  }

  if (activeTab === "seguranca") {
    return (
      <div className="space-y-4 text-xs">
        <div className="space-y-1">
          <p className="font-medium">Redefinir senha</p>
          <p className="text-muted-foreground">
            Atualize sua senha para manter sua conta protegida.
          </p>
        </div>

        <div className="ring-border grid gap-3 rounded-lg p-3 ring-1">
          <div className="space-y-1">
            <Label htmlFor="current-password">Senha atual</Label>
            <Input id="current-password" type="password" placeholder="Digite sua senha atual" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input id="new-password" type="password" placeholder="Digite a nova senha" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <Input id="confirm-password" type="password" placeholder="Repita a nova senha" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" type="button">Redefinir senha (em desenvolvimento)</Button>
        </div>
      </div>
    );
  }

  if (activeTab === "equipe") {
    return (
      <div className="space-y-4 text-xs">
        <div className="space-y-1">
          <p className="font-medium">Equipe da clínica</p>
          <p className="text-muted-foreground">
            Gerencie usuários e as funções de acesso da equipe.
          </p>
        </div>

        <TeamMembersManager teamMembers={teamMembers} />
      </div>
    );
  }

  if (activeTab === "clinicas") {
    return (
      <div className="space-y-4 text-xs">
        <div className="space-y-1">
          <p className="font-medium">Clínicas</p>
          <p className="text-muted-foreground">
            Gerencie cada clínica, seu administrador responsável e a equipe vinculada.
          </p>
        </div>

        <ClinicsManager clinics={clinics} />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-1">
        <p className="font-medium">Configurações gerais</p>
        <p className="text-muted-foreground">
          Ajuste informações da clínica e preferências padrão do sistema.
        </p>
      </div>

      <div className="ring-border grid gap-3 rounded-lg p-3 ring-1">
        <div className="space-y-1">
          <Label htmlFor="general-email">Email</Label>
          <Input id="general-email" type="email" placeholder="contato@clinica.com" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm" type="button">Salvar configurações (em desenvolvimento)</Button>
      </div>
    </div>
  );
}

export default async function ConfiguracaoPage({
  searchParams,
}: {
  searchParams: Promise<ConfigSearchParams>;
}) {
  const params = await searchParams;
  const activeTab = resolveTab(params.tab);
  const activeNotificationChannel = resolveNotificationChannel(params.channel);
  const activeNotificationTemplate = resolveNotificationTemplate(params.template);

  async function loadTeamMembers(): Promise<TeamMember[]> {
    const fallback: TeamMember[] = [
      {
        id: "demo-admin",
        name: "Administrador",
        email: "admin@clinica.com",
        role: "Administrador",
      },
    ];

    if (!process.env.DATABASE_URL) {
      return fallback;
    }

    try {
      const session = await getSession();
      if (!session?.organizationId) {
        return fallback;
      }

      const users = await prisma.user.findMany({
        where: {
          organizationId: session.organizationId,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      if (!users.length) {
        return fallback;
      }

      return users.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: index === 0 ? "Administrador" : "Solicitante",
      }));
    } catch {
      return fallback;
    }
  }

  async function loadClinics(): Promise<ClinicRow[]> {
    const fallback: ClinicRow[] = [
      {
        id: "demo-clinic-1",
        name: "Clínica Demo",
        adminName: "Administrador",
        teamSize: 1,
        teamMembers: [
          {
            id: "demo-admin",
            name: "Administrador",
            email: "admin@clinica.com",
            role: "Administrador",
          },
        ],
      },
    ];

    if (!process.env.DATABASE_URL) {
      return fallback;
    }

    try {
      const organizations = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      if (!organizations.length) {
        return fallback;
      }

      return organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
        adminName: organization.users[0]?.name ?? "Não definido",
        teamSize: organization.users.length,
        teamMembers: organization.users.map((user, index) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: index === 0 ? "Administrador" : "Solicitante",
        })),
      }));
    } catch {
      return fallback;
    }
  }

  const teamMembers = await loadTeamMembers();
  const clinics = await loadClinics();

  return (
    <section className="space-y-3">
      <div className="bg-card ring-border inline-flex items-center gap-2 rounded-lg p-1 ring-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            asChild
            size="sm"
            variant={activeTab === tab.id ? "secondary" : "ghost"}
          >
            <Link href={`/configuracao?tab=${tab.id}`}>{tab.label}</Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tabs.find((tab) => tab.id === activeTab)?.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <TabContent
            activeTab={activeTab}
            activeNotificationChannel={activeNotificationChannel}
            activeNotificationTemplate={activeNotificationTemplate}
            teamMembers={teamMembers}
            clinics={clinics}
          />
        </CardContent>
      </Card>
    </section>
  );
}
