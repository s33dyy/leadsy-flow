// Demo data for the Leadsy prototype. All static — no backend.

export type Qualification = "Hot" | "Warm" | "Cold" | "Unqualified";
export type LeadStatus = "New" | "Researching" | "Qualified" | "Engaged" | "Converted" | "Lost";

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  qualification: Qualification;
  status: LeadStatus;
  owner: string;
  ownerInitials: string;
  source: "Instagram" | "WhatsApp" | "Meta Ads" | "Extension" | "Manual" | "Referral";
  lastActivity: string;
  score: number;
  city: string;
  tags: string[];
}

export const leads: Lead[] = [
  { id: "LD-2041", name: "Marina Okafor", company: "Helio Robotics", title: "VP Operations", qualification: "Hot", status: "Engaged", owner: "Iris Chen", ownerInitials: "IC", source: "Instagram", lastActivity: "4m", score: 92, city: "Lagos", tags: ["enterprise", "EU"] },
  { id: "LD-2040", name: "Theodor Voss", company: "Nordlys Studio", title: "Head of Growth", qualification: "Hot", status: "Qualified", owner: "Iris Chen", ownerInitials: "IC", source: "WhatsApp", lastActivity: "18m", score: 88, city: "Oslo", tags: ["agency"] },
  { id: "LD-2039", name: "Priya Subramanian", company: "Indigo Loom", title: "Founder", qualification: "Warm", status: "Researching", owner: "Daniel Park", ownerInitials: "DP", source: "Extension", lastActivity: "32m", score: 74, city: "Bengaluru", tags: ["DTC"] },
  { id: "LD-2038", name: "Camille Beaumont", company: "Atelier Quatre", title: "Brand Director", qualification: "Warm", status: "Engaged", owner: "Daniel Park", ownerInitials: "DP", source: "Meta Ads", lastActivity: "1h", score: 71, city: "Paris", tags: ["fashion"] },
  { id: "LD-2037", name: "Hiroshi Tanaka", company: "Kōben Foods", title: "COO", qualification: "Hot", status: "Engaged", owner: "Iris Chen", ownerInitials: "IC", source: "Referral", lastActivity: "2h", score: 90, city: "Kyoto", tags: ["F&B", "expansion"] },
  { id: "LD-2036", name: "Adaeze Nwosu", company: "Praxis Health", title: "Director, Partnerships", qualification: "Warm", status: "Qualified", owner: "Sam Aboagye", ownerInitials: "SA", source: "Manual", lastActivity: "3h", score: 68, city: "Abuja", tags: ["health"] },
  { id: "LD-2035", name: "Lucas Almeida", company: "Cumulus AI", title: "CEO", qualification: "Cold", status: "Researching", owner: "Sam Aboagye", ownerInitials: "SA", source: "Instagram", lastActivity: "5h", score: 41, city: "São Paulo", tags: ["AI"] },
  { id: "LD-2034", name: "Aigerim Bekova", company: "Steppe Logistics", title: "VP Sales", qualification: "Warm", status: "Engaged", owner: "Daniel Park", ownerInitials: "DP", source: "WhatsApp", lastActivity: "6h", score: 76, city: "Almaty", tags: ["logistics"] },
  { id: "LD-2033", name: "Tomás Fernández", company: "Marea Ventures", title: "Principal", qualification: "Hot", status: "Qualified", owner: "Iris Chen", ownerInitials: "IC", source: "Extension", lastActivity: "8h", score: 85, city: "Madrid", tags: ["VC"] },
  { id: "LD-2032", name: "Yuki Sato", company: "Linework Inc.", title: "Product Lead", qualification: "Warm", status: "New", owner: "Unassigned", ownerInitials: "—", source: "Meta Ads", lastActivity: "12h", score: 64, city: "Tokyo", tags: ["SaaS"] },
  { id: "LD-2031", name: "Olivia Marsh", company: "Quill & Quartz", title: "Owner", qualification: "Cold", status: "Lost", owner: "Sam Aboagye", ownerInitials: "SA", source: "Manual", lastActivity: "1d", score: 28, city: "Edinburgh", tags: ["retail"] },
  { id: "LD-2030", name: "Mateus Rocha", company: "Vela Cloud", title: "CTO", qualification: "Hot", status: "Converted", owner: "Iris Chen", ownerInitials: "IC", source: "Referral", lastActivity: "1d", score: 97, city: "Lisbon", tags: ["cloud", "enterprise"] },
];

