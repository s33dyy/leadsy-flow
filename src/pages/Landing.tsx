import { Link } from "react-router-dom";
import { ArrowRight, Bot, MessageSquare, CheckSquare, Sparkles, Command } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="container flex h-12 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <span className="font-mono text-[11px] font-semibold">L</span>
            </div>
            <span className="text-[13px] font-medium tracking-tight">Leadsy</span>
            <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              AI Lead Intelligence
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Link to="/login" className="rounded-[5px] px-3 py-1.5 text-[12.5px] text-muted-foreground hover:bg-surface-2 hover:text-foreground">Log in</Link>
            <Link to="/signup" className="rounded-[5px] bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90">Get started</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/70">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.35]" />
        <div className="container relative grid grid-cols-12 gap-10 py-24">
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="dot bg-primary pulse-dot" /> v4 · operator preview
            </div>
            <h1 className="text-[56px] font-medium leading-[1.02] tracking-tight">
              Lead intelligence,
              <br />
              <span className="font-serif-display italic text-muted-foreground">operated by</span> AI workers.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Leadsy researches, qualifies, drafts and routes — your team approves.
              One workspace from first signal to closed deal.
            </p>
            <div className="mt-7 flex items-center gap-2">
              <Link to="/app" className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
                Open workspace <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/extension" className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-border bg-surface-2 px-4 text-[13px] hover:bg-surface-3">
                Install extension
              </Link>
              <span className="ml-2 hidden items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground md:inline-flex">
                <span className="kbd"><Command className="h-2.5 w-2.5" />K</span> anywhere
              </span>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-border bg-border">
              {[
                ["1.4M", "items researched"],
                ["91%", "qualification accuracy"],
                ["8m", "median time to first reply"],
              ].map(([v, l]) => (
                <div key={l} className="bg-background px-4 py-4">
                  <div className="font-mono text-[20px] tracking-tight text-foreground">{v}</div>
                  <div className="mt-1 text-[11.5px] text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="surface-2 overflow-hidden rounded-[10px] border border-border">
              <div className="flex h-7 items-center gap-1.5 border-b border-border bg-surface px-3">
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                <span className="ml-2 font-mono text-[10.5px] text-muted-foreground">leadsy.app / workspace</span>
              </div>
              <WorkflowDiagram />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70">
        <div className="container py-16">
          <div className="caption">The Leadsy workflow</div>
          <h2 className="mt-2 max-w-2xl text-[28px] tracking-tight">
            Six stages. One surface. Every action auditable.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-border bg-border md:grid-cols-3">
            {[
              { i: Sparkles, t: "Research", b: "AI workers gather web, Meta and extension signals into a structured intel profile." },
              { i: Bot,      t: "Knowledge",b: "Findings, notes and summaries live beside every lead — always one keystroke away." },
              { i: CheckSquare, t: "Qualification", b: "Deterministic scoring with a transparent rationale and human override." },
              { i: ListChecksIcon, t: "Tasks", b: "AI-generated work routed to the right operator with priority and SLA." },
              { i: MessageSquare, t: "Communications", b: "WhatsApp, Instagram, Messenger and Email — one timeline per lead." },
              { i: ArrowRight, t: "Conversion", b: "Outcomes feed back into qualification — workers learn from what closes." },
            ].map(({ i: Icon, t, b }) => (
              <div key={t} className="bg-background p-5">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[13px] font-medium">{t}</span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70">
        <div className="container flex h-12 items-center justify-between text-[11.5px] text-muted-foreground">
          <span>© 2026 Leadsy</span>
          <span className="font-mono">build 4.0.0-rc.2</span>
        </div>
      </footer>
    </div>
  );
}

function ListChecksIcon(props: React.SVGProps<SVGSVGElement>) {
  return <CheckSquare {...props} />;
}

function WorkflowDiagram() {
  const stages = ["Research", "Knowledge", "Qualify", "Tasks", "Comms", "Convert"];
  return (
    <div className="p-5">
      <div className="caption">Live pipeline</div>
      <div className="mt-3 space-y-2">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="font-mono text-[10.5px] text-muted-foreground w-4">{i + 1}</div>
            <div className="flex-1 text-[12.5px]">{s}</div>
            <div className="relative h-1.5 w-40 overflow-hidden rounded-full bg-surface-3">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/80"
                style={{ width: `${100 - i * 14}%` }}
              />
            </div>
            <div className="w-10 text-right font-mono text-[10.5px] text-muted-foreground">{100 - i * 14}%</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-[6px] border border-border bg-surface p-3 text-[11.5px] text-muted-foreground">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground">Now:</span>{" "}
        <span>meta-research added 12 items to Helio Robotics · qualifier-v3 raised Theodor Voss to Hot</span>
      </div>
    </div>
  );
}
