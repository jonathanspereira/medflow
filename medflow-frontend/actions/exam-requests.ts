"use server";

import { DeliveryStatus, ExamRequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { resolveAuthorizationLimit } from "@/lib/plans";
import { requireSession } from "@/lib/session";

const VALID_STATUSES: ExamRequestStatus[] = [
  "PENDING",
  "ANALYZING",
  "AUTHORIZED",
  "REJECTED",
];

type ExamStatusInput = (typeof VALID_STATUSES)[number];

async function ensureOrganizationQuota(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      currentPlan: true,
      monthlyAuthorizationLimit: true,
    },
  });

  if (!organization) {
    throw new Error("Organização não encontrada.");
  }

  const limit = resolveAuthorizationLimit(
    organization.currentPlan,
    organization.monthlyAuthorizationLimit
  );

  if (limit === null) {
    return;
  }

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const authorizedCount = await prisma.examRequest.count({
    where: {
      organizationId,
      status: "AUTHORIZED",
      authorizedAt: {
        gte: periodStart,
      },
    },
  });

  if (authorizedCount >= limit) {
    throw new Error(
      `Limite do plano atingido (${limit} autorizações/mês). Faça upgrade para continuar.`
    );
  }
}

export async function authorizeExamRequestAction(examRequestId: string) {
  const session = await requireSession();

  const examRequest = await prisma.examRequest.findFirst({
    where: {
      id: examRequestId,
      organizationId: session.organizationId,
    },
  });

  if (!examRequest) {
    throw new Error("Solicitação não encontrada.");
  }

  if (examRequest.status === "AUTHORIZED") {
    return { success: true, skipped: true };
  }

  await ensureOrganizationQuota(session.organizationId);

  const template = await prisma.template.findFirst({
    where: {
      organizationId: session.organizationId,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  const updatedRequest = await prisma.examRequest.update({
    where: {
      id: examRequest.id,
    },
    data: {
      status: "AUTHORIZED",
      authorizedAt: new Date(),
      deliveryStatus: DeliveryStatus.SENT,
    },
  });

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (webhookUrl) {
    const payload = {
      organizationId: session.organizationId,
      examRequestId: updatedRequest.id,
      patient: {
        name: updatedRequest.patientName,
        phone: updatedRequest.patientPhone,
      },
      physician: updatedRequest.requestingPhysician,
      protocol: updatedRequest.protocol,
      messageTemplate:
        template?.message ??
        "Olá, seu pedido foi autorizado. Responda esta mensagem para continuar.",
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar notificação para o n8n.");
    }
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateExamRequestStatusAction(
  examRequestId: string,
  nextStatus: ExamStatusInput
) {
  if (!VALID_STATUSES.includes(nextStatus)) {
    throw new Error("Status inválido.");
  }

  if (nextStatus === "AUTHORIZED") {
    return authorizeExamRequestAction(examRequestId);
  }

  const session = await requireSession();

  await prisma.examRequest.updateMany({
    where: {
      id: examRequestId,
      organizationId: session.organizationId,
    },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath("/");
  return { success: true };
}
