import { Check, ExternalLink, Plug } from "lucide-react";

const items = [
  { name: "Meta · Instagram & Messenger", desc: "Inbound messages, ads context, page insights.", status: "Connected", scope: "pages.read · messages" },
  { name: "WhatsApp Business API",        desc: "Two-way messaging across numbers and templates.", status: "Connected", scope: "send · receive · templates" },
  { name: "OpenRouter",                    desc: "Model routing for research, qualification and drafting.", status: "Connected", scope: "claude · gpt · llama" },
  { name: "Browser Extension",             desc: "One-key capture from any web page.", status: "Connected", scope: "14 active devices" },
  { name: "n8n Automation",                desc: "Internal workflows for routing and escalations.", status: "Connected", scope: "27 workflows · queue 4" },
  { name: "Email (IMAP/SMTP)",             desc: "Outbound email channel for outreach.", status: "Available" },
  { name: "Calendar",                      desc: "Surface availability for AI-scheduled meetings.", status: "Available" },
  { name: "Webhooks",                      desc: "Forward Leadsy events to your stack.", status: "Available" },
];

export default function Integrations() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-5">
        <div className="caption">Integrations</div>
        <h1 className="mt-1 text-[22px] tracking-tight">Channels & infrastructure</h1>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">Connect Leadsy to the systems your operators already use.</p>

        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-border bg-border md:grid-cols-2">
          {items.map((i) => (
            <div key={i.name} className="bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-[5px] border border-border bg-surface-2">
                    <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">{i.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">{i.desc}</div>
                  </div>
                </div>
                {i.status === "Connected" ? (
                  <span className="inline-flex items-center gap-1 rounded-[3px] bg-primary/10 px-1.5 py-0.5 font-mono text-[10.5px] text-primary">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                ) : (
                  <button className="h-6 rounded-[4px] border border-border bg-surface-2 px-2 text-[11.5px] hover:bg-surface-3">Connect</button>
                )}
              </div>
              {i.scope && (
                <div className="mt-3 flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
                  <span>{i.scope}</span>
                  <button className="ml-auto inline-flex items-center gap-1 hover:text-foreground"><ExternalLink className="h-3 w-3" /> manage</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
