import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "./workspace-context";

type Table =
  | "leads" | "lead_notes" | "tasks" | "approvals" | "workers" | "worker_executions"
  | "conversations" | "messages" | "knowledge_findings" | "integrations" | "activity_log";

interface Options {
  order?: { column: string; ascending?: boolean };
  limit?: number;
  filter?: (q: any) => any;
  realtime?: boolean;
}

export function useWorkspaceTable<T = any>(table: Table, opts: Options = {}) {
  const { current } = useWorkspace();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!current) { setData([]); setLoading(false); return; }
    let q: any = supabase.from(table).select("*").eq("workspace_id", current.id);
    if (opts.filter) q = opts.filter(q);
    if (opts.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) setError(error.message); else setData((data ?? []) as T[]);
    setLoading(false);
  }, [current?.id, table]); // eslint-disable-line

  useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!opts.realtime || !current) return;
    const channel = supabase
      .channel(`rt:${table}:${current.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table, filter: `workspace_id=eq.${current.id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [opts.realtime, current?.id, table, fetchData]);

  return { data, loading, error, refresh: fetchData };
}
