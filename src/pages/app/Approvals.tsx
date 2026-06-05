import { useState } from "react";
import { approvals } from "@/lib/demo-data";
import { Check, X, Pencil, ArrowUpRight, Search, Filter, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const kinds = ["All", "Research", "Tasks", "Notes", "Drafts", "Outreach"] as const;

export default function Approvals() {
  const [tab, setTab] = useState<(typeof kinds)[number]>("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState(approvals[0].id);

  const filtered = approvals.filter(a =>
    tab === "All" ? true :
    tab === "Drafts" ? a.kind === "Draft" :
    tab === "Tasks" ? a.kind === "Task" :
    tab === "Notes" ? a.kind === "Note" :
    tab === "Research" ? a.kind === "Research" :
    a.kind === "Outreach"
  );

  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const open = approvals.find(a => a.id === openId) ?? approvals[0];

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-px bg-border">
      <section className="col-span-12 flex min-h-0 flex-col bg-background xl:col-span-7">
        <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-3">
          {kinds.map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className={cn("h-7 rounded-[5px] px-2.5 text-[12px]",
                tab === k ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:bg-surface-2")}>
              {k}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2">
              <Search className="h-3 w-3 text-muted-foreground" />
              <input placeholder="Search approvals…" className="h-full w-44 bg-transparent text-[12px] outline-none" />
            </div>
            <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2"><Filter className="h-3 w-3" /></button>
          </div>
        </div>

        {/* Bulk action bar */}
        <div className={cn(
          "flex h-10 shrink-0 items-center gap-2 border-b border-border px-3 text-[12px]",
          selected.length > 0 ? "bg-primary/5" : "bg-background"
        )}>
          <input type="checkbox" checked={allSelected}
            onChange={() => setSelected(allSelected ? [] : filtered.map(f => f.id))}
            className="h-3.5 w-3.5 accent-primary" />
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{filtered.length} pending · select to act in bulk</span>
          ) : (
            <>
              <span className="font-mono text-primary">{selected.length} selected</span>
              <span className="opacity-40">·</span>
              <button className="inline-flex items-center gap-1.5 rounded-[4px] bg-primary px-2 py-1 text-[11.5px] font-medium text-primary-foreground hover:bg-primary/90">
                <Check className="h-3 w-3" /> Approve all
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-2 py-1 text-[11.5px] hover:bg-surface-2">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-2 py-1 text-[11.5px] hover:bg-surface-2">
                <ArrowUpRight className="h-3 w-3" /> Escalate
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1 text-[11.5px] text-muted-foreground hover:bg-surface-2">
                <X className="h-3 w-3" /> Reject
              </button>
            </>
          )}
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
          {filtered.map((a) => (
            <li key={a.id}
                onClick={() => setOpenId(a.id)}
                className={cn("flex cursor-pointer items-start gap-3 px-3 py-3 hover:bg-surface-2",
                              openId === a.id && "bg-surface-2")}>
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={(e) => { e.stopPropagation(); toggle(a.id); }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 h-3.5 w-3.5 accent-primary"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("font-mono text-[10.5px]",
                    a.priority === "P0" ? "text-destructive" :
                    a.priority === "P1" ? "text-warning" : "text-muted-foreground")}>{a.priority}</span>
                  <span className="caption">{a.kind}</span>
                  <span className="font-mono text-[10.5px] text-muted-foreground">· {a.worker}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{a.createdAt}</span>
                </div>
                <div className="mt-1 text-[12.5px] font-medium">{a.subject}</div>
                <p className="mt-0.5 line-clamp-2 text-[11.5px] text-muted-foreground">{a.preview}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Detail */}
      <aside className="col-span-12 min-h-0 overflow-y-auto bg-background xl:col-span-5">
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2">
            <span className="caption">{open.kind}</span>
            <span className="font-mono text-[10.5px] text-muted-foreground">{open.id}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10.5px] text-primary">
              <Sparkles className="h-3 w-3" /> {open.worker}
            </span>
          </div>
          <h2 className="mt-1 text-[16px] font-medium tracking-tight">{open.subject}</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            For <span className="text-foreground">{open.leadName}</span> · {open.leadId} · {open.createdAt} ago
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
              <Check className="h-3 w-3" /> Approve <span className="kbd ml-1">A</span>
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2.5 text-[12px] hover:bg-surface-3">
              <Pencil className="h-3 w-3" /> Edit <span className="kbd ml-1">E</span>
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2.5 text-[12px] hover:bg-surface-3">
              <ArrowUpRight className="h-3 w-3" /> Escalate
            </button>
            <button className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-[5px] px-2.5 text-[12px] text-muted-foreground hover:bg-surface-2">
              <X className="h-3 w-3" /> Reject <span className="kbd ml-1">R</span>
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="caption">Proposed content</div>
          <div className="mt-2 rounded-[6px] border border-border bg-surface-2 p-4 text-[13px] leading-relaxed">
            {open.preview} … <span className="text-muted-foreground">[full draft]</span>
          </div>

          <div className="mt-5 caption">AI rationale</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Lead replied "sounds good" with affirmative signal. ICP match (operations, EU, &gt;200 seats).
            Recommended tone: concise, technical. Confidence 0.91.
          </p>

          <div className="mt-5 caption">Audit</div>
          <ul className="mt-2 space-y-1.5 font-mono text-[10.5px] text-muted-foreground">
            <li>10:02:13 · {open.worker} drafted</li>
            <li>10:02:13 · queued for human approval</li>
            <li>10:02:14 · routed to Iris Chen</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
