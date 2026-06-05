import { useState } from "react";
import { workers, type Worker } from "@/lib/demo-data";
import { Bot, Play, Pause, MoreHorizontal, ExternalLink, RefreshCw, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["All", "Running", "Pending", "Failed", "Paused"] as const;

export default function Workers() {
  const [activeId, setActiveId] = useState(workers[0].id);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = workers.filter(w =>
    tab === "All" ? true :
    tab === "Running" ? w.status === "Running" :
    tab === "Pending" ? w.approval === "Required" :
    tab === "Failed" ? w.status === "Failed" :
    w.status === "Paused"
  );

  const active = workers.find(w => w.id === activeId) ?? workers[0];

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-px bg-border">
      {/* Table */}
      <section className="col-span-12 flex min-h-0 flex-col bg-background xl:col-span-8">
        <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "h-7 rounded-[5px] px-2.5 text-[12px]",
                tab === t ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:bg-surface-2"
              )}
            >
              {t}
              <span className="ml-1.5 font-mono text-[10.5px] text-muted-foreground">
                {t === "All" ? workers.length :
                 t === "Running" ? workers.filter(w => w.status === "Running").length :
                 t === "Pending" ? workers.filter(w => w.approval === "Required").length :
                 t === "Failed" ? workers.filter(w => w.status === "Failed").length :
                 workers.filter(w => w.status === "Paused").length}
              </span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <button className="h-7 rounded-[5px] border border-border bg-surface-2 px-2 text-[12px] hover:bg-surface-3 inline-flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3" /> 12s
            </button>
            <button className="h-7 rounded-[5px] bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
              + Worker
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-background">
              <tr className="border-b border-border text-left text-muted-foreground">
                <Th>Worker</Th>
                <Th>Kind</Th>
                <Th>Status</Th>
                <Th right>Queue</Th>
                <Th right>Output</Th>
                <Th right>Success</Th>
                <Th>Last run</Th>
                <Th>Approval</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr
                  key={w.id}
                  onClick={() => setActiveId(w.id)}
                  className={cn(
                    "cursor-pointer border-b border-border/70 hover:bg-surface-2",
                    activeId === w.id && "bg-surface-2"
                  )}
                >
                  <Td>
                    <div className="flex items-center gap-2">
                      <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono">{w.name}</span>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground">{w.kind}</Td>
                  <Td><StatusPill s={w.status} /></Td>
                  <Td right><span className="font-mono">{w.queue}</span></Td>
                  <Td right><span className="font-mono">{w.output}</span></Td>
                  <Td right>
                    <div className="ml-auto flex w-28 items-center gap-2">
                      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
                        <div className="absolute inset-y-0 left-0 bg-primary/80" style={{ width: `${w.successRate}%` }} />
                      </div>
                      <span className="font-mono text-muted-foreground">{w.successRate}%</span>
                    </div>
                  </Td>
                  <Td className="font-mono text-muted-foreground">{w.lastRun}</Td>
                  <Td>
                    <span className={cn(
                      "rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px]",
                      w.approval === "Required" && "bg-primary/10 text-primary",
                      w.approval === "Auto" && "bg-surface-3 text-muted-foreground",
                      w.approval === "Manual" && "bg-warning/10 text-warning"
                    )}>{w.approval}</span>
                  </Td>
                  <Td><MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Side panel */}
      <aside className="col-span-12 min-h-0 overflow-y-auto bg-background xl:col-span-4">
        <div className="border-b border-border px-4 py-3">
          <div className="caption">Worker</div>
          <h2 className="mt-1 font-mono text-[15px]">{active.name}</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{active.kind} · approval: {active.approval}</p>
          <div className="mt-3 flex items-center gap-1.5">
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
              {active.status === "Running" ? <><Pause className="h-3 w-3" />Pause</> : <><Play className="h-3 w-3" />Run</>}
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2.5 text-[12px] hover:bg-surface-3">
              <Settings2 className="h-3 w-3" /> Configure
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2.5 text-[12px] hover:bg-surface-3">
              <ExternalLink className="h-3 w-3" /> Logs
            </button>
          </div>
        </div>

        <div className="border-b border-border p-4">
          <div className="caption">Runs · last hour</div>
          <div className="mt-3 flex items-end gap-0.5">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 20 + ((i * 37) % 80);
              const fail = i % 13 === 0;
              return <div key={i} className={cn("w-1.5 rounded-sm", fail ? "bg-destructive/80" : "bg-primary/70")} style={{ height: `${h}%` }} />;
            })}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10.5px] text-muted-foreground">
            <span>60m ago</span><span>now</span>
          </div>
        </div>

        <div className="border-b border-border p-4">
          <div className="caption">Recent runs</div>
          <ul className="mt-2 divide-y divide-border rounded-[6px] border border-border">
            {[
              ["#9412", "ok", "12s", "added 4 items"],
              ["#9411", "ok", "44s", "added 12 items"],
              ["#9410", "fail", "1m", "rate-limit on meta-api"],
              ["#9409", "ok", "2m", "qualified 3 leads"],
              ["#9408", "ok", "3m", "enriched 8 companies"],
            ].map(([id, st, ago, msg]) => (
              <li key={id} className="flex items-center gap-3 px-3 py-2 text-[12px]">
                <span className="font-mono text-muted-foreground">{id}</span>
                <span className={cn("dot", st === "ok" ? "bg-primary" : "bg-destructive")} />
                <span className="font-mono text-[10.5px] text-muted-foreground">{ago}</span>
                <span className="truncate text-foreground/90">{msg}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return <th className={cn("h-9 px-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]", right && "text-right")}>{children}</th>;
}
function Td({ children, right, className }: { children?: React.ReactNode; right?: boolean; className?: string }) {
  return <td className={cn("h-10 px-3 align-middle", right && "text-right", className)}>{children}</td>;
}
function StatusPill({ s }: { s: Worker["status"] }) {
  const map: Record<Worker["status"], string> = {
    Running: "text-primary bg-primary/10",
    Idle:    "text-muted-foreground bg-surface-3",
    Failed:  "text-destructive bg-destructive/10",
    Paused:  "text-warning bg-warning/10",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px]", map[s])}>
      <span className={cn("dot",
        s === "Running" && "bg-primary pulse-dot",
        s === "Idle" && "bg-muted-foreground/50",
        s === "Failed" && "bg-destructive",
        s === "Paused" && "bg-warning")} />
      {s}
    </span>
  );
}
