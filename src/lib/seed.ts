// Seeds demo data into the current user's workspace so the app feels alive
// without requiring any external integrations.
import { supabase } from "@/integrations/supabase/client";

const SOURCES = ["instagram","whatsapp","meta_ads","extension","manual","referral"] as const;
const QUAL = ["hot","warm","cold","unqualified"] as const;
const STATUS = ["new","researching","qualified","engaged","converted","lost"] as const;

const LEAD_SEED = [
  { name: "Marina Okafor", company: "Helio Robotics", title: "VP Operations", city: "Lagos", email: "marina@helio.co", phone: "+234 802 555 0119", qualification: "hot", status: "engaged", score: 92, source: "instagram", tags: ["enterprise","EU"] },
  { name: "Theodor Voss", company: "Nordlys Studio", title: "Head of Growth", city: "Oslo", email: "theo@nordlys.no", qualification: "hot", status: "qualified", score: 88, source: "whatsapp", tags: ["agency"] },
  { name: "Priya Subramanian", company: "Indigo Loom", title: "Founder", city: "Bengaluru", email: "priya@indigoloom.in", qualification: "warm", status: "researching", score: 74, source: "extension", tags: ["DTC"] },
  { name: "Camille Beaumont", company: "Atelier Quatre", title: "Brand Director", city: "Paris", email: "camille@atelier-quatre.fr", qualification: "warm", status: "engaged", score: 71, source: "meta_ads", tags: ["fashion"] },
  { name: "Hiroshi Tanaka", company: "Kōben Foods", title: "COO", city: "Kyoto", email: "h.tanaka@koben.jp", qualification: "hot", status: "engaged", score: 90, source: "referral", tags: ["F&B","expansion"] },
  { name: "Adaeze Nwosu", company: "Praxis Health", title: "Director, Partnerships", city: "Abuja", email: "ada@praxis.health", qualification: "warm", status: "qualified", score: 68, source: "manual", tags: ["health"] },
  { name: "Lucas Almeida", company: "Cumulus AI", title: "CEO", city: "São Paulo", email: "lucas@cumulus.ai", qualification: "cold", status: "researching", score: 41, source: "instagram", tags: ["AI"] },
  { name: "Aigerim Bekova", company: "Steppe Logistics", title: "VP Sales", city: "Almaty", email: "aigerim@steppe.kz", qualification: "warm", status: "engaged", score: 76, source: "whatsapp", tags: ["logistics"] },
  { name: "Tomás Fernández", company: "Marea Ventures", title: "Principal", city: "Madrid", email: "tomas@marea.vc", qualification: "hot", status: "qualified", score: 85, source: "extension", tags: ["VC"] },
  { name: "Yuki Sato", company: "Linework Inc.", title: "Product Lead", city: "Tokyo", email: "yuki@linework.jp", qualification: "warm", status: "new", score: 64, source: "meta_ads", tags: ["SaaS"] },
  { name: "Mateus Rocha", company: "Vela Cloud", title: "CTO", city: "Lisbon", email: "mateus@vela.cloud", qualification: "hot", status: "converted", score: 97, source: "referral", tags: ["cloud","enterprise"] },
  { name: "Olivia Marsh", company: "Quill & Quartz", title: "Owner", city: "Edinburgh", email: "olivia@quillquartz.co", qualification: "cold", status: "lost", score: 28, source: "manual", tags: ["retail"] },
];

