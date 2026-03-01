import { ExamRequestsTable } from "@/components/dashboard/exam-requests-table";
import { DashboardPeriodFilter } from "@/components/dashboard/period-filter";
import {
  getPatientsListData,
  getPrivateDashboardData,
} from "@/app/(private)/_lib/private-data";

type SolicitacoesSearchParams = {
  month?: string;
  year?: string;
  from?: string;
  to?: string;
  serviceType?: string;
};

function parseMonth(month?: string) {
  if (!month) {
    return "all";
  }

  if (month === "all") {
    return "all";
  }

  const parsed = Number(month);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) {
    return "all";
  }

  return String(parsed);
}

function parseYear(year?: string) {
  const parsed = Number(year);
  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 2100) {
    return String(new Date().getFullYear());
  }

  return String(parsed);
}

function parseServiceType(serviceType?: string) {
  if (serviceType === "procedimento" || serviceType === "exame") {
    return serviceType;
  }

  return "all";
}

export default async function SolicitacoesPage({
  searchParams,
}: {
  searchParams: Promise<SolicitacoesSearchParams>;
}) {
  const params = await searchParams;
  const month = parseMonth(params.month);
  const year = parseYear(params.year);
  const from = params.from;
  const to = params.to;
  const serviceType = parseServiceType(params.serviceType);

  const data = await getPrivateDashboardData({
    month,
    year,
    from,
    to,
    serviceType,
  });
  const patients = await getPatientsListData();
  const patientOptions = Array.from(
    new Set(
      patients.map(
        (patient) =>
          `${patient.patientName} | ${patient.convenio} | ${patient.patientBirthDate}`
      )
    )
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <section className="space-y-3">
      <DashboardPeriodFilter
        from={from}
        month={month}
        serviceType={serviceType}
        to={to}
        year={year}
      />

      <ExamRequestsTable
        data={data.rows}
        patientOptions={patientOptions}
      />
    </section>
  );
}
