import { PlanTier } from "@prisma/client";

import type { ExamRequestRow } from "@/components/dashboard/types";
import { prisma } from "@/lib/prisma";
import { resolveAuthorizationLimit } from "@/lib/plans";
import { getSession } from "@/lib/session";
import { DEFAULT_TEMPLATE_MESSAGES, TEMPLATE_KEYS } from "@/lib/template-keys";

const planLabel: Record<PlanTier, string> = {
  ESSENTIAL: "Essencial",
  PROFESSIONAL: "Profissional",
  ULTIMATE: "Ultimate",
};

type DashboardFilterInput = {
  month?: string;
  year?: string;
  from?: string;
  to?: string;
  serviceType?: "all" | "procedimento" | "exame";
};

type ServiceType = "all" | "procedimento" | "exame";

function resolveServiceType(serviceType?: string): ServiceType {
  if (serviceType === "procedimento" || serviceType === "exame") {
    return serviceType;
  }

  return "all";
}

function resolveRequestServiceType(requestData: unknown): Exclude<ServiceType, "all"> {
  if (typeof requestData === "object" && requestData !== null) {
    const maybeRecord = requestData as Record<string, unknown>;
    const candidates = [
      maybeRecord.serviceType,
      maybeRecord.type,
      maybeRecord.kind,
      maybeRecord.category,
      maybeRecord.examType,
      maybeRecord.examName,
      maybeRecord.exam,
      maybeRecord.procedure,
      maybeRecord.procedureName,
    ]
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.toLowerCase());

    if (candidates.some((value) => value.includes("procedimento") || value.includes("laser"))) {
      return "procedimento";
    }

    if (candidates.some((value) => value.includes("exame") || value.includes("imagem"))) {
      return "exame";
    }
  }

  return "exame";
}

function matchesServiceType(requestData: unknown, serviceType: ServiceType) {
  if (serviceType === "all") {
    return true;
  }

  return resolveRequestServiceType(requestData) === serviceType;
}

function resolveExamName(requestData: unknown, fallbackProtocol: string) {
  if (typeof requestData === "object" && requestData !== null) {
    const maybeRecord = requestData as Record<string, unknown>;
    const examCandidate = maybeRecord.examName ?? maybeRecord.exam;

    if (typeof examCandidate === "string" && examCandidate.trim()) {
      return examCandidate;
    }
  }

  return `Exame ${fallbackProtocol}`;
}

function resolveConvenio(requestData: unknown) {
  if (typeof requestData === "object" && requestData !== null) {
    const maybeRecord = requestData as Record<string, unknown>;
    const convenioCandidate =
      maybeRecord.convenio ??
      maybeRecord.convenioName ??
      maybeRecord.insurance ??
      maybeRecord.healthInsurance ??
      maybeRecord.planName;

    if (typeof convenioCandidate === "string" && convenioCandidate.trim()) {
      return convenioCandidate;
    }
  }

  return "Não informado";
}

type DashboardPeriod = "month" | "year";

export type AnnualStatusPoint = {
  month: string;
  pending: number;
  analyzing: number;
  authorized: number;
  rejected: number;
  cancelled: number;
};

export type PrivateDashboardData = {
  organizationName: string;
  planName: string;
  monthlyLimit: number | null;
  monthlyAuthorizedCount: number;
  selectedPeriod: DashboardPeriod;
  selectedPeriodLabel: string;
  annualYear: number;
  annualSeries: AnnualStatusPoint[];
  totalRequests: number;
  pendingCount: number;
  analyzingCount: number;
  authorizedCount: number;
  rejectedCount: number;
  cancelledCount: number;
  rows: ExamRequestRow[];
  usingDemoData: boolean;
};

export type PatientListRow = {
  id: string;
  patientName: string;
  patientBirthDate: string;
  patientEmail: string;
  patientPhone: string;
  convenio: string;
  lastRequestDate: string;
  requestsCount: number;
};

export type NotificationTemplateSettings = {
  whatsappAuthorized: string;
  whatsappRejected: string;
  emailAuthorized: string;
  emailRejected: string;
};

