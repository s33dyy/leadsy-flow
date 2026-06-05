import { useState } from "react";
import { conversations, sampleThread, knowledge, type Conversation } from "@/lib/demo-data";
import { Search, Pin, Star, Sparkles, Paperclip, Send, Hash, AtSign, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const channels = ["All", "WhatsApp", "Instagram", "Messenger", "Email"] as const;
const channelIcons: Record<string, any> = { WhatsApp: MessageSquare, Instagram: AtSign, Messenger: Hash, Email: Mail };

export default function Communications() {
  const [channel, setChannel] = useState<(typeof channels)[number]>("All");
  const [activeId, setActiveId] = useState(conversations[0].id);
  const filtered = conversations.filter(c => channel === "All" ? true : c.channel === channel);
  const active = conversations.find(c => c.id === activeId) ?? conversations[0];

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-px bg-border">
      {/* Inbox */}
      <section className="col-span-12 flex min-h-0 flex-col bg-background md:col-span-4 xl:col-span-3">
        <div className="border-b border-border p-3">
          <div className="flex h-7 items-center gap-2 rounded-[5px] border border-border bg-surface-2 px-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <input placeholder="Search conversations…" className="h-full flex-1 bg-transparent text-[12px] outline-none" />
            <span className="kbd">/</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            {channels.map((c) => (
              <button key={c} onClick={() => setChannel(c)}
                className={cn("h-6 rounded-[4px] px-1.5 font-mono text-[10.5px]",
                  channel === c ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:bg-surface-2")}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {filtered.map((c) => <InboxRow key={c.id} c={c} active={c.id === activeId} onClick={() => setActiveId(c.id)} />)}
        </ul>
      </section>

      {/* Thread */}
      <section className="col-span-12 flex min-h-0 flex-col bg-background md:col-span-8 xl:col-span-6">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-surface-3 font-mono text-[11px]">
              {active.contact.split(" ").map(p => p[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-medium">{active.contact}</span>
                <span className="text-muted-foreground">· {active.company}</span>
              </div>
              <div className="font-mono text-[10.5px] text-muted-foreground">{active.channel} · last reply {active.time} ago</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2 hover:bg-surface-3"><Pin className="h-3 w-3" /></button>
            <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2 hover:bg-surface-3"><Star className="h-3 w-3" /></button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-2 text-[12px] hover:bg-surface-3">
              <Sparkles className="h-3 w-3 text-primary" /> Summarize
            </button>
          </div>
        </header>

        {/* Pinned summary */}
        <div className="border-b border-border bg-primary/5 px-4 py-2.5 text-[12px]">
          <div className="flex items-center gap-2">
            <Pin className="h-3 w-3 text-primary" />
            <span className="caption">Pinned · AI summary</span>
            <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">2m</span>
          </div>
          <p className="mt-1 text-[12.5px] text-foreground/90">
            Marina confirmed Thursday brief, asked for engagement scope and timeline. Signal: budget-ready, legal review 10d.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {sampleThread.map((m) => (
              <div key={m.id} className={cn(
                "flex max-w-[78%] flex-col gap-1 rounded-[6px] border border-border p-3",
                m.from === "us" && "ml-auto bg-primary text-primary-foreground border-transparent",
                m.from === "ai" && "border-primary/30 bg-primary/5",
              )}>
                <div className={cn("flex items-center gap-2 text-[10.5px] font-mono",
                  m.from === "us" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  <span>{m.author}</span>
                  <span className="opacity-60">·</span>
                  <span>{m.time}</span>
                  {m.from === "ai" && <span className="ml-auto text-primary">AI signal</span>}
                </div>
                <p className="text-[13px] leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <div className="rounded-[6px] border border-border bg-surface-2 p-2.5">
            <textarea rows={2} placeholder="Reply on WhatsApp…"
              className="w-full resize-none bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/60" />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <button className="grid h-6 w-6 place-items-center rounded-[4px] hover:bg-surface-3"><Paperclip className="h-3 w-3" /></button>
                <button className="grid h-6 w-6 place-items-center rounded-[4px] hover:bg-surface-3"><Sparkles className="h-3 w-3 text-primary" /></button>
                <span className="font-mono text-[10.5px]">AI draft available</span>
              </div>
              <button className="inline-flex h-7 items-center gap-1.5 rounded-[5px] bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
                <Send className="h-3 w-3" /> Send <span className="kbd ml-1">⌘↵</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge / context */}
      <aside className="hidden min-h-0 flex-col overflow-y-auto bg-background xl:col-span-3 xl:flex">
        <div className="border-b border-border p-4">
          <div className="caption">Lead context</div>
          <div className="mt-1 text-[13px] font-medium">{active.contact}</div>
          <div className="text-[12px] text-muted-foreground">{active.company}</div>
        </div>
        <ul className="divide-y divide-border">
          {knowledge.slice(0, 4).map((k) => (
            <li key={k.id} className="p-4">
              <div className="caption">{k.kind}</div>
              <div className="mt-1 text-[12.5px] font-medium">{k.title}</div>
              <p className="mt-1 text-[11.5px] text-muted-foreground">{k.body}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function InboxRow({ c, active, onClick }: { c: Conversation; active: boolean; onClick: () => void }) {
  const Icon = channelIcons[c.channel] ?? MessageSquare;
  return (
    <li onClick={onClick}
        className={cn("flex cursor-pointer flex-col gap-1 border-b border-border/70 px-3 py-2.5 hover:bg-surface-2",
                       active && "bg-surface-2")}>
      <div className="flex items-center gap-2">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="flex-1 truncate text-[12.5px] font-medium">{c.contact}</span>
        {c.important && <Star className="h-3 w-3 text-warning" />}
        <span className="font-mono text-[10.5px] text-muted-foreground">{c.time}</span>
      </div>
      <div className="flex items-center gap-2 pl-5 text-[11.5px] text-muted-foreground">
        <span className="truncate flex-1">{c.preview}</span>
        {c.unread > 0 && <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">{c.unread}</span>}
      </div>
    </li>
  );
}
