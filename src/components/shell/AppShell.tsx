import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users2, BookOpen, Bot, CheckSquare, MessageSquare, ListChecks,
  Plug, Settings as SettingsIcon, Search, Command, Plus, ChevronDown, PanelLeftClose,
  PanelLeftOpen, Bell, ChevronsUpDown, Activity
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app",                label: "Dashboard",     icon: LayoutDashboard, end: true,  hint: "G D" },
  { to: "/app/leads",          label: "CRM",           icon: Users2,           hint: "G L", count: 142 },
  { to: "/app/workers",        label: "Workers",       icon: Bot,              hint: "G W", live: true },
  { to: "/app/approvals",      label: "Approvals",     icon: CheckSquare,      hint: "G A", count: 7, accent: true },
  { to: "/app/communications", label: "Communications",icon: MessageSquare,    hint: "G C", count: 3 },
  { to: "/app/tasks",          label: "Tasks",         icon: ListChecks,       hint: "G T" },
  { to: "/app/integrations",   label: "Integrations",  icon: Plug,             hint: "G I" },
  { to: "/app/settings",       label: "Settings",      icon: SettingsIcon,     hint: "G S" },
];

const knowledgeShortcuts = [
  { label: "ICP & playbooks",       count: 12 },
  { label: "Recent AI findings",    count: 38 },
  { label: "Snippets",              count: 24 },
];

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const loc = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* LEFT — Sidebar */}
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
          collapsed ? "w-[54px]" : "w-[232px]"
        )}
      >
        {/* Workspace switcher */}
        <div className="flex h-11 items-center gap-2 border-b border-sidebar-border px-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <span className="font-mono text-[11px] font-semibold">L</span>
          </div>
          {!collapsed && (
            <button className="group flex flex-1 items-center justify-between rounded-[5px] px-1.5 py-1 hover:bg-sidebar-accent">
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[12.5px] font-medium">Leadsy</span>
                <span className="text-[10.5px] text-muted-foreground">Helio · Operations</span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
            </button>
          )}
        </div>

        {/* Search / cmd-k */}
        {!collapsed && (
          <div className="px-2.5 pt-2.5">
            <button className="flex h-7 w-full items-center gap-2 rounded-[5px] border border-sidebar-border bg-background/40 px-2 text-left text-[12px] text-muted-foreground hover:bg-sidebar-accent">
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1">Quick search</span>
              <span className="kbd"><Command className="h-2.5 w-2.5" />K</span>
            </button>
          </div>
        )}

        {/* New */}
        {!collapsed && (
          <div className="px-2.5 pt-1.5">
            <button className="flex h-7 w-full items-center gap-2 rounded-[5px] px-2 text-[12.5px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
              <Plus className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">New lead</span>
              <span className="kbd">N</span>
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="mt-3 flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
          {!collapsed && <div className="caption px-2 pb-1 pt-1.5">Workflow</div>}
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "nav-item",
                  isActive && "bg-sidebar-accent text-foreground",
                  collapsed && "justify-center px-0"
                )
              }
            >
              <n.icon className="nav-icon" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{n.label}</span>
                  {n.live && <span className="dot bg-primary pulse-dot" />}
                  {typeof n.count === "number" && (
                    <span className={cn(
                      "font-mono text-[10.5px]",
                      n.accent ? "rounded-[3px] bg-primary/15 px-1 text-primary" : "text-muted-foreground"
                    )}>
                      {n.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {!collapsed && (
            <>
              <div className="caption mt-4 px-2 pb-1">Knowledge</div>
              {knowledgeShortcuts.map((k) => (
                <button key={k.label} className="nav-item">
                  <BookOpen className="nav-icon" />
                  <span className="flex-1 truncate text-left">{k.label}</span>
                  <span className="font-mono text-[10.5px] text-muted-foreground">{k.count}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2">
          <div className={cn("flex items-center gap-2 rounded-[5px] p-1.5 hover:bg-sidebar-accent",
                              collapsed && "justify-center")}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-3 font-mono text-[10.5px] text-foreground">
              IC
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-1 flex-col leading-tight">
                  <span className="text-[12px]">Iris Chen</span>
                  <span className="text-[10.5px] text-muted-foreground">Admin · Helio</span>
                </div>
                <button className="rounded p-1 text-muted-foreground hover:bg-background">
                  <Bell className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "mt-1 flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-[12px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            {!collapsed && <span>Collapse</span>}
            {!collapsed && <span className="kbd ml-auto">[</span>}
          </button>
        </div>
      </aside>

      {/* CENTER + RIGHT — page renders its own columns */}
      <main className="flex h-full min-w-0 flex-1 flex-col">
        <PageTopbar />
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function PageTopbar() {
  const loc = useLocation();
  const title = pageTitle(loc.pathname);
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/80 bg-background px-3">
      <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
        <span>Leadsy</span>
        <span className="opacity-40">/</span>
        <span className="text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2 py-1 font-mono text-[10.5px] text-muted-foreground">
          <Activity className="h-3 w-3 text-primary" />
          <span>4 workers running</span>
          <span className="opacity-40">·</span>
          <span>queue 82</span>
        </div>
        <button className="flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2 text-[12px] hover:bg-surface-3">
          <span>Filter</span><ChevronDown className="h-3 w-3 opacity-60" />
        </button>
        <button className="flex h-7 items-center gap-1.5 rounded-[5px] bg-primary px-2 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3 w-3" /> New
        </button>
      </div>
    </div>
  );
}

function pageTitle(path: string) {
  if (path === "/app") return "Dashboard";
  if (path.startsWith("/app/leads")) return "CRM";
  if (path.startsWith("/app/workers")) return "Workers";
  if (path.startsWith("/app/approvals")) return "Approvals";
  if (path.startsWith("/app/communications")) return "Communications";
  if (path.startsWith("/app/tasks")) return "Tasks";
  if (path.startsWith("/app/integrations")) return "Integrations";
  if (path.startsWith("/app/settings")) return "Settings";
  return "App";
}