const WORKERS_SEED = [
  { name: "meta-research",      kind: "research",   status: "running", approval_mode: "required", success_rate: 96, queue_count: 38, output_count: 1284 },
  { name: "qualifier-v3",       kind: "qualifier",  status: "running", approval_mode: "auto",     success_rate: 91, queue_count: 12, output_count: 642 },
  { name: "whatsapp-outreach",  kind: "outreach",   status: "idle",    approval_mode: "required", success_rate: 88, queue_count: 0,  output_count: 218 },
  { name: "thread-summarizer",  kind: "summarizer", status: "running", approval_mode: "auto",     success_rate: 99, queue_count: 4,  output_count: 3110 },
  { name: "instagram-dm",       kind: "outreach",   status: "failed",  approval_mode: "manual",   success_rate: 72, queue_count: 7,  output_count: 84 },
  { name: "company-enricher",   kind: "enricher",   status: "running", approval_mode: "auto",     success_rate: 94, queue_count: 21, output_count: 902 },
  { name: "follow-up-drafter",  kind: "outreach",   status: "paused",  approval_mode: "required", success_rate: 81, queue_count: 0,  output_count: 56 },
];

const INTEGRATIONS_SEED = [
  { kind: "meta",       status: "connected",    config: { scope: "pages.read,messages" } },
  { kind: "whatsapp",   status: "connected",    config: { scope: "send,receive,templates" } },
  { kind: "openrouter", status: "connected",    config: { models: ["claude","gpt","llama"] } },
  { kind: "extension",  status: "connected",    config: { devices: 14 } },
  { kind: "n8n",        status: "connected",    config: { url: "https://n8n.example.com", workflows: 27 } },
];

