"use client";

import { CalendarDays, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const monthOptions = [
  { value: "all", label: "Ano inteiro" },
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const serviceTypeOptions = [
  { value: "all", label: "Todos" },
  { value: "procedimento", label: "Procedimento (laser)" },
  { value: "exame", label: "Exame (imagem)" },
];

function yearOptions(currentYear: number) {
  return Array.from({ length: 8 }).map((_, index) => {
    const year = currentYear - 5 + index;
    return { value: String(year), label: String(year) };
  });
}

export function DashboardPeriodFilter({
  month,
  year,
  from,
  to,
  serviceType,
}: {
  month: string;
  year: string;
  from?: string;
  to?: string;
  serviceType: "all" | "procedimento" | "exame";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const years = yearOptions(currentYear);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "from" || key === "to") {
      params.delete("month");
      params.delete("year");
    }

    if (key === "month" || key === "year") {
      params.delete("from");
      params.delete("to");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("month");
    params.delete("year");
    params.delete("from");
    params.delete("to");
    params.delete("serviceType");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="bg-card ring-border flex flex-wrap items-center gap-2 rounded-lg p-2 ring-1">
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        <Filter className="size-3.5" />
        Filtro
      </span>

      <Select onValueChange={(value) => updateParam("month", value)} value={month}>
        <SelectTrigger className="w-36" size="sm">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => updateParam("year", value)} value={year}>
        <SelectTrigger className="w-24" size="sm">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        <CalendarDays className="size-3.5" />
        Período
      </span>
      <Input
        className="h-6 w-36"
        onChange={(event) => updateParam("from", event.target.value)}
        type="date"
        value={from ?? ""}
      />
      <Input
        className="h-6 w-36"
        onChange={(event) => updateParam("to", event.target.value)}
        type="date"
        value={to ?? ""}
      />

      <div className="bg-card ring-border inline-flex items-center gap-1 rounded-md p-1 ring-1">
        {serviceTypeOptions.map((item) => (
          <Button
            key={item.value}
            className="h-6 px-2 text-[11px]"
            size="sm"
            type="button"
            variant={serviceType === item.value ? "secondary" : "ghost"}
            onClick={() => updateParam("serviceType", item.value === "all" ? "" : item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Button
        className="h-6"
        onClick={clearFilters}
        size="icon-sm"
        type="button"
        variant="ghost"
        aria-label="Limpar filtros"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