export interface Worker {
  id: string;
  name: string;
  kind: "Research" | "Qualifier" | "Outreach" | "Summarizer" | "Enricher";
  status: "Running" | "Idle" | "Failed" | "Paused";
  lastRun: string;
  queue: number;
  output: number;
  approval: "Required" | "Auto" | "Manual";
  successRate: number;
}

export const workers: Worker[] = [
  { id: "wk_research_meta", name: "meta-research", kind: "Research", status: "Running", lastRun: "12s", queue: 38, output: 1284, approval: "Required", successRate: 96 },
  { id: "wk_qualify_v3", name: "qualifier-v3", kind: "Qualifier", status: "Running", lastRun: "44s", queue: 12, output: 642, approval: "Auto", successRate: 91 },
  { id: "wk_wa_outreach", name: "whatsapp-outreach", kind: "Outreach", status: "Idle", lastRun: "4m", queue: 0, output: 218, approval: "Required", successRate: 88 },
  { id: "wk_summarizer", name: "thread-summarizer", kind: "Summarizer", status: "Running", lastRun: "8s", queue: 4, output: 3110, approval: "Auto", successRate: 99 },
  { id: "wk_ig_dm", name: "instagram-dm", kind: "Outreach", status: "Failed", lastRun: "11m", queue: 7, output: 84, approval: "Manual", successRate: 72 },
  { id: "wk_enrich_clearbit", name: "company-enricher", kind: "Enricher", status: "Running", lastRun: "2m", queue: 21, output: 902, approval: "Auto", successRate: 94 },
  { id: "wk_followup", name: "follow-up-drafter", kind: "Outreach", status: "Paused", lastRun: "1h", queue: 0, output: 56, approval: "Required", successRate: 81 },
];

export interface Approval {
  id: string;
  kind: "Research" | "Task" | "Note" | "Draft" | "Outreach";
  subject: string;
  leadId: string;
  leadName: string;
  worker: string;
  preview: string;
  createdAt: string;
  priority: "P0" | "P1" | "P2";
}

export const approvals: Approval[] = [
  { id: "AP-771", kind: "Draft", subject: "WhatsApp reply to Marina Okafor", leadId: "LD-2041", leadName: "Marina Okafor", worker: "whatsapp-outreach", preview: "Hi Marina — following up on the operations audit you mentioned. We mapped 3 workflows where Helio could…", createdAt: "2m", priority: "P0" },
  { id: "AP-770", kind: "Research", subject: "Helio Robotics — funding & expansion brief", leadId: "LD-2041", leadName: "Marina Okafor", worker: "meta-research", preview: "Series B closed Mar 2026 ($42M, Index). New ops hub in Rotterdam. Hiring 14 ops roles. Likely buying window…", createdAt: "6m", priority: "P0" },
  { id: "AP-769", kind: "Note", subject: "Qualification rationale for Theodor Voss", leadId: "LD-2040", leadName: "Theodor Voss", worker: "qualifier-v3", preview: "Score 88. Reasoning: matches ICP (agency, 20–50 seats), warm intent from IG comment, prior visit to /pricing.", createdAt: "12m", priority: "P1" },
  { id: "AP-768", kind: "Outreach", subject: "Instagram DM to Yuki Sato", leadId: "LD-2032", leadName: "Yuki Sato", worker: "instagram-dm", preview: "Saw your Linework launch — congrats. Curious how you're handling support volume post-launch…", createdAt: "21m", priority: "P2" },
  { id: "AP-767", kind: "Task", subject: "Schedule discovery call — Tomás Fernández", leadId: "LD-2033", leadName: "Tomás Fernández", worker: "qualifier-v3", preview: "Suggested: Thu 14:00 CET, 30m, with Iris. Reason: matched availability + reply intent signal.", createdAt: "34m", priority: "P1" },
];

