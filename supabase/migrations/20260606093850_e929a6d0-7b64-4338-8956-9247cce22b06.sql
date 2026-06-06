
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('owner','admin','member');
CREATE TYPE public.lead_status AS ENUM ('new','researching','qualified','engaged','converted','lost');
CREATE TYPE public.lead_qualification AS ENUM ('hot','warm','cold','unqualified');
CREATE TYPE public.lead_source AS ENUM ('instagram','whatsapp','meta_ads','extension','manual','referral','other');
CREATE TYPE public.task_status AS ENUM ('todo','in_progress','blocked','done');
CREATE TYPE public.task_priority AS ENUM ('urgent','high','medium','low');
CREATE TYPE public.approval_kind AS ENUM ('research','task','note','draft','outreach','action');
CREATE TYPE public.approval_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.approval_priority AS ENUM ('p0','p1','p2');
CREATE TYPE public.worker_kind AS ENUM ('research','qualifier','outreach','summarizer','enricher','custom');
CREATE TYPE public.worker_status AS ENUM ('running','idle','failed','paused');
CREATE TYPE public.worker_approval_mode AS ENUM ('auto','required','manual');
CREATE TYPE public.execution_status AS ENUM ('running','success','failure');
CREATE TYPE public.conversation_channel AS ENUM ('whatsapp','instagram','messenger','email','sms');
CREATE TYPE public.message_direction AS ENUM ('in','out');
CREATE TYPE public.knowledge_kind AS ENUM ('finding','note','summary','signal','change');
CREATE TYPE public.integration_kind AS ENUM ('meta','whatsapp','openrouter','n8n','extension','other');
CREATE TYPE public.integration_status AS ENUM ('connected','disconnected','error');
CREATE TYPE public.activity_kind AS ENUM ('research','qualify','message','approval','task','convert','create','update','delete');

-- =========================================================
-- UTILS
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles read all auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- WORKSPACES
-- =========================================================
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER workspaces_updated BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_members TO authenticated;
GRANT ALL ON public.workspace_members TO service_role;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX workspace_members_user_idx ON public.workspace_members(user_id);
CREATE INDEX workspace_members_ws_idx ON public.workspace_members(workspace_id);

-- security definer helpers
CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id UUID, _workspace_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE user_id=_user_id AND workspace_id=_workspace_id);
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_role(_user_id UUID, _workspace_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE user_id=_user_id AND workspace_id=_workspace_id AND role=_role);
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_admin(_user_id UUID, _workspace_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE user_id=_user_id AND workspace_id=_workspace_id AND role IN ('owner','admin'));
$$;

-- workspace policies
CREATE POLICY "workspaces read members" ON public.workspaces FOR SELECT TO authenticated
  USING (public.is_workspace_member(auth.uid(), id));
CREATE POLICY "workspaces insert self" ON public.workspaces FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "workspaces update admin" ON public.workspaces FOR UPDATE TO authenticated
  USING (public.is_workspace_admin(auth.uid(), id))
  WITH CHECK (public.is_workspace_admin(auth.uid(), id));
CREATE POLICY "workspaces delete owner" ON public.workspaces FOR DELETE TO authenticated
  USING (public.has_workspace_role(auth.uid(), id, 'owner'));

-- members policies
CREATE POLICY "members read same workspace" ON public.workspace_members FOR SELECT TO authenticated
  USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "members insert admin or self-bootstrap" ON public.workspace_members FOR INSERT TO authenticated
  WITH CHECK (
    public.is_workspace_admin(auth.uid(), workspace_id)
    OR (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid()))
  );
CREATE POLICY "members update admin" ON public.workspace_members FOR UPDATE TO authenticated
  USING (public.is_workspace_admin(auth.uid(), workspace_id))
  WITH CHECK (public.is_workspace_admin(auth.uid(), workspace_id));
CREATE POLICY "members delete admin" ON public.workspace_members FOR DELETE TO authenticated
  USING (public.is_workspace_admin(auth.uid(), workspace_id));

