import { useMemo, useState } from "react";
import { leads, knowledge, sampleThread, type Lead } from "@/lib/demo-data";
import {
  Search, SlidersHorizontal, Star, MoreHorizontal, Mail, MessageSquare,
  Phone, Sparkles, FileText, ListChecks, BookOpen, ChevronRight, Filter, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Communications", "Tasks", "Notes", "Knowledge"] as const;

export default function CRM() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(leads[0].id);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [view, setView] = useState("Hot & Warm · 7d");

  const filtered = useMemo(() =>
    leads.filter(l =>
      (l.name + l.company + l.tags.join(" ")).toLowerCase().includes(query.toLowerCase())
    ), [query]);

  const active = leads.find(l => l.id === activeId) ?? leads[0];

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-px bg-border">
      {/* LEFT — Lead list */}
      <section className="col-span-12 flex min-h-0 flex-col bg-background md:col-span-4 xl:col-span-3">
        <div className="border-b border-border p-3">
          <div className="flex items-center gap-1.5">
            <button className="flex h-7 flex-1 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2 text-[12px]">
              <span className="truncate">{view}</span>
              <ChevronRight className="ml-auto h-3 w-3 rotate-90 text-muted-foreground" />
            </button>
            <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2 hover:bg-surface-3"><Filter className="h-3 w-3" /></button>
            <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2 hover:bg-surface-3"><SlidersHorizontal className="h-3 w-3" /></button>
          </div>
          <div className="mt-2 flex h-7 items-center gap-2 rounded-[5px] border border-border bg-surface-2 px-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads, companies, tags…"
              className="h-full flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/60"
            />
            <span className="kbd">/</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground">
            <span className="font-mono">{filtered.length} of {leads.length}</span>
            <div className="flex items-center gap-2 font-mono">
              <span><span className="dot bg-destructive" /> 5 hot</span>
              <span><span className="dot bg-warning" /> 4 warm</span>
              <span><span className="dot bg-muted-foreground/50" /> 3 cold</span>
            </div>
          </div>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto">
          {filtered.map((l) => (
            <LeadRow key={l.id} lead={l} active={l.id === activeId} onClick={() => setActiveId(l.id)} />
          ))}
        </ul>
      </section>

      {/* CENTER — Lead detail */}
      <section className="col-span-12 flex min-h-0 flex-col bg-background md:col-span-8 xl:col-span-6">
        <header className="border-b border-border px-5 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-surface-3 font-mono text-[12px]">
                {active.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[16px] font-medium tracking-tight">{active.name}</h1>
                  <button className="text-muted-foreground hover:text-foreground"><Star className="h-3.5 w-3.5" /></button>
                  <span className="font-mono text-[10.5px] text-muted-foreground">{active.id}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">
                  {active.title} · <span className="text-foreground">{active.company}</span> · {active.city}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <QuickAction icon={MessageSquare} label="Message" />
              <QuickAction icon={Mail} label="Email" />
              <QuickAction icon={Phone} label="Call" />
              <QuickAction icon={Sparkles} label="Run worker" primary />
              <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border hover:bg-surface-2"><MoreHorizontal className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {/* Attribute strip */}
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4">
            <Attr k="Qualification" v={<QualBadge q={active.qualification} />} />
            <Attr k="Status" v={<span className="text-[12.5px]">{active.status}</span>} />
            <Attr k="Owner" v={<span className="text-[12.5px]">{active.owner}</span>} />
            <Attr k="Source" v={<span className="text-[12.5px]">{active.source}</span>} />
            <Attr k="Score" v={<span className="font-mono text-[12.5px]">{active.score}</span>} />
            <Attr k="Last activity" v={<span className="text-[12.5px]">{active.lastActivity} ago</span>} />
            <Attr k="Tags" v={
              <div className="flex flex-wrap gap-1">
                {active.tags.map((t) => (
                  <span key={t} className="rounded-[3px] border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">{t}</span>
                ))}
              </div>
            } />
            <Attr k="Created" v={<span className="text-[12.5px]">Apr 14</span>} />
          </div>

          <nav className="mt-4 flex items-center gap-0.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative h-7 rounded-[5px] px-2.5 text-[12.5px]",
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
                {tab === t && <span className="absolute inset-x-2.5 -bottom-[13px] h-px bg-primary" />}
              </button>
            ))}
          </nav>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {tab === "Overview" && <OverviewTab />}
          {tab === "Communications" && <CommsTab />}
          {tab === "Tasks" && <TasksTab />}
          {tab === "Notes" && <NotesTab />}
          {tab === "Knowledge" && <KnowledgePanelInline />}
        </div>
      </section>

      {/* RIGHT — Knowledge panel */}
      <aside className="hidden min-h-0 flex-col overflow-y-auto bg-background xl:col-span-3 xl:flex">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-[12.5px] font-medium">Knowledge</span>
            <span className="font-mono text-[10.5px] text-muted-foreground">{active.company}</span>
          </div>
          <button className="text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
        </div>

        <ul className="divide-y divide-border">
          {knowledge.map((k) => (
            <li key={k.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="caption">{k.kind}</span>
                <span className="font-mono text-[10.5px] text-muted-foreground">{k.time}</span>
              </div>
              <div className="mt-1 text-[12.5px] font-medium">{k.title}</div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{k.body}</p>
              <div className="mt-1.5 font-mono text-[10.5px] text-muted-foreground">via {k.source}</div>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-border p-3">
          <button className="flex h-7 w-full items-center justify-center gap-2 rounded-[5px] border border-border bg-surface-2 text-[12px] hover:bg-surface-3">
            <Sparkles className="h-3 w-3 text-primary" /> Run research worker
          </button>
        </div>
      </aside>
    </div>
  );
}

function LeadRow({ lead, active, onClick }: { lead: Lead; active: boolean; onClick: () => void }) {
  return (
    <li
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col gap-1 border-b border-border/70 px-3 py-2.5 hover:bg-surface-2",
        active && "bg-surface-2"
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "dot",
          lead.qualification === "Hot" && "bg-destructive",
          lead.qualification === "Warm" && "bg-warning",
          lead.qualification === "Cold" && "bg-muted-foreground/50",
          lead.qualification === "Unqualified" && "bg-border-strong",
        )} />
        <span className="flex-1 truncate text-[12.5px] font-medium">{lead.name}</span>
        <span className="font-mono text-[10.5px] text-muted-foreground">{lead.lastActivity}</span>
      </div>
      <div className="flex items-center gap-2 pl-3.5 text-[11.5px] text-muted-foreground">
        <span className="truncate">{lead.company}</span>
        <span className="opacity-40">·</span>
        <span className="font-mono">{lead.score}</span>
        <span className="ml-auto truncate">{lead.owner !== "Unassigned" ? lead.ownerInitials : "—"}</span>
      </div>
    </li>
  );
}

