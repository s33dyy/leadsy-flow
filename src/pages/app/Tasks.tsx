import { useState } from "react";
import { tasks, type TaskItem } from "@/lib/demo-data";
import { Search, Filter, Sparkles, User, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const groupings = ["Status", "Priority", "Owner"] as const;

export default function Tasks() {
  const [grouping, setGrouping] = useState<(typeof groupings)[number]>("Status");
  const grouped = groupBy(tasks, grouping);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-3">
        <div className="flex items-center gap-1.5">
          <span className="caption">Group by</span>
          {groupings.map((g) => (
            <button key={g} onClick={() => setGrouping(g)}
              className={cn("h-7 rounded-[5px] px-2 text-[12px]",
                grouping === g ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:bg-surface-2")}>
              {g}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <input placeholder="Filter…" className="h-full w-40 bg-transparent text-[12px] outline-none" />
          </div>
          <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2"><Filter className="h-3 w-3" /></button>
          <button className="h-7 rounded-[5px] bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">+ Task</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([groupName, items]) => (
          <section key={groupName}>
            <div className="sticky top-0 z-10 flex h-8 items-center gap-2 border-y border-border bg-surface px-3">
              <span className="text-[12px] font-medium">{groupName}</span>
              <span className="font-mono text-[10.5px] text-muted-foreground">{items.length}</span>
              <button className="ml-auto text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
            </div>
            <ul>
              {items.map((t) => <TaskRow key={t.id} t={t} />)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function TaskRow({ t }: { t: TaskItem }) {
  return (
    <li className="grid grid-cols-12 items-center gap-3 border-b border-border/70 px-3 py-2 hover:bg-surface-2">
      <div className="col-span-6 flex items-center gap-2 min-w-0">
        <input type="checkbox" defaultChecked={t.status === "Done"} className="h-3.5 w-3.5 accent-primary" />
        <span className="font-mono text-[10.5px] text-muted-foreground">{t.id}</span>
        <PriorityDot p={t.priority} />
        <span className={cn("truncate text-[12.5px]", t.status === "Done" && "text-muted-foreground line-through")}>
          {t.title}
        </span>
        {t.source === "AI" && (
          <span className="inline-flex items-center gap-1 rounded-[3px] bg-primary/10 px-1.5 font-mono text-[10px] text-primary">
            <Sparkles className="h-2.5 w-2.5" /> AI
          </span>
        )}
        {t.approval === "Pending" && (
          <span className="rounded-[3px] bg-warning/10 px-1.5 font-mono text-[10px] text-warning">approval</span>
        )}
      </div>
      <div className="col-span-2 text-[11.5px] text-muted-foreground">{t.status}</div>
      <div className="col-span-2 flex items-center gap-1.5 text-[11.5px]">
        <div className="grid h-5 w-5 place-items-center rounded-full bg-surface-3 font-mono text-[10px]">{t.ownerInitials}</div>
        <span className="text-muted-foreground">{t.owner}</span>
      </div>
      <div className="col-span-2 text-right font-mono text-[10.5px] text-muted-foreground">{t.due}</div>
    </li>
  );
}

function PriorityDot({ p }: { p: TaskItem["priority"] }) {
  const map: Record<TaskItem["priority"], string> = {
    Urgent: "bg-destructive",
    High: "bg-warning",
    Medium: "bg-info",
    Low: "bg-muted-foreground/50",
  };
  return <span className={cn("dot", map[p])} title={p} />;
}

function groupBy(items: TaskItem[], by: "Status" | "Priority" | "Owner") {
  const out: Record<string, TaskItem[]> = {};
  const order = by === "Status" ? ["In progress", "Todo", "Blocked", "Done"]
              : by === "Priority" ? ["Urgent", "High", "Medium", "Low"]
              : [];
  for (const t of items) {
    const k = by === "Status" ? t.status : by === "Priority" ? t.priority : t.owner;
    (out[k] ||= []).push(t);
  }
  if (order.length) {
    const ordered: Record<string, TaskItem[]> = {};
    for (const k of order) if (out[k]) ordered[k] = out[k];
    return ordered;
  }
  return out;
}
