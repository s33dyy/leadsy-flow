import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth-context";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
}

export interface Membership extends Workspace {
  role: "owner" | "admin" | "member";
}

interface WorkspaceCtx {
  workspaces: Membership[];
  current: Membership | null;
  setCurrentId: (id: string) => void;
  loading: boolean;
  refresh: () => Promise<void>;
}

const Ctx = createContext<WorkspaceCtx>({
  workspaces: [], current: null, setCurrentId: () => {}, loading: true, refresh: async () => {},
});

const STORAGE_KEY = "leadsy.currentWorkspaceId";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Membership[]>([]);
  const [currentId, setCurrentIdState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setWorkspaces([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("workspace_members")
      .select("role, workspaces:workspace_id(id,name,slug,owner_id)")
      .eq("user_id", user.id);
    if (error) { console.error(error); setLoading(false); return; }
    const mapped: Membership[] = (data ?? []).flatMap((row: any) =>
      row.workspaces ? [{ ...row.workspaces, role: row.role }] : []
    );
    setWorkspaces(mapped);
    setLoading(false);
    if (mapped.length && (!currentId || !mapped.find(m => m.id === currentId))) {
      const id = mapped[0].id;
      setCurrentIdState(id);
      localStorage.setItem(STORAGE_KEY, id);
    }
  }, [user, currentId]);

  useEffect(() => { refresh(); }, [user?.id]);

  const setCurrentId = (id: string) => {
    setCurrentIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const current = workspaces.find(w => w.id === currentId) ?? workspaces[0] ?? null;

  return (
    <Ctx.Provider value={{ workspaces, current, setCurrentId, loading, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWorkspace = () => useContext(Ctx);
