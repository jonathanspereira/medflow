import type { AnnualStatusPoint } from "@/app/(private)/_lib/private-data";

type AnnualStatusLineChartProps = {
  year: number;
  data: AnnualStatusPoint[];
};

type LineKey = "pending" | "analyzing" | "authorized" | "rejected" | "cancelled";

const lineConfig: Array<{
  key: LineKey;
  label: string;
  className: string;
  dash?: string;
}> = [
  { key: "analyzing", label: "Em análise", className: "text-blue-500" },
  { key: "authorized", label: "Autorizadas", className: "text-green-500" },
  { key: "pending", label: "Pendentes", className: "text-amber-500", dash: "6 4" },
  { key: "rejected", label: "Negadas", className: "text-red-500", dash: "2 4" },
  { key: "cancelled", label: "Canceladas", className: "text-slate-500", dash: "10 4" },
];

function pointsForLine(data: AnnualStatusPoint[], key: LineKey, maxValue: number) {
  const width = 760;
  const height = 300;
  const paddingX = 38;
  const paddingY = 40;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  return data
    .map((item, index) => {
      const x = paddingX + (chartWidth / Math.max(data.length - 1, 1)) * index;
      const y =
        paddingY +
        chartHeight -
        ((item[key] ?? 0) / Math.max(maxValue, 1)) * chartHeight;
      return { x, y };
    });
}

function smoothPath(points: Array<{ x: number; y: number }>) {
  if (!points.length) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    d += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  d += ` T ${last.x} ${last.y}`;
  return d;
}

