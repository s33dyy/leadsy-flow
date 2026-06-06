import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-background text-[12.5px] text-muted-foreground">
        <span className="font-mono">loading…</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }
  return <>{children}</>;
}