function QualBadge({ q }: { q: Lead["qualification"] }) {
  const map = {
    Hot:  "text-destructive bg-destructive/10",
    Warm: "text-warning bg-warning/10",
    Cold: "text-muted-foreground bg-surface-3",
    Unqualified: "text-muted-foreground bg-surface-3",
  } as const;
  return <span className={cn("rounded-[3px] px-1.5 py-0.5 font-mono text-[10.5px]", map[q])}>{q}</span>;
}

function Attr({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="caption">{k}</div>
      <div className="mt-0.5">{v}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, primary }: { icon: any; label: string; primary?: boolean }) {
  return (
    <button className={cn(
      "flex h-7 items-center gap-1.5 rounded-[5px] px-2 text-[12px]",
      primary ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border border-border bg-surface-2 hover:bg-surface-3"
    )}>
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-5">
      <Section title="AI summary" icon={Sparkles}>
        <p className="text-[13px] leading-relaxed text-foreground/90">
          Marina is the operations lead at <span className="text-primary">Helio Robotics</span>, scoping a workflow audit
          for the new Rotterdam hub. Series B closed in March; ops headcount up 30% in 21 days. Replied to two messages
          today, soft-committed to a Thursday brief. <span className="text-muted-foreground">Likely buying window: 2–4 weeks.</span>
        </p>
        <div className="mt-3 flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
          <span>generated by qualifier-v3 · 9m ago</span>
          <button className="ml-auto rounded-[3px] border border-border px-1.5 py-0.5 hover:bg-surface-2">Regenerate</button>
        </div>
      </Section>

      <Section title="Recent communications" icon={MessageSquare}>
        <ul className="space-y-2">
          {sampleThread.slice(-3).map((m) => (
            <li key={m.id} className="flex items-baseline gap-3 text-[12.5px]">
              <span className="w-24 shrink-0 font-mono text-[10.5px] text-muted-foreground">{m.time}</span>
              <span className="w-20 shrink-0 truncate text-[11.5px] text-muted-foreground">{m.author}</span>
              <span className="text-foreground/90">{m.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Open tasks" icon={ListChecks}>
        <ul className="space-y-1.5">
          {["Discovery call — Thu 14:00 CET", "Send operations brief", "Loop in legal review"].map((t) => (
            <li key={t} className="flex items-center gap-2 text-[12.5px]">
              <span className="dot bg-primary" /> {t}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function CommsTab() {
  return (
    <div className="space-y-3">
      {sampleThread.map((m) => (
        <div key={m.id} className={cn(
          "rounded-[6px] border border-border p-3",
          m.from === "us" && "bg-surface-2",
          m.from === "ai" && "border-primary/30 bg-primary/5",
        )}>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-mono">{m.author}</span>
            <span className="opacity-40">·</span>
            <span>{m.time}</span>
            {m.from === "ai" && <span className="ml-auto font-mono text-[10.5px] text-primary">AI summary</span>}
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed">{m.text}</p>
        </div>
      ))}
    </div>
  );
}

function TasksTab() {
  return (
    <ul className="divide-y divide-border rounded-[6px] border border-border">
      {["Send operations brief", "Schedule discovery — Thu 14:00", "Loop in legal review", "Confirm pricing band"].map((t, i) => (
        <li key={t} className="flex items-center gap-3 px-3 py-2.5 text-[12.5px]">
          <input type="checkbox" className="h-3.5 w-3.5 accent-primary" defaultChecked={i === 0} />
          <span className={cn(i === 0 && "text-muted-foreground line-through")}>{t}</span>
          <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{["Today","Thu","Mon","Tue"][i]}</span>
        </li>
      ))}
    </ul>
  );
}

function NotesTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-[6px] border border-border p-3">
        <div className="caption">Iris · 1d</div>
        <p className="mt-1 text-[13px]">Marina prefers Loom walkthroughs over decks. Mentioned legal review takes ~10 days.</p>
      </div>
      <div className="rounded-[6px] border border-border p-3">
        <div className="caption">Daniel · 3d</div>
        <p className="mt-1 text-[13px]">Helio team is centralizing ops tooling — push the workflow audit angle hard.</p>
      </div>
    </div>
  );
}

function KnowledgePanelInline() {
  return (
    <div className="space-y-3">
      {knowledge.map((k) => (
        <div key={k.id} className="rounded-[6px] border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="caption">{k.kind}</span>
            <span className="font-mono text-[10.5px] text-muted-foreground">{k.time}</span>
          </div>
          <div className="mt-1 text-[13px] font-medium">{k.title}</div>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{k.body}</p>
        </div>
      ))}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-[12.5px] font-medium">{title}</h3>
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}


