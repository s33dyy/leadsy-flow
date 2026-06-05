import { Link } from "react-router-dom";
import { Chrome, Check, Copy } from "lucide-react";

export default function Extension() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="container flex h-12 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <span className="font-mono text-[11px] font-semibold">L</span>
            </div>
            <span className="text-[13px] font-medium">Leadsy</span>
          </Link>
          <Link to="/app" className="text-[12.5px] text-muted-foreground hover:text-foreground">Workspace →</Link>
        </div>
      </header>

      <div className="container grid grid-cols-1 gap-10 py-16 md:grid-cols-2">
        <div>
          <div className="caption">Leadsy Extension</div>
          <h1 className="mt-2 text-[36px] tracking-tight">Capture leads from anywhere on the web.</h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            One keystroke from Instagram, LinkedIn, or any company site sends the
            profile straight into your Leadsy pipeline — workers handle the rest.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
              <Chrome className="h-3.5 w-3.5" /> Add to Chrome
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-border bg-surface-2 px-4 text-[13px] hover:bg-surface-3">
              For Arc · Edge · Brave
            </button>
          </div>

          <div className="mt-10 space-y-3">
            {[
              ["1", "Install the extension"],
              ["2", "Open Leadsy and copy your pairing code"],
              ["3", "Paste it in the extension popup — done"],
            ].map(([n, t]) => (
              <div key={n} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border font-mono text-[11px] text-muted-foreground">{n}</div>
                <span className="text-[13px]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface-2 p-6">
          <div className="caption">Pairing code</div>
          <div className="mt-3 flex items-center gap-2 rounded-[6px] border border-border bg-background px-3 py-3">
            <span className="font-mono text-[18px] tracking-[0.3em]">8K2P-94QH</span>
            <button className="ml-auto rounded-[5px] p-1.5 text-muted-foreground hover:bg-surface-3 hover:text-foreground">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[11.5px] text-muted-foreground">Expires in 9m 41s · single use.</p>

          <div className="mt-6 space-y-2">
            {["Workspace · Helio Operations", "Role · Admin (Iris Chen)", "Scope · capture, draft, qualify"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
