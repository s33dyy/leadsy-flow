import { useState } from "react";
import {
  Search, User, Building2, Plug, Brain, Bot, Bell, Facebook, MessageSquare,
  Chrome, Server, ExternalLink, Check, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const groups = [
  { id: "profile",       label: "Profile",        icon: User },
  { id: "workspace",     label: "Workspace",      icon: Building2 },
  { id: "integrations",  label: "Integrations",   icon: Plug },
  { id: "ai",            label: "AI",             icon: Brain },
  { id: "workers",       label: "Workers",        icon: Bot },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "meta",          label: "Meta",           icon: Facebook },
  { id: "whatsapp",      label: "WhatsApp",       icon: MessageSquare },
  { id: "extension",     label: "Extension",      icon: Chrome },
  { id: "infrastructure",label: "Infrastructure", icon: Server },
] as const;

export default function Settings() {
  const [active, setActive] = useState<(typeof groups)[number]["id"]>("infrastructure");
  const [query, setQuery] = useState("");
  const visible = groups.filter(g => g.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-px bg-border">
      <aside className="col-span-12 min-h-0 overflow-y-auto bg-background md:col-span-3 xl:col-span-2">
        <div className="border-b border-border p-3">
          <div className="flex h-7 items-center gap-2 rounded-[5px] border border-border bg-surface-2 px-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search settings…" className="h-full flex-1 bg-transparent text-[12px] outline-none" />
          </div>
        </div>
        <nav className="p-2">
          {visible.map((g) => (
            <button key={g.id} onClick={() => setActive(g.id)}
              className={cn("nav-item w-full", active === g.id && "bg-sidebar-accent text-foreground")}>
              <g.icon className="nav-icon" />
              <span className="flex-1 text-left">{g.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="col-span-12 min-h-0 overflow-y-auto bg-background md:col-span-9 xl:col-span-10">
        <div className="mx-auto max-w-3xl p-6">
          {active === "infrastructure" ? <InfraAutomation /> : <GenericSection id={active} />}
        </div>
      </section>
    </div>
  );
}

function GenericSection({ id }: { id: string }) {
  const g = groups.find(g => g.id === id)!;
  return (
    <div>
      <div className="caption">Settings</div>
      <h1 className="mt-1 text-[22px] tracking-tight">{g.label}</h1>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">Configure {g.label.toLowerCase()} for your workspace.</p>
      <ul className="mt-6 divide-y divide-border rounded-[6px] border border-border">
        {["Defaults", "Permissions", "Audit log"].map((row) => (
          <li key={row} className="flex items-center justify-between px-4 py-3 text-[13px] hover:bg-surface-2">
            <span>{row}</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfraAutomation() {
  const stats = [
    { k: "n8n URL",            v: <a className="inline-flex items-center gap-1 text-primary hover:underline" href="#">n8n.helio.internal <ExternalLink className="h-3 w-3" /></a> },
    { k: "Health",             v: <span className="inline-flex items-center gap-1.5 text-primary"><span className="dot bg-primary pulse-dot" /> Healthy</span> },
    { k: "Workflow count",     v: <span className="font-mono">27</span> },
    { k: "Last execution",     v: <span className="font-mono">12s ago</span> },
    { k: "Failed (24h)",       v: <span className="font-mono text-destructive">3</span> },
    { k: "Queue",              v: <span className="font-mono">4 waiting · 1 running</span> },
  ];
  return (
    <div>
      <div className="caption">Settings · Infrastructure</div>
      <h1 className="mt-1 text-[22px] tracking-tight">Automation</h1>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">Health and links for the n8n automation layer powering routing, escalations and outreach.</p>

      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-border bg-border md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.k} className="bg-background p-4">
            <div className="caption">{s.k}</div>
            <div className="mt-1.5 text-[13px]">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium">Recent executions</h2>
          <a className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground">
            Open dashboard <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <ul className="mt-3 divide-y divide-border rounded-[6px] border border-border">
          {[
            ["wf_route_lead",         "ok",   "12s",  "Lead routed to Iris"],
            ["wf_escalate_p0",        "ok",   "1m",   "Escalation sent to #ops-leads"],
            ["wf_whatsapp_dispatch",  "fail", "4m",   "Template not approved · WA-001"],
            ["wf_enrich_company",     "ok",   "9m",   "8 companies enriched"],
            ["wf_qualify_recheck",    "ok",   "22m",  "Re-qualified 17 leads"],
          ].map(([wf, st, ago, msg]) => (
            <li key={`${wf}-${ago}`} className="grid grid-cols-12 items-center gap-2 px-3 py-2.5 text-[12px]">
              <span className="col-span-4 font-mono">{wf}</span>
              <span className="col-span-2 inline-flex items-center gap-1.5">
                <span className={cn("dot", st === "ok" ? "bg-primary" : "bg-destructive")} />
                <span className="font-mono text-[10.5px] text-muted-foreground">{st}</span>
              </span>
              <span className="col-span-2 font-mono text-[10.5px] text-muted-foreground">{ago}</span>
              <span className="col-span-3 truncate text-muted-foreground">{msg}</span>
              <a className="col-span-1 justify-self-end text-muted-foreground hover:text-foreground"><ExternalLink className="h-3 w-3" /></a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-[6px] border border-border p-4">
        <div className="flex items-center gap-2 text-[12.5px]">
          <Check className="h-3.5 w-3.5 text-primary" />
          <span>Health checks pass · last verified 12s ago</span>
        </div>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          Configure thresholds, alert routing and on-call handoff in Notifications → Infrastructure.
        </p>
      </div>
    </div>
  );
}