export function AnnualStatusLineChart({ year, data }: AnnualStatusLineChartProps) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((point) => [
      point.pending,
      point.analyzing,
      point.authorized,
      point.rejected,
      point.cancelled,
    ])
  );

  return (
    <div className="bg-card ring-border rounded-lg p-3 ring-1">
      <div className="mb-2 space-y-2">
        <p className="text-sm font-medium">Comparativo anual por status ({year})</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {lineConfig.map((line) => (
            <span key={line.key} className={`inline-flex items-center gap-1 ${line.className}`}>
              <span className="bg-current inline-block size-2 rounded-full" />
              {line.label}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 760 300" className="h-72 w-full">
        <line x1="38" y1="260" x2="722" y2="260" className="stroke-border" strokeWidth="1" />
        <line x1="38" y1="40" x2="38" y2="260" className="stroke-border" strokeWidth="1" />

        {lineConfig.map((line) => {
          const points = pointsForLine(data, line.key, maxValue);

          return (
            <g key={line.key}>
              <path
                d={smoothPath(points)}
                fill="none"
                className={`stroke-current ${line.className}`}
                strokeWidth="2.5"
                strokeDasharray={line.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((point, index) => (
                <circle
                  key={`${line.key}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  className={`fill-current ${line.className}`}
                />
              ))}
            </g>
          );
        })}

        {data.map((point, index) => {
          const x = 38 + (684 / Math.max(data.length - 1, 1)) * index;
          return (
            <text
              key={`${point.month}-${index}`}
              x={x}
              y="282"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function StatusDistributionChart({
  pending,
  analyzing,
  authorized,
  rejected,
  cancelled,
}: {
  pending: number;
  analyzing: number;
  authorized: number;
  rejected: number;
  cancelled: number;
}) {
  const items = [
    {
      key: "analyzing",
      label: "Em análise",
      value: analyzing,
      fillClassName: "fill-blue-500",
      strokeClassName: "stroke-blue-500",
      textClassName: "text-blue-500",
      labelTextClassName: "fill-black dark:fill-white",
    },
    {
      key: "authorized",
      label: "Autorizadas",
      value: authorized,
      fillClassName: "fill-green-500",
      strokeClassName: "stroke-green-500",
      textClassName: "text-green-500",
      labelTextClassName: "fill-black dark:fill-white",
    },
    {
      key: "pending",
      label: "Pendentes",
      value: pending,
      fillClassName: "fill-amber-500",
      strokeClassName: "stroke-amber-500",
      textClassName: "text-amber-500",
      labelTextClassName: "fill-black dark:fill-white",
    },
    {
      key: "rejected",
      label: "Negadas",
      value: rejected,
      fillClassName: "fill-red-500",
      strokeClassName: "stroke-red-500",
      textClassName: "text-red-500",
      labelTextClassName: "fill-black dark:fill-white",
    },
    {
      key: "cancelled",
      label: "Canceladas",
      value: cancelled,
      fillClassName: "fill-slate-500",
      strokeClassName: "stroke-slate-500",
      textClassName: "text-slate-500",
      labelTextClassName: "fill-black dark:fill-white",
    },
  ];

  const total = items.reduce((accumulator, item) => accumulator + item.value, 0);
  const center = 88;
  const radius = 66;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="bg-card ring-border rounded-lg p-3 ring-1">
      <p className="mb-3 text-sm font-medium">Distribuição no período selecionado</p>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {items.map((item) => (
          <span
            key={item.key}
            className={`inline-flex items-center gap-1 ${item.textClassName}`}
          >
            <span className="bg-current inline-block size-2 rounded-full" />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <svg className="size-64" viewBox="0 0 176 176">
            <circle
              cx={center}
              cy={center}
              r={radius}
              className="stroke-muted/60 fill-none"
              strokeWidth={strokeWidth}
            />
            {total > 0
              ? items.map((item) => {
                  const segment = (item.value / total) * circumference;
                  const currentOffset = offset;
                  offset += segment;
                  const percentage = Math.round((item.value / total) * 100);
                  const midAngle =
                    -90 + ((currentOffset + segment / 2) / circumference) * 360;
                  const angleInRad = (midAngle * Math.PI) / 180;
                  const labelRadius = radius + 14;
                  const labelX = center + Math.cos(angleInRad) * labelRadius;
                  const labelY = center + Math.sin(angleInRad) * labelRadius;
                  const anchor = Math.cos(angleInRad) >= 0 ? "start" : "end";

                  return (
                    <g key={item.key}>
                      <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        className={`${item.strokeClassName} fill-none`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${segment} ${circumference - segment}`}
                        strokeDashoffset={circumference * 0.25 - currentOffset}
                        strokeLinecap="round"
                      >
                        <title>
                          {item.label} — {percentage}% ({item.value})
                        </title>
                      </circle>
                      {percentage >= 4 ? (
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor={anchor}
                          dominantBaseline="middle"
                          className={`${item.labelTextClassName} text-[10px] font-semibold`}
                        >
                          {percentage}%
                        </text>
                      ) : null}
                    </g>
                  );
                })
              : null}

            <circle
              cx={center}
              cy={center}
              r={radius - strokeWidth + 2}
              className="fill-card stroke-border/70"
              strokeWidth="1"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center leading-tight">
              <p className="text-base font-semibold">{total}</p>
              <p className="text-muted-foreground text-[10px]">total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnnualTotalRequestsChart({
  year,
  data,
}: {
  year: number;
  data: AnnualStatusPoint[];
}) {
  const totals = data.map((item) => ({
    month: item.month,
    total:
      item.pending +
      item.analyzing +
      item.authorized +
      item.rejected +
      item.cancelled,
  }));

  const max = Math.max(1, ...totals.map((item) => item.total));
  const width = 760;
  const height = 240;
  const paddingX = 38;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = totals.map((item, index) => {
    const x = paddingX + (chartWidth / Math.max(totals.length - 1, 1)) * index;
    const y = paddingY + chartHeight - (item.total / max) * chartHeight;
    return { x, y };
  });

  const path = smoothPath(points);

  return (
    <div className="bg-card ring-border rounded-lg p-3 ring-1">
      <p className="mb-3 text-sm font-medium">Total anual de solicitações ({year})</p>
      <svg viewBox="0 0 760 240" className="h-56 w-full">
        <line x1="38" y1="210" x2="722" y2="210" className="stroke-border" strokeWidth="1" />
        <line x1="38" y1="30" x2="38" y2="210" className="stroke-border" strokeWidth="1" />

        <path
          d={path}
          fill="none"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={totals[index].month}>
            <circle cx={point.x} cy={point.y} r="3" className="fill-primary" />
            <text
              x={point.x}
              y={point.y - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {totals[index].total}
            </text>
          </g>
        ))}

        {totals.map((item, index) => {
          const x = 38 + (684 / Math.max(totals.length - 1, 1)) * index;
          return (
            <text
              key={item.month}
              x={x}
              y="230"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {item.month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function PeriodStatusPercentageChart({
  pending,
  analyzing,
  authorized,
  rejected,
  cancelled,
  total,
}: {
  pending: number;
  analyzing: number;
  authorized: number;
  rejected: number;
  cancelled: number;
  total: number;
}) {
  const safeTotal = Math.max(total, 0);
  const items = [
    {
      key: "analyzing",
      label: "Em análise",
      value: analyzing,
      textClassName: "text-blue-500",
      barClassName: "bg-blue-500",
    },
    {
      key: "authorized",
      label: "Autorizadas",
      value: authorized,
      textClassName: "text-green-500",
      barClassName: "bg-green-500",
    },
    {
      key: "pending",
      label: "Pendentes",
      value: pending,
      textClassName: "text-amber-500",
      barClassName: "bg-amber-500",
    },
    {
      key: "rejected",
      label: "Negadas",
      value: rejected,
      textClassName: "text-red-500",
      barClassName: "bg-red-500",
    },
    {
      key: "cancelled",
      label: "Canceladas",
      value: cancelled,
      textClassName: "text-slate-500",
      barClassName: "bg-slate-500",
    },
  ];

  return (
    <div className="bg-card ring-border rounded-lg p-3 ring-1">
      <p className="mb-3 text-sm font-medium">Percentual por status no período</p>
      <div className="space-y-3">
        {items.map((item) => {
          const percentage = safeTotal > 0 ? (item.value / safeTotal) * 100 : 0;

          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className={`font-medium ${item.textClassName}`}>{item.label}</span>
                <span className="text-muted-foreground">
                  {percentage.toFixed(1)}% ({item.value})
                </span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${item.barClassName}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
