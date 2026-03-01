import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPeriodFilter } from "@/components/dashboard/period-filter";
import {
  AnnualTotalRequestsChart,
  AnnualStatusLineChart,
  PeriodStatusPercentageChart,
  StatusDistributionChart,
} from "@/components/dashboard/status-charts";
import { getPrivateDashboardData } from "@/app/(private)/_lib/private-data";

type DashboardSearchParams = {
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
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

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <DashboardPeriodFilter
          from={from}
          month={month}
          serviceType={serviceType}
          to={to}
          year={year}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{data.totalRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Em análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{data.analyzingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Autorizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{data.authorizedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{data.pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Negadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{data.rejectedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{data.cancelledCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <AnnualStatusLineChart data={data.annualSeries} year={data.annualYear} />
        <StatusDistributionChart
          analyzing={data.analyzingCount}
          authorized={data.authorizedCount}
          pending={data.pendingCount}
          rejected={data.rejectedCount}
          cancelled={data.cancelledCount}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <AnnualTotalRequestsChart data={data.annualSeries} year={data.annualYear} />
        <PeriodStatusPercentageChart
          analyzing={data.analyzingCount}
          authorized={data.authorizedCount}
          pending={data.pendingCount}
          rejected={data.rejectedCount}
          cancelled={data.cancelledCount}
          total={data.totalRequests}
        />
      </div>
    </section>
  );
}
