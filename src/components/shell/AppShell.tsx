import { Outlet, NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Users2, Bot, CheckSquare, MessageSquare, ListChecks,
  Plug, Settings as SettingsIcon, Search, Command, Plus, ChevronDown,
  PanelLeftClose, PanelLeftOpen, Bell, ChevronsUpDown, Activity, LogOut, Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useWorkspace } from "@/lib/workspace-context";
import { supabase } from "@/integrations/supabase/client";
import { initials } from "@/lib/format";

const nav = [
  { to: "/app",                label: "Dashboard",     icon: LayoutDashboard, end: true,  hint: "G D" },
  { to: "/app/leads",          label: "CRM",           icon: Users2,           hint: "G L", table: "leads" },
  { to: "/app/workers",        label: "Workers",       icon: Bot,              hint: "G W", live: true, table: "workers" },
  { to: "/app/approvals",      label: "Approvals",     icon: CheckSquare,      hint: "G A", accent: true, table: "approvals", pendingOnly: true },
  { to: "/app/communications", label: "Communications",icon: MessageSquare,    hint: "G C", table: "conversations" },
  { to: "/app/tasks",          label: "Tasks",         icon: ListChecks,       hint: "G T", table: "tasks" },
  { to: "/app/integrations",   label: "Integrations",  icon: Plug,             hint: "G I" },
  { to: "/app/settings",       label: "Settings",      icon: SettingsIcon,     hint: "G S" },
] as const;

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { profile, user, signOut } = useAuth();
  const { workspaces, current, setCurrentId, loading } = useWorkspace();
  const nav2 = useNavigate();
  const [wsOpen, setWsOpen] = useState(false);

  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    (async () => {
      const counters: Record<string, number> = {};
      for (const item of nav) {
        if (!("table" in item) || !item.table) continue;
        let q: any = supabase.from(item.table).select("*", { count: "exact", head: true }).eq("workspace_id", current.id);
        if (item.pendingOnly) q = q.eq("status", "pending");
        const { count } = await q;
        counters[item.to] = count ?? 0;
      }
      if (!cancelled) setCounts(counters);
    })();
    return () => { cancelled = true; };
  }, [current?.id]);

  async function handleSignOut() {
    await signOut();
    nav2("/login", { replace: true });
  }

  if (loading || !current) {
    return (
      <div className="grid h-screen place-items-center bg-background text-[12.5px] text-muted-foreground">
        <span className="font-mono">loading workspace…</span>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email || "Operator";
  const userInitials = initials(profile?.full_name || user?.email);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-[54px]" : "w-[232px]"
      )}>
        {/* Workspace switcher */}
        <div className="relative flex h-11 items-center gap-2 border-b border-sidebar-border px-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <span className="font-mono text-[11px] font-semibold">L</span>
          </div>
          {!collapsed && (
            <>
              <button onClick={() => setWsOpen(o => !o)} className="group flex flex-1 items-center justify-between rounded-[5px] px-1.5 py-1 hover:bg-sidebar-accent">
                <div className="flex flex-col items-start leading-tight">
                  <span className="truncate text-[12.5px] font-medium max-w-[140px]">{current.name}</span>
                  <span className="text-[10.5px] text-muted-foreground capitalize">{current.role}</span>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
              </button>
              {wsOpen && (
                <div className="absolute left-2 right-2 top-12 z-50 rounded-[6px] border border-border bg-popover p-1 shadow-lg">
                  {workspaces.map(w => (
                    <button key={w.id} onClick={() => { setCurrentId(w.id); setWsOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left text-[12px] hover:bg-surface-2">
                      <span className="truncate flex-1">{w.name}</span>
                      {w.id === current.id && <Check className="h-3 w-3 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!collapsed && (
          <div className="px-2.5 pt-2.5">
            <button className="flex h-7 w-full items-center gap-2 rounded-[5px] border border-sidebar-border bg-background/40 px-2 text-left text-[12px] text-muted-foreground hover:bg-sidebar-accent">
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1">Quick search</span>
              <span className="kbd"><Command className="h-2.5 w-2.5" />K</span>
            </button>
          </div>
        )}

        {!collapsed && (
          <div className="px-2.5 pt-1.5">
            <Link to="/app/leads" className="flex h-7 w-full items-center gap-2 rounded-[5px] px-2 text-[12.5px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
              <Plus className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">New lead</span>
              <span className="kbd">N</span>
            </Link>
          </div>
        )}

        <nav className="mt-3 flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
          {!collapsed && <div className="caption px-2 pb-1 pt-1.5">Workflow</div>}
          {nav.map((n) => {
            const count = counts[n.to];
            return (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => cn(
                  "nav-item",
                  isActive && "bg-sidebar-accent text-foreground",
                  collapsed && "justify-center px-0"
                )}>
                <n.icon className="nav-icon" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{n.label}</span>
                    {"live" in n && n.live && <span className="dot bg-primary pulse-dot" />}
                    {typeof count === "number" && count > 0 && (
                      <span className={cn(
                        "font-mono text-[10.5px]",
                        "accent" in n && n.accent ? "rounded-[3px] bg-primary/15 px-1 text-primary" : "text-muted-foreground"
                      )}>
                        {count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <div className={cn("flex items-center gap-2 rounded-[5px] p-1.5", collapsed && "justify-center")}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-3 font-mono text-[10.5px] text-foreground">
              {userInitials}
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-1 flex-col leading-tight min-w-0">
                  <span className="truncate text-[12px]">{userName}</span>
                  <span className="truncate text-[10.5px] text-muted-foreground capitalize">{current.role} · {current.name}</span>
                </div>
                <button title="Sign out" onClick={handleSignOut} className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "mt-1 flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-[12px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              collapsed && "justify-center px-0"
            )}>
            {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            {!collapsed && <span>Collapse</span>}
            {!collapsed && <span className="kbd ml-auto">[</span>}
          </button>
        </div>
      </aside>

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