function resolvePatientEmail(requestData: unknown) {
  if (typeof requestData === "object" && requestData !== null) {
    const maybeRecord = requestData as Record<string, unknown>;
    const emailCandidate =
      maybeRecord.email ??
      maybeRecord.patientEmail ??
      maybeRecord.contactEmail ??
      maybeRecord.mail;

    if (typeof emailCandidate === "string" && emailCandidate.trim()) {
      return emailCandidate;
    }
  }

  return "Não informado";
}

function formatBirthDate(value: string) {
  const normalized = value.trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) {
    return normalized;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const date = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(date.getTime()) ? "Não informado" : date.toLocaleDateString("pt-BR");
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return "Não informado";
  }

  return parsed.toLocaleDateString("pt-BR");
}

function resolvePatientBirthDate(requestData: unknown) {
  if (typeof requestData === "object" && requestData !== null) {
    const maybeRecord = requestData as Record<string, unknown>;
    const birthDateCandidate =
      maybeRecord.birthDate ??
      maybeRecord.dateOfBirth ??
      maybeRecord.dob ??
      maybeRecord.patientBirthDate;

    if (typeof birthDateCandidate === "string" && birthDateCandidate.trim()) {
      return formatBirthDate(birthDateCandidate);
    }
  }

  return "Não informado";
}

const monthShortNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function resolveReferenceYear(input: DashboardFilterInput) {
  const now = new Date();
  const parsedYear = Number(input.year ?? now.getFullYear());
  return Number.isInteger(parsedYear) && parsedYear > 2000 && parsedYear < 2101
    ? parsedYear
    : now.getFullYear();
}

function createEmptyAnnualSeries(): AnnualStatusPoint[] {
  return monthShortNames.map((month) => ({
    month,
    pending: 0,
    analyzing: 0,
    authorized: 0,
    rejected: 0,
    cancelled: 0,
  }));
}

function aggregateAnnualSeries(
  requests: Array<{
    createdAt: Date;
    status: "PENDING" | "ANALYZING" | "AUTHORIZED" | "REJECTED" | "CANCELLED";
  }>
) {
  const series = createEmptyAnnualSeries();

  for (const request of requests) {
    const index = request.createdAt.getMonth();

    if (request.status === "PENDING") {
      series[index].pending += 1;
      continue;
    }

    if (request.status === "ANALYZING") {
      series[index].analyzing += 1;
      continue;
    }

    if (request.status === "AUTHORIZED") {
      series[index].authorized += 1;
      continue;
    }

    if (request.status === "REJECTED") {
      series[index].rejected += 1;
      continue;
    }

    series[index].cancelled += 1;
  }

  return series;
}

