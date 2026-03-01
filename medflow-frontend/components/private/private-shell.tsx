"use client";

import Link from "next/link";
import {
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Rows3,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/solicitacoes",
    label: "Solicitações",
    icon: Rows3,
  },
  {
    href: "/pacientes",
    label: "Pacientes",
    icon: Users,
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/solicitacoes": "Solicitações",
  "/pacientes": "Pacientes",
  "/perfil": "Perfil",
  "/configuracao": "Configuração",
};

export function PrivateShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem("medauth-theme") === "dark"
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("medauth-theme", theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  }

  const currentTitle =
    Object.entries(pageTitles).find(([route]) => pathname.startsWith(route))?.[1] ??
    "MedAuth";

  return (
    <div className="flex min-h-screen w-full">
      <aside
        data-collapsed={collapsed}
        className={cn(
          "bg-card ring-border sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r p-2 transition-all duration-200 md:flex md:flex-col",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div
          className={cn(
            "mb-3 flex items-center px-1",
            collapsed ? "justify-center" : "justify-end"
          )}
        >
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {collapsed ? <Menu className="size-5" /> : <X className="size-5" />}
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                asChild
                className={cn("justify-start", collapsed && "justify-center px-0")}
                size="sm"
                variant={isActive ? "secondary" : "outline"}
              >
                <Link href={item.href}>
                  <Icon />
                  <span className={cn(collapsed && "sr-only")}>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="mt-auto pt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn("w-full", collapsed ? "justify-center px-0" : "justify-between")}
                size="sm"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <User />
                  <span className={cn(collapsed && "sr-only")}>Perfil</span>
                </span>
                <ChevronUp className={cn(collapsed && "sr-only")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuItem asChild>
                <Link href="/perfil">
                  <User />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracao">
                  <Settings />
                  Configuração
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild variant="destructive">
                <Link href="/login">
                  <LogOut />
                  Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <header className="bg-card ring-border flex h-14 items-center justify-between rounded-lg px-4 ring-1">
          <div className="flex items-center gap-2">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setCollapsed((prev) => !prev)}
              className="md:hidden"
              aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {collapsed ? <Menu className="size-5" /> : <X className="size-5" />}
            </Button>
            <h2 className="text-sm font-semibold">{currentTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Clínica</span>
            <Button
              size="icon-sm"
              type="button"
              variant="outline"
              onClick={toggleTheme}
              aria-label="Alternar modo claro/escuro"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
