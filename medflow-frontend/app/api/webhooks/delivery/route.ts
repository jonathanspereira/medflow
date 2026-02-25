import { DeliveryStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type DeliveryWebhookPayload = {
  examRequestId?: string;
  organizationId?: string;
  deliveryStatus?: DeliveryStatus;
  wahaMessageId?: string | null;
};

const VALID_DELIVERY_STATUS: DeliveryStatus[] = ["SENT", "DELIVERED", "READ"];

export async function PATCH(req: Request) {
  const body = (await req.json()) as DeliveryWebhookPayload;

  if (
    !body.examRequestId ||
    !body.organizationId ||
    !body.deliveryStatus ||
    !VALID_DELIVERY_STATUS.includes(body.deliveryStatus)
  ) {
    return NextResponse.json(
      { error: "Payload inválido para atualização de entrega." },
      { status: 400 }
    );
  }

  const updated = await prisma.examRequest.updateMany({
    where: {
      id: body.examRequestId,
      organizationId: body.organizationId,
    },
    data: {
      deliveryStatus: body.deliveryStatus,
      wahaMessageId: body.wahaMessageId ?? null,
    },
  });

  if (!updated.count) {
    return NextResponse.json(
      { error: "Solicitação não encontrada para esta organização." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