export async function seedWorkspace(workspaceId: string, userId: string) {
  // Leads
  const now = Date.now();
  const leadRows = LEAD_SEED.map((l, i) => ({
    workspace_id: workspaceId,
    owner_id: userId,
    created_by: userId,
    last_activity_at: new Date(now - i * 12 * 60_000).toISOString(),
    ...l,
  }));
  const { data: leads, error: leadErr } = await supabase.from("leads").insert(leadRows as any).select("id,name,company");
  if (leadErr) throw leadErr;

  // Workers
  const { data: workers, error: wErr } = await supabase
    .from("workers")
    .insert(WORKERS_SEED.map(w => ({ ...w, workspace_id: workspaceId, last_run_at: new Date().toISOString() })))
    .select("id,name");
  if (wErr) throw wErr;

  // Worker executions (last 20 per worker)
  const execRows = workers!.flatMap(w =>
    Array.from({ length: 12 }).map((_, i) => ({
      workspace_id: workspaceId,
      worker_id: w.id,
      status: i % 9 === 0 ? "failure" : "success",
      duration_ms: 200 + Math.floor(Math.random() * 1800),
      started_at: new Date(now - i * 5 * 60_000).toISOString(),
      finished_at: new Date(now - i * 5 * 60_000 + 800).toISOString(),
      error: i % 9 === 0 ? "rate_limited" : null,
    }))
  );
  await supabase.from("worker_executions").insert(execRows);

  // Approvals
  const ap = [
    { kind: "draft",    subject: "WhatsApp reply to Marina Okafor", worker_name: "whatsapp-outreach", lead: 0,
      preview: "Hi Marina — following up on the operations audit you mentioned. We mapped 3 workflows where Helio could…", priority: "p0" },
    { kind: "research", subject: "Helio Robotics — funding & expansion brief", worker_name: "meta-research", lead: 0,
      preview: "Series B closed Mar 2026 ($42M, Index). New ops hub in Rotterdam. Hiring 14 ops roles.", priority: "p0" },
    { kind: "note",     subject: "Qualification rationale for Theodor Voss", worker_name: "qualifier-v3", lead: 1,
      preview: "Score 88. Matches ICP, warm intent from IG comment, prior pricing visit.", priority: "p1" },
    { kind: "outreach", subject: "Instagram DM to Yuki Sato", worker_name: "instagram-dm", lead: 9,
      preview: "Saw your Linework launch — congrats. Curious how you're handling support volume…", priority: "p2" },
    { kind: "task",     subject: "Schedule discovery call — Tomás Fernández", worker_name: "qualifier-v3", lead: 8,
      preview: "Thu 14:00 CET, 30m, with you. Matched availability + reply intent signal.", priority: "p1" },
  ];
  await supabase.from("approvals").insert(ap.map(a => ({
    workspace_id: workspaceId,
    lead_id: leads![a.lead]?.id,
    kind: a.kind, subject: a.subject, preview: a.preview, priority: a.priority,
    worker_name: a.worker_name, requested_by: userId,
    payload: { generated: a.preview },
  })));

  // Tasks
  const tasks = [
    { title: "Discovery call — Tomás Fernández", priority: "high",   status: "todo",        ai_generated: true,  lead: 8, due: 2 },
    { title: "Send brief to Helio Robotics ops",  priority: "urgent", status: "in_progress", ai_generated: false, lead: 0, due: 0 },
    { title: "Enrich Kōben Foods stakeholders",   priority: "medium", status: "todo",        ai_generated: true,  lead: 4, due: 3 },
    { title: "Reply to Aigerim on WhatsApp",      priority: "high",   status: "blocked",     ai_generated: false, lead: 7, due: 0 },
    { title: "QA outreach worker drift",          priority: "medium", status: "in_progress", ai_generated: false, lead: -1, due: 5 },
    { title: "Draft follow-up — Camille",         priority: "low",    status: "todo",        ai_generated: true,  lead: 3, due: 4 },
    { title: "Onboard new workspace: Atelier",    priority: "medium", status: "done",        ai_generated: false, lead: -1, due: -1 },
  ];
  await supabase.from("tasks").insert(tasks.map(t => ({
    workspace_id: workspaceId,
    title: t.title, priority: t.priority, status: t.status,
    ai_generated: t.ai_generated,
    lead_id: t.lead >= 0 ? leads![t.lead].id : null,
    assignee_id: userId, created_by: userId,
    due_at: t.due >= 0 ? new Date(now + t.due * 86_400_000).toISOString() : null,
  })));

  // Conversations + messages
  const conv = [
    { lead: 0, channel: "whatsapp",  preview: "Sounds good — send the brief by Thursday.",   unread: 2, important: true,  mins: 4 },
    { lead: 1, channel: "instagram", preview: "Yes, we'd be open to a 20-min intro call.",   unread: 1, important: false, mins: 18 },
    { lead: 7, channel: "whatsapp",  preview: "Following up on the routing question.",       unread: 0, important: false, mins: 60 },
    { lead: 3, channel: "email",     preview: "Re: Q3 brand programs — attaching scope.",    unread: 0, important: false, mins: 120 },
    { lead: 9, channel: "messenger", preview: "Thanks for the intro — let me think on it.",  unread: 0, important: false, mins: 300 },
    { lead: 8, channel: "instagram", preview: "Putting you in touch with our portfolio lead.", unread: 0, important: true, mins: 480 },
  ];
  const { data: convs } = await supabase.from("conversations").insert(conv.map(c => ({
    workspace_id: workspaceId,
    lead_id: leads![c.lead].id,
    channel: c.channel,
    contact_name: leads![c.lead].name,
    subject: c.preview,
    important: c.important,
    unread_count: c.unread,
    last_message_at: new Date(now - c.mins * 60_000).toISOString(),
  }))).select("id,lead_id");

  // Thread for first conversation
  if (convs && convs[0]) {
    const c0 = convs[0];
    const thread = [
      { dir: "out", author: "You",                body: "Hey Marina — wanted to follow up on the ops conversation from Tuesday.", mins: 1440, ai: false },
      { dir: "in",  author: "Marina Okafor",     body: "Thanks. We're scoping a workflow audit for Rotterdam. What does a typical engagement look like?", mins: 1410, ai: false },
      { dir: "in",  author: "thread-summarizer", body: "Lead asking for engagement scope. Recommend brief + 30-min discovery.", mins: 1409, ai: true },
      { dir: "out", author: "You",                body: "Sharing our ops brief — typically 2-week diagnostic. Want 30 min Thursday?", mins: 1300, ai: false },
      { dir: "in",  author: "Marina Okafor",     body: "Sounds good — send the brief by Thursday.", mins: 4, ai: false },
    ];
    await supabase.from("messages").insert(thread.map(m => ({
      workspace_id: workspaceId,
      conversation_id: c0.id,
      direction: m.dir, author: m.author, body: m.body, ai_generated: m.ai,
      sent_at: new Date(now - m.mins * 60_000).toISOString(),
    })));
  }

  // Knowledge findings for first lead
  await supabase.from("knowledge_findings").insert([
    { workspace_id: workspaceId, lead_id: leads![0].id, kind: "finding", title: "Series B closed Mar 2026", body: "$42M led by Index. Earmarked for Rotterdam ops hub and EU expansion.", source: "meta-research", confidence: 94 },
    { workspace_id: workspaceId, lead_id: leads![0].id, kind: "signal",  title: "Hiring spike: Operations", body: "14 open ops roles posted in the last 21 days.", source: "company-enricher", confidence: 88 },
    { workspace_id: workspaceId, lead_id: leads![0].id, kind: "summary", title: "Last 5 messages", body: "Lead engaged, requested scope + brief, asked about timelines.", source: "thread-summarizer", confidence: 92 },
    { workspace_id: workspaceId, lead_id: leads![0].id, kind: "change",  title: "Qualification raised", body: "Warm → Hot (score 92). Trigger: explicit intent + budget signal.", source: "qualifier-v3", confidence: 90 },
  ]);

  // Integrations
  await supabase.from("integrations").upsert(
    INTEGRATIONS_SEED.map(i => ({ ...i, workspace_id: workspaceId, last_sync_at: new Date().toISOString() })),
    { onConflict: "workspace_id,kind" }
  );

  // Activity
  await supabase.from("activity_log").insert([
    { workspace_id: workspaceId, actor_id: userId, actor_label: "You",            kind: "convert",  summary: "marked Mateus Rocha as Converted" },
    { workspace_id: workspaceId, actor_label: "whatsapp-outreach", kind: "approval", summary: "drafted reply to Marina Okafor — awaiting approval" },
    { workspace_id: workspaceId, actor_label: "meta-research",     kind: "research", summary: "added 12 intelligence items to Helio Robotics" },
    { workspace_id: workspaceId, actor_label: "qualifier-v3",      kind: "qualify",  summary: "raised Theodor Voss to Hot (88)" },
    { workspace_id: workspaceId, actor_id: userId, actor_label: "You",            kind: "message",  summary: "replied on WhatsApp to Aigerim Bekova" },
    { workspace_id: workspaceId, actor_label: "qualifier-v3",      kind: "task",     summary: "created task: Schedule discovery — Tomás Fernández" },
    { workspace_id: workspaceId, actor_label: "company-enricher",  kind: "research", summary: "enriched 8 companies" },
  ]);
}

export async function clearWorkspaceData(workspaceId: string) {
  // Order matters because of FK cascades — we still delete explicitly for clarity.
  await supabase.from("activity_log").delete().eq("workspace_id", workspaceId);
  await supabase.from("messages").delete().eq("workspace_id", workspaceId);
  await supabase.from("conversations").delete().eq("workspace_id", workspaceId);
  await supabase.from("knowledge_findings").delete().eq("workspace_id", workspaceId);
  await supabase.from("approvals").delete().eq("workspace_id", workspaceId);
  await supabase.from("tasks").delete().eq("workspace_id", workspaceId);
  await supabase.from("worker_executions").delete().eq("workspace_id", workspaceId);
  await supabase.from("workers").delete().eq("workspace_id", workspaceId);
  await supabase.from("integrations").delete().eq("workspace_id", workspaceId);
  await supabase.from("lead_notes").delete().eq("workspace_id", workspaceId);
  await supabase.from("leads").delete().eq("workspace_id", workspaceId);
}