function parseDateInput(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolvePeriodRange(input: DashboardFilterInput) {
  const now = new Date();
  const parsedFrom = parseDateInput(input.from);
  const parsedTo = parseDateInput(input.to);

  if (parsedFrom && parsedTo && parsedFrom <= parsedTo) {
    const end = new Date(parsedTo);
    end.setDate(end.getDate() + 1);

    return {
      start: parsedFrom,
      end,
      label: `${parsedFrom.toLocaleDateString("pt-BR")} até ${parsedTo.toLocaleDateString("pt-BR")}`,
    };
  }

  const month = input.month === "all" || !input.month ? "all" : Number(input.month);
  const year = Number(input.year ?? now.getFullYear());
  const safeYear = Number.isInteger(year) && year > 2000 && year < 2101 ? year : now.getFullYear();

  if (month === "all") {
    return {
      start: new Date(safeYear, 0, 1),
      end: new Date(safeYear + 1, 0, 1),
      label: `${safeYear}`,
    };
  }

  const safeMonth = Number.isInteger(month) && month >= 1 && month <= 12 ? month : now.getMonth() + 1;
  const monthStart = new Date(safeYear, safeMonth - 1, 1);
  const monthEnd = new Date(safeYear, safeMonth, 1);

  return {
    start: monthStart,
    end: monthEnd,
    label: monthStart.toLocaleString("pt-BR", { month: "long", year: "numeric" }),
  };
}

function demoData(filter: DashboardFilterInput): PrivateDashboardData {
  const periodRange = resolvePeriodRange(filter);
  const annualYear = resolveReferenceYear(filter);
  const annualSeries = createEmptyAnnualSeries();

  annualSeries[0].pending = 3;
  annualSeries[1].authorized = 5;
  annualSeries[2].analyzing = 2;
  annualSeries[3].rejected = 1;
  annualSeries[4].authorized = 4;
  annualSeries[5].pending = 2;
  annualSeries[6].cancelled = 1;

  const selectedServiceType = resolveServiceType(filter.serviceType);
  const demoRows: ExamRequestRow[] = [
    {
      id: "demo-1",
      protocol: "MED-2026-0001",
      patientName: "Ana Souza",
      convenio: "Unimed",
      examName: "Ressonância Magnética",
      requestType: "exame",
      requestDate: new Date().toLocaleDateString("pt-BR"),
      patientPhone: "+55 11 99999-1001",
      createdByName: "Atendente Demo",
      requestingPhysician: "Dr. Carlos Lima",
      status: "PENDING",
      deliveryStatus: "-",
    },
    {
      id: "demo-2",
      protocol: "MED-2026-0002",
      patientName: "João Pereira",
      convenio: "Bradesco Saúde",
      examName: "Tomografia",
      requestType: "exame",
      requestDate: new Date().toLocaleDateString("pt-BR"),
      patientPhone: "+55 11 99999-1002",
      createdByName: "Atendente Demo",
      requestingPhysician: "Dra. Renata Rocha",
      status: "AUTHORIZED",
      deliveryStatus: "DELIVERED",
    },
    {
      id: "demo-3",
      protocol: "MED-2026-0003",
      patientName: "Marina Alves",
      convenio: "SulAmérica",
      examName: "Raio-X",
      requestType: "exame",
      requestDate: new Date().toLocaleDateString("pt-BR"),
      patientPhone: "+55 11 99999-1003",
      createdByName: "Atendente Demo",
      requestingPhysician: "Dr. Pedro Nunes",
      status: "ANALYZING",
      deliveryStatus: "SENT",
    },
    {
      id: "demo-4",
      protocol: "MED-2026-0004",
      patientName: "Paulo Martins",
      convenio: "Amil",
      examName: "Laser CO2",
      requestType: "procedimento",
      requestDate: new Date().toLocaleDateString("pt-BR"),
      patientPhone: "+55 11 99999-1004",
      createdByName: "Atendente Demo",
      requestingPhysician: "Dra. Camila Reis",
      status: "CANCELLED",
      deliveryStatus: "-",
    },
  ];

  const rows = demoRows.filter((row) => {
    if (selectedServiceType === "all") {
      return true;
    }

    const rowType = row.examName.toLowerCase().includes("laser")
      ? "procedimento"
      : "exame";
    return rowType === selectedServiceType;
  });

  const totalRequests = rows.length;
  const pendingCount = rows.filter((row) => row.status === "PENDING").length;
  const analyzingCount = rows.filter((row) => row.status === "ANALYZING").length;
  const authorizedCount = rows.filter((row) => row.status === "AUTHORIZED").length;
  const rejectedCount = rows.filter((row) => row.status === "REJECTED").length;
  const cancelledCount = rows.filter((row) => row.status === "CANCELLED").length;

  return {
    organizationName: "Clínica Demo",
    planName: "Essencial",
    monthlyLimit: 300,
    monthlyAuthorizedCount: 12,
    selectedPeriod: filter.month === "all" ? "year" : "month",
    selectedPeriodLabel: periodRange.label,
    annualYear,
    annualSeries,
    totalRequests,
    pendingCount,
    analyzingCount,
    authorizedCount,
    rejectedCount,
    cancelledCount,
    usingDemoData: true,
    rows,
  };
}

export async function getPrivateDashboardData(
  filter: DashboardFilterInput = {}
): Promise<PrivateDashboardData> {
  if (!process.env.DATABASE_URL) {
    return demoData(filter);
  }

  try {
    const session = await getSession();
    const organizationId = session?.organizationId;

    if (!organizationId) {
      return demoData(filter);
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const annualYear = resolveReferenceYear(filter);
    const selectedServiceType = resolveServiceType(filter.serviceType);
    const annualStart = new Date(annualYear, 0, 1);
    const annualEnd = new Date(annualYear + 1, 0, 1);
    const periodRange = resolvePeriodRange(filter);

    const [organization, periodRequests, annualRequests, monthlyAuthorizedCount] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
          name: true,
          currentPlan: true,
          monthlyAuthorizationLimit: true,
        },
      }),
      prisma.examRequest.findMany({
        where: {
          organizationId,
          createdAt: {
            gte: periodRange.start,
            lt: periodRange.end,
          },
        },
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.examRequest.findMany({
        where: {
          organizationId,
          createdAt: {
            gte: annualStart,
            lt: annualEnd,
          },
        },
        select: {
          createdAt: true,
          status: true,
          requestData: true,
        },
      }),
      prisma.examRequest.count({
        where: {
          organizationId,
          status: "AUTHORIZED",
          authorizedAt: { gte: monthStart },
        },
      }),
    ]);

    const monthlyLimit = organization
      ? resolveAuthorizationLimit(
          organization.currentPlan,
          organization.monthlyAuthorizationLimit
        )
      : null;

    const filteredPeriodRequests = periodRequests.filter((request) =>
      matchesServiceType(request.requestData, selectedServiceType)
    );

    const filteredAnnualRequests = annualRequests.filter((request) =>
      matchesServiceType(request.requestData, selectedServiceType)
    );

    const rows: ExamRequestRow[] = filteredPeriodRequests.map((request) => ({
      id: request.id,
      patientName: request.patientName,
      convenio: resolveConvenio(request.requestData),
      examName: resolveExamName(request.requestData, request.protocol),
      requestType: resolveRequestServiceType(request.requestData),
      requestDate: request.requestDate.toLocaleDateString("pt-BR"),
      patientPhone: request.patientPhone,
      createdByName: request.createdBy.name,
      requestingPhysician: request.requestingPhysician,
      protocol: request.protocol,
      status: request.status,
      deliveryStatus: request.deliveryStatus ?? "-",
    }));

    const totalRequests = filteredPeriodRequests.length;
    const pendingCount = filteredPeriodRequests.filter(
      (request) => request.status === "PENDING"
    ).length;
    const analyzingCount = filteredPeriodRequests.filter(
      (request) => request.status === "ANALYZING"
    ).length;
    const authorizedCount = filteredPeriodRequests.filter(
      (request) => request.status === "AUTHORIZED"
    ).length;
    const rejectedCount = filteredPeriodRequests.filter(
      (request) => request.status === "REJECTED"
    ).length;
    const cancelledCount = filteredPeriodRequests.filter(
      (request) => request.status === "CANCELLED"
    ).length;
    const annualSeries = aggregateAnnualSeries(
      filteredAnnualRequests.map((request) => ({
        createdAt: request.createdAt,
        status: request.status,
      }))
    );

    return {
      organizationName: organization?.name ?? "N/D",
      planName: organization ? planLabel[organization.currentPlan] : "N/D",
      monthlyLimit,
      monthlyAuthorizedCount,
      selectedPeriod: filter.month === "all" ? "year" : "month",
      selectedPeriodLabel: periodRange.label,
      annualYear,
      annualSeries,
      totalRequests,
      pendingCount,
      analyzingCount,
      authorizedCount,
      rejectedCount,
      cancelledCount,
      rows,
      usingDemoData: false,
    };
  } catch {
    return demoData(filter);
  }
}