export interface ActivityItem {
  id: string;
  time: string;
  type: "research" | "qualify" | "message" | "approval" | "task" | "convert";
  actor: string;
  text: string;
}

export const activity: ActivityItem[] = [
  { id: "a1", time: "now",  type: "convert",  actor: "Iris Chen",        text: "marked Mateus Rocha as Converted" },
  { id: "a2", time: "2m",   type: "approval", actor: "whatsapp-outreach", text: "drafted reply to Marina Okafor — awaiting approval" },
  { id: "a3", time: "6m",   type: "research", actor: "meta-research",     text: "added 12 intelligence items to Helio Robotics" },
  { id: "a4", time: "9m",   type: "qualify",  actor: "qualifier-v3",      text: "raised Theodor Voss to Hot (88)" },
  { id: "a5", time: "14m",  type: "message",  actor: "Daniel Park",       text: "replied on WhatsApp to Aigerim Bekova" },
  { id: "a6", time: "22m",  type: "task",     actor: "qualifier-v3",      text: "created task: Schedule discovery — Tomás Fernández" },
  { id: "a7", time: "31m",  type: "research", actor: "company-enricher",  text: "enriched 8 companies (Marea, Nordlys, Vela, …)" },
  { id: "a8", time: "47m",  type: "message",  actor: "Iris Chen",         text: "sent Instagram DM to Camille Beaumont" },
];

export interface TaskItem {
  id: string;
  title: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Todo" | "In progress" | "Blocked" | "Done";
  owner: string;
  ownerInitials: string;
  due: string;
  source: "AI" | "Human";
  leadId?: string;
  approval?: "Pending" | "Approved" | "—";
}

export const tasks: TaskItem[] = [
  { id: "T-410", title: "Discovery call — Tomás Fernández", priority: "High", status: "Todo", owner: "Iris Chen", ownerInitials: "IC", due: "Thu", source: "AI", leadId: "LD-2033", approval: "Pending" },
  { id: "T-409", title: "Send brief to Helio Robotics ops", priority: "Urgent", status: "In progress", owner: "Iris Chen", ownerInitials: "IC", due: "Today", source: "Human", leadId: "LD-2041", approval: "—" },
  { id: "T-408", title: "Enrich Kōben Foods stakeholders", priority: "Medium", status: "Todo", owner: "Daniel Park", ownerInitials: "DP", due: "Fri", source: "AI", leadId: "LD-2037", approval: "Approved" },
  { id: "T-407", title: "Reply to Aigerim on WhatsApp", priority: "High", status: "Blocked", owner: "Daniel Park", ownerInitials: "DP", due: "Today", source: "Human", leadId: "LD-2034", approval: "—" },
  { id: "T-406", title: "QA outreach worker drift", priority: "Medium", status: "In progress", owner: "Sam Aboagye", ownerInitials: "SA", due: "Mon", source: "Human", leadId: undefined, approval: "—" },
  { id: "T-405", title: "Draft follow-up — Camille", priority: "Low", status: "Todo", owner: "Daniel Park", ownerInitials: "DP", due: "Wed", source: "AI", leadId: "LD-2038", approval: "Pending" },
  { id: "T-404", title: "Onboard new workspace: Atelier", priority: "Medium", status: "Done", owner: "Sam Aboagye", ownerInitials: "SA", due: "—", source: "Human", leadId: undefined, approval: "—" },
];

