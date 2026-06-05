import { activity, approvals, workers } from "@/lib/demo-data";
import { ArrowRight, ArrowUpRight, Bot, CheckSquare, Sparkles, MessageSquare, ListChecks, Users2, Activity as ActivityIcon } from "lucide-react";
import { Link } from "react-router-dom";

const metrics = [
  { label: "New leads · 24h", value: 38, delta: "+12", to: "/app/leads", icon: Users2 },
  { label: "Qualified · 24h", value: 14, delta: "+4",  to: "/app/leads", icon: Sparkles },
  { label: "Escalations",     value: 3,  delta: "0",   to: "/app/approvals", icon: ArrowUpRight, accent: true },
  { label: "Active tasks",    value: 47, delta: "−6",  to: "/app/tasks", icon: ListChecks },
  { label: "Worker activity", value: 4,  delta: "live", to: "/app/workers", icon: Bot, live: true },
  { label: "Pending approvals", value: 7, delta: "+2",  to: "/app/approvals", icon: CheckSquare, accent: true },
];

const funnel = [
  { stage: "Captured",   v: 412 },
  { stage: "Researched", v: 318 },
  { stage: "Qualified",  v: 184 },
  { stage: "Engaged",    v: 96 },
  { stage: "Converted",  v: 31 },
];

const sources = [
  { src: "Instagram", v: 38, color: "hsl(213 94% 68%)" },
  { src: "WhatsApp",  v: 27, color: "hsl(152 76% 56%)" },
  { src: "Meta Ads",  v: 18, color: "hsl(280 80% 70%)" },
  { src: "Extension", v: 11, color: "hsl(36 96% 60%)" },
  { src: "Referral",  v: 6,  color: "hsl(0 70% 65%)" },
];

export default function Dashboard() {
  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-px bg-border">
      {/* Center workspace */}
      <div className="col-span-12 overflow-y-auto bg-background xl:col-span-9">
        <div className="p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="caption">Operator overview</div>
              <h1 className="mt-1 text-[22px] tracking-tight">Good morning, Iris.</h1>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                7 items need your eyes · 4 workers running · pipeline is healthy.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="h-7 rounded-[5px] border border-border bg-surface-2 px-2.5 text-[12px] hover:bg-surface-3">Today</button>
              <button className="h-7 rounded-[5px] px-2.5 text-[12px] text-muted-foreground hover:bg-surface-2">7d</button>
              <button className="h-7 rounded-[5px] px-2.5 text-[12px] text-muted-foreground hover:bg-surface-2">30d</button>
            </div>
          </div>

          {/* Metrics grid — no nested cards, hairline-separated */}
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
            {metrics.map((m) => (
              <Link key={m.label} to={m.to} className="group bg-background p-3.5 transition-colors hover:bg-surface-2">
                <div className="flex items-center justify-between">
                  <m.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                  <span className={`font-mono text-[10.5px] ${m.accent ? "text-primary" : "text-muted-foreground"}`}>
                    {m.live ? "live" : m.delta}
                  </span>
                </div>
                <div className="mt-2 font-mono text-[24px] tracking-tight">{m.value}</div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">{m.label}</div>
              </Link>
            ))}
          </div>

          {/* Funnel + sources */}
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-border bg-border lg:grid-cols-5">
            <div className="bg-background p-4 lg:col-span-3">
              <div className="flex items-center justify-between">
                <div className="caption">Qualification funnel · 7d</div>
                <Link to="/app/leads" className="text-[11.5px] text-muted-foreground hover:text-foreground">Open CRM →</Link>
              </div>
              <div className="mt-4 space-y-2.5">
                {funnel.map((f, i) => {
                  const pct = (f.v / funnel[0].v) * 100;
                  const conv = i === 0 ? null : Math.round((f.v / funnel[i - 1].v) * 100);
                  return (
                    <div key={f.stage} className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-2 text-[12px] text-muted-foreground">{f.stage}</div>
                      <div className="relative col-span-8 h-5 overflow-hidden rounded-[4px] bg-surface-2">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/80"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative flex h-full items-center justify-end pr-2 font-mono text-[10.5px] text-foreground/80">
                          {f.v}
                        </div>
                      </div>
                      <div className="col-span-2 text-right font-mono text-[10.5px] text-muted-foreground">
                        {conv === null ? "—" : `${conv}%`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-background p-4 lg:col-span-2">
              <div className="caption">Lead sources · 7d</div>
              <div className="mt-4 space-y-2.5">
                {sources.map((s) => (
                  <div key={s.src} className="flex items-center gap-3">
                    <span className="dot" style={{ background: s.color }} />
                    <span className="flex-1 text-[12.5px]">{s.src}</span>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full" style={{ width: `${s.v * 2}%`, background: s.color }} />
                    </div>
                    <span className="w-8 text-right font-mono text-[10.5px] text-muted-foreground">{s.v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Worker throughput + recent activity */}
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-border bg-border lg:grid-cols-2">
            <div className="bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="caption">Worker throughput · last hour</div>
                <Link to="/app/workers" className="text-[11.5px] text-muted-foreground hover:text-foreground">Open workers →</Link>
              </div>
              <div className="mt-4 space-y-2">
                {workers.slice(0, 5).map((w) => (
                  <div key={w.id} className="flex items-center gap-3">
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="w-44 truncate font-mono text-[12px]">{w.name}</span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="absolute inset-y-0 left-0 bg-primary/80" style={{ width: `${w.successRate}%` }} />
                    </div>
                    <span className="w-10 text-right font-mono text-[10.5px] text-muted-foreground">{w.output}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="caption">Recent activity</div>
                <span className="flex items-center gap-1 font-mono text-[10.5px] text-muted-foreground">
                  <ActivityIcon className="h-3 w-3 text-primary" /> streaming
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-baseline gap-3 text-[12.5px]">
                    <span className="w-10 shrink-0 font-mono text-[10.5px] text-muted-foreground">{a.time}</span>
                    <span className="text-foreground"><span className="text-muted-foreground">{a.actor}</span> {a.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right context — Approvals queue */}
      <aside className="col-span-12 overflow-y-auto bg-background xl:col-span-3">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="caption">Needs you</div>
            <Link to="/app/approvals" className="text-[11.5px] text-muted-foreground hover:text-foreground">All →</Link>
          </div>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{approvals.length} items pending across {new Set(approvals.map(a => a.worker)).size} workers.</p>
        </div>
        <ul className="divide-y divide-border">
          {approvals.map((a) => (
            <li key={a.id} className="p-4 hover:bg-surface-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[10.5px] ${a.priority === "P0" ? "text-destructive" : a.priority === "P1" ? "text-warning" : "text-muted-foreground"}`}>{a.priority}</span>
                  <span className="caption">{a.kind}</span>
                </div>
                <span className="font-mono text-[10.5px] text-muted-foreground">{a.createdAt}</span>
              </div>
              <div className="mt-1.5 text-[12.5px] font-medium">{a.subject}</div>
              <p className="mt-1 line-clamp-2 text-[11.5px] text-muted-foreground">{a.preview}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <button className="h-6 rounded-[4px] bg-primary px-2 text-[11px] font-medium text-primary-foreground hover:bg-primary/90">Approve</button>
                <button className="h-6 rounded-[4px] border border-border px-2 text-[11px] hover:bg-surface-3">Edit</button>
                <button className="h-6 rounded-[4px] px-2 text-[11px] text-muted-foreground hover:bg-surface-3">Reject</button>
                <Link to="/app/approvals" className="ml-auto text-muted-foreground hover:text-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