export async function getPatientsListData(): Promise<PatientListRow[]> {
  const now = new Date();

  function buildFromRows(
    rows: Array<{
      id: string;
      patientName: string;
      patientPhone: string;
      requestDate: Date;
      requestData: unknown;
    }>
  ) {
    const grouped = new Map<
      string,
      {
        id: string;
        patientName: string;
        patientBirthDate: string;
        patientEmail: string;
        patientPhone: string;
        convenio: string;
        lastRequestDateRaw: Date;
        requestsCount: number;
      }
    >();

    for (const row of rows) {
      const key = `${row.patientName.toLowerCase()}::${row.patientPhone}`;
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          id: row.id,
          patientName: row.patientName,
          patientBirthDate: resolvePatientBirthDate(row.requestData),
          patientEmail: resolvePatientEmail(row.requestData),
          patientPhone: row.patientPhone,
          convenio: resolveConvenio(row.requestData),
          lastRequestDateRaw: row.requestDate,
          requestsCount: 1,
        });
        continue;
      }

      existing.requestsCount += 1;

      if (row.requestDate > existing.lastRequestDateRaw) {
        existing.lastRequestDateRaw = row.requestDate;
        existing.convenio = resolveConvenio(row.requestData);
      }
    }

    return Array.from(grouped.values())
      .map((item) => ({
        id: item.id,
        patientName: item.patientName,
        patientBirthDate: item.patientBirthDate,
        patientEmail: item.patientEmail,
        patientPhone: item.patientPhone,
        convenio: item.convenio,
        lastRequestDate: item.lastRequestDateRaw.toLocaleDateString("pt-BR"),
        requestsCount: item.requestsCount,
      }))
      .sort((a, b) => a.patientName.localeCompare(b.patientName, "pt-BR"));
  }

  if (!process.env.DATABASE_URL) {
    return buildFromRows(
      demoData({ month: "all", year: String(now.getFullYear()) }).rows.map((row) => ({
        id: row.id,
        patientName: row.patientName,
        patientPhone: row.patientPhone,
        requestDate: now,
        requestData: { convenio: row.convenio, birthDate: "1985-08-03" },
      }))
    );
  }

  try {
    const session = await getSession();

    if (!session?.organizationId) {
      return [];
    }

    const requests = await prisma.examRequest.findMany({
      where: {
        organizationId: session.organizationId,
      },
      select: {
        id: true,
        patientName: true,
        patientPhone: true,
        requestDate: true,
        requestData: true,
      },
      orderBy: {
        requestDate: "desc",
      },
    });

    return buildFromRows(requests);
  } catch {
    return [];
  }
}