export interface Conversation {
  id: string;
  channel: "WhatsApp" | "Instagram" | "Messenger" | "Email";
  contact: string;
  company: string;
  preview: string;
  unread: number;
  time: string;
  important?: boolean;
}

export const conversations: Conversation[] = [
  { id: "c1", channel: "WhatsApp",  contact: "Marina Okafor",     company: "Helio Robotics", preview: "Sounds good — send the brief by Thursday.",     unread: 2, time: "4m",  important: true },
  { id: "c2", channel: "Instagram", contact: "Theodor Voss",      company: "Nordlys Studio", preview: "Yes, we'd be open to a 20-min intro call.",      unread: 1, time: "18m" },
  { id: "c3", channel: "WhatsApp",  contact: "Aigerim Bekova",    company: "Steppe Logistics", preview: "Following up on the routing question.",         unread: 0, time: "1h" },
  { id: "c4", channel: "Email",     contact: "Camille Beaumont",  company: "Atelier Quatre", preview: "Re: Q3 brand programs — attaching scope.",       unread: 0, time: "2h" },
  { id: "c5", channel: "Messenger", contact: "Yuki Sato",         company: "Linework Inc.",  preview: "Thanks for the intro — let me think on it.",     unread: 0, time: "5h" },
  { id: "c6", channel: "Instagram", contact: "Tomás Fernández",   company: "Marea Ventures", preview: "Putting you in touch with our portfolio lead.", unread: 0, time: "8h", important: true },
];

export interface ThreadMessage {
  id: string;
  from: "lead" | "us" | "ai";
  author: string;
  time: string;
  text: string;
}

export const sampleThread: ThreadMessage[] = [
  { id: "m1", from: "us",   author: "Iris Chen",         time: "Wed 10:14", text: "Hey Marina — wanted to follow up on the ops conversation from Tuesday." },
  { id: "m2", from: "lead", author: "Marina Okafor",     time: "Wed 10:42", text: "Thanks Iris. We're scoping a workflow audit for the Rotterdam hub. What does a typical engagement look like?" },
  { id: "m3", from: "ai",   author: "thread-summarizer", time: "Wed 10:43", text: "Lead is asking for engagement scope. Recommend sending the operations brief + 30-min discovery." },
  { id: "m4", from: "us",   author: "Iris Chen",         time: "Wed 11:02", text: "Sharing our ops brief — we usually start with a 2-week diagnostic. Want me to set up 30 min Thursday?" },
  { id: "m5", from: "lead", author: "Marina Okafor",     time: "Today 09:58", text: "Sounds good — send the brief by Thursday." },
];

export interface KnowledgeItem {
  id: string;
  kind: "finding" | "note" | "summary" | "signal" | "change";
  title: string;
  body: string;
  source: string;
  time: string;
}

export const knowledge: KnowledgeItem[] = [
  { id: "k1", kind: "finding", title: "Series B closed Mar 2026", body: "$42M led by Index. Earmarked for Rotterdam ops hub and EU expansion.", source: "meta-research", time: "6m" },
  { id: "k2", kind: "signal",  title: "Hiring spike: Operations", body: "14 open ops roles posted in the last 21 days — strong buying signal for ops tooling.", source: "company-enricher", time: "31m" },
  { id: "k3", kind: "summary", title: "Last 5 messages", body: "Lead engaged, requested scope + brief, asked about timelines, soft commitment to Thursday review.", source: "thread-summarizer", time: "2m" },
  { id: "k4", kind: "note",    title: "Iris — internal", body: "Marina prefers Loom walkthroughs over decks. Mentioned legal review takes ~10 days.", source: "Iris Chen", time: "1d" },
  { id: "k5", kind: "change",  title: "Qualification raised", body: "Warm → Hot (score 92). Trigger: explicit intent + budget signal.", source: "qualifier-v3", time: "9m" },
];