-- =========================================================
-- AUTH SIGNUP TRIGGER: profile + personal workspace + owner membership
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ws_id UUID;
  base_slug TEXT;
  final_slug TEXT;
  suffix INT := 0;
  display_name TEXT;
BEGIN
  display_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1));
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, display_name, NEW.raw_user_meta_data->>'avatar_url');

  base_slug := regexp_replace(lower(coalesce(display_name,'workspace')), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  IF base_slug = '' THEN base_slug := 'workspace'; END IF;
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.workspaces WHERE slug = final_slug) LOOP
    suffix := suffix + 1;
    final_slug := base_slug || '-' || suffix::text;
  END LOOP;

  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (display_name || '''s Workspace', final_slug, NEW.id)
  RETURNING id INTO ws_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (ws_id, NEW.id, 'owner');

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- LEADS
-- =========================================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  code TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  city TEXT,
  status public.lead_status NOT NULL DEFAULT 'new',
  qualification public.lead_qualification NOT NULL DEFAULT 'warm',
  source public.lead_source NOT NULL DEFAULT 'manual',
  score INT NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  last_activity_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX leads_ws_idx ON public.leads(workspace_id);
CREATE INDEX leads_status_idx ON public.leads(workspace_id, status);
CREATE TRIGGER leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "leads ws read" ON public.leads FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "leads ws insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "leads ws update" ON public.leads FOR UPDATE TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id)) WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "leads ws delete" ON public.leads FOR DELETE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id));

-- LEAD NOTES
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_notes TO authenticated;
GRANT ALL ON public.lead_notes TO service_role;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE INDEX lead_notes_lead_idx ON public.lead_notes(lead_id);
CREATE POLICY "notes ws read" ON public.lead_notes FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "notes ws insert" ON public.lead_notes FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id) AND author_id = auth.uid());
CREATE POLICY "notes author update" ON public.lead_notes FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "notes author or admin delete" ON public.lead_notes FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_workspace_admin(auth.uid(), workspace_id));

-- =========================================================
-- TASKS
-- =========================================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  due_at TIMESTAMPTZ,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  approval_state TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX tasks_ws_idx ON public.tasks(workspace_id);
CREATE TRIGGER tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "tasks ws read" ON public.tasks FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "tasks ws insert" ON public.tasks FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "tasks ws update" ON public.tasks FOR UPDATE TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id)) WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "tasks ws delete" ON public.tasks FOR DELETE TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));

-- =========================================================
-- APPROVALS
-- =========================================================
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  worker_name TEXT,
  kind public.approval_kind NOT NULL,
  subject TEXT NOT NULL,
  preview TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.approval_status NOT NULL DEFAULT 'pending',
  priority public.approval_priority NOT NULL DEFAULT 'p1',
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.approvals TO authenticated;
GRANT ALL ON public.approvals TO service_role;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
CREATE INDEX approvals_ws_idx ON public.approvals(workspace_id, status);
CREATE TRIGGER approvals_updated BEFORE UPDATE ON public.approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "approvals ws read" ON public.approvals FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "approvals ws insert" ON public.approvals FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "approvals ws update" ON public.approvals FOR UPDATE TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id)) WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "approvals ws delete" ON public.approvals FOR DELETE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id));

-- =========================================================
-- WORKERS
-- =========================================================
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind public.worker_kind NOT NULL DEFAULT 'custom',
  status public.worker_status NOT NULL DEFAULT 'idle',
  approval_mode public.worker_approval_mode NOT NULL DEFAULT 'required',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  success_rate INT NOT NULL DEFAULT 0,
  queue_count INT NOT NULL DEFAULT 0,
  output_count INT NOT NULL DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workers TO authenticated;
GRANT ALL ON public.workers TO service_role;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER workers_updated BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "workers ws read" ON public.workers FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "workers ws insert admin" ON public.workers FOR INSERT TO authenticated WITH CHECK (public.is_workspace_admin(auth.uid(), workspace_id));
CREATE POLICY "workers ws update admin" ON public.workers FOR UPDATE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id)) WITH CHECK (public.is_workspace_admin(auth.uid(), workspace_id));
CREATE POLICY "workers ws delete admin" ON public.workers FOR DELETE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id));

CREATE TABLE public.worker_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  status public.execution_status NOT NULL DEFAULT 'running',
  duration_ms INT,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_executions TO authenticated;
GRANT ALL ON public.worker_executions TO service_role;
ALTER TABLE public.worker_executions ENABLE ROW LEVEL SECURITY;
CREATE INDEX worker_exec_worker_idx ON public.worker_executions(worker_id, started_at DESC);
CREATE POLICY "exec ws read" ON public.worker_executions FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "exec ws insert" ON public.worker_executions FOR INSERT TO authenticated WITH CHECK (public.is_workspace_admin(auth.uid(), workspace_id));

-- =========================================================
-- CONVERSATIONS / MESSAGES
-- =========================================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  channel public.conversation_channel NOT NULL,
  contact_name TEXT,
  subject TEXT,
  important BOOLEAN NOT NULL DEFAULT false,
  unread_count INT NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE INDEX conv_ws_idx ON public.conversations(workspace_id, last_message_at DESC);
CREATE TRIGGER conv_updated BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "conv ws read" ON public.conversations FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "conv ws insert" ON public.conversations FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "conv ws update" ON public.conversations FOR UPDATE TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id)) WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "conv ws delete" ON public.conversations FOR DELETE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id));

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  direction public.message_direction NOT NULL,
  author TEXT,
  body TEXT NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX messages_conv_idx ON public.messages(conversation_id, sent_at);
CREATE POLICY "msg ws read" ON public.messages FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "msg ws insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));

-- =========================================================
-- KNOWLEDGE
-- =========================================================
CREATE TABLE public.knowledge_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  kind public.knowledge_kind NOT NULL DEFAULT 'finding',
  title TEXT NOT NULL,
  body TEXT,
  source TEXT,
  confidence INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_findings TO authenticated;
GRANT ALL ON public.knowledge_findings TO service_role;
ALTER TABLE public.knowledge_findings ENABLE ROW LEVEL SECURITY;
CREATE INDEX kf_lead_idx ON public.knowledge_findings(lead_id, created_at DESC);
CREATE POLICY "kf ws read" ON public.knowledge_findings FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "kf ws insert" ON public.knowledge_findings FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "kf ws delete" ON public.knowledge_findings FOR DELETE TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));

-- =========================================================
-- INTEGRATIONS
-- =========================================================
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  kind public.integration_kind NOT NULL,
  status public.integration_status NOT NULL DEFAULT 'disconnected',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, kind)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;
GRANT ALL ON public.integrations TO service_role;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER integ_updated BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "integ ws read" ON public.integrations FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "integ ws write admin" ON public.integrations FOR INSERT TO authenticated WITH CHECK (public.is_workspace_admin(auth.uid(), workspace_id));
CREATE POLICY "integ ws update admin" ON public.integrations FOR UPDATE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id)) WITH CHECK (public.is_workspace_admin(auth.uid(), workspace_id));
CREATE POLICY "integ ws delete admin" ON public.integrations FOR DELETE TO authenticated USING (public.is_workspace_admin(auth.uid(), workspace_id));

-- =========================================================
-- ACTIVITY LOG
-- =========================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_label TEXT,
  kind public.activity_kind NOT NULL,
  summary TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX activity_ws_idx ON public.activity_log(workspace_id, created_at DESC);
CREATE POLICY "activity ws read" ON public.activity_log FOR SELECT TO authenticated USING (public.is_workspace_member(auth.uid(), workspace_id));
CREATE POLICY "activity ws insert" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));

-- =========================================================
-- REALTIME
-- =========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