export async function getNotificationTemplateSettings(): Promise<
  NotificationTemplateSettings
> {
  const defaults: NotificationTemplateSettings = {
    whatsappAuthorized: DEFAULT_TEMPLATE_MESSAGES[TEMPLATE_KEYS.WHATSAPP_AUTHORIZED],
    whatsappRejected: DEFAULT_TEMPLATE_MESSAGES[TEMPLATE_KEYS.WHATSAPP_REJECTED],
    emailAuthorized: DEFAULT_TEMPLATE_MESSAGES[TEMPLATE_KEYS.EMAIL_AUTHORIZED],
    emailRejected: DEFAULT_TEMPLATE_MESSAGES[TEMPLATE_KEYS.EMAIL_REJECTED],
  };

  if (!process.env.DATABASE_URL) {
    return defaults;
  }

  try {
    const session = await getSession();

    if (!session?.organizationId) {
      return defaults;
    }

    const templates = await prisma.template.findMany({
      where: {
        organizationId: session.organizationId,
        name: {
          in: [
            TEMPLATE_KEYS.WHATSAPP_AUTHORIZED,
            TEMPLATE_KEYS.WHATSAPP_REJECTED,
            TEMPLATE_KEYS.EMAIL_AUTHORIZED,
            TEMPLATE_KEYS.EMAIL_REJECTED,
          ],
        },
      },
      select: {
        name: true,
        message: true,
      },
    });

    const map = new Map(templates.map((item) => [item.name, item.message]));

    return {
      whatsappAuthorized:
        map.get(TEMPLATE_KEYS.WHATSAPP_AUTHORIZED) ?? defaults.whatsappAuthorized,
      whatsappRejected:
        map.get(TEMPLATE_KEYS.WHATSAPP_REJECTED) ?? defaults.whatsappRejected,
      emailAuthorized: map.get(TEMPLATE_KEYS.EMAIL_AUTHORIZED) ?? defaults.emailAuthorized,
      emailRejected: map.get(TEMPLATE_KEYS.EMAIL_REJECTED) ?? defaults.emailRejected,
    };
  } catch {
    return defaults;
  }
}
