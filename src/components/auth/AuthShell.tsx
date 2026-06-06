import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface Props {
  mode: "login" | "signup" | "forgot" | "reset";
}

export default function AuthShell({ mode }: Props) {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  // If already logged-in, redirect.
  useEffect(() => {
    if (!loading && user && (mode === "login" || mode === "signup")) {
      nav(loc.state?.from || "/app", { replace: true });
    }
  }, [loading, user, mode, nav, loc.state?.from]);

  // Detect password-recovery hash for reset mode
  useEffect(() => {
    if (mode === "reset" && window.location.hash.includes("type=recovery")) {
      // Supabase auto-applies the recovery session; nothing else to do here.
    }
  }, [mode]);

  const title =
    mode === "login" ? "Welcome back" :
    mode === "signup" ? "Create your workspace" :
    mode === "reset" ? "Set a new password" :
    "Reset your password";
  const sub =
    mode === "login" ? "Operate your pipeline." :
    mode === "signup" ? "10-minute setup. No credit card." :
    mode === "reset" ? "Choose something you'll remember." :
    "We'll email you a one-time link.";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav("/app", { replace: true });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        nav("/app", { replace: true });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent. Check your email.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated.");
        nav("/app", { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app",
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    nav("/app", { replace: true });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground md:grid-cols-2">
      <div className="flex flex-col justify-between p-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <span className="font-mono text-[11px] font-semibold">L</span>
          </div>
          <span className="text-[13px] font-medium tracking-tight">Leadsy</span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <div className="caption">
            {mode === "signup" ? "Get started" : mode === "forgot" ? "Recovery" : mode === "reset" ? "New password" : "Sign in"}
          </div>
          <h1 className="mt-1 text-[26px] tracking-tight">{title}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>

          <form onSubmit={submit} className="mt-7 space-y-3">
            {mode === "signup" && (
              <Field label="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Iris Chen" required />
            )}
            {(mode === "login" || mode === "signup" || mode === "forgot") && (
              <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            )}
            {(mode === "login" || mode === "signup" || mode === "reset") && (
              <Field label={mode === "reset" ? "New password" : "Password"} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            )}

            <button disabled={busy} className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[6px] bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                <>
                  {mode === "login" && "Sign in"}
                  {mode === "signup" && "Create workspace"}
                  {mode === "forgot" && "Send reset link"}
                  {mode === "reset" && "Update password"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            {(mode === "login" || mode === "signup") && (
              <button type="button" onClick={google} disabled={busy} className="h-9 w-full rounded-[6px] border border-border bg-surface-2 text-[13px] hover:bg-surface-3 disabled:opacity-60">
                Continue with Google
              </button>
            )}
          </form>

          <div className="mt-6 flex items-center justify-between text-[12px] text-muted-foreground">
            {mode === "login" && (
              <>
                <Link to="/forgot-password" className="hover:text-foreground">Forgot password</Link>
                <Link to="/signup" className="hover:text-foreground">Create workspace →</Link>
              </>
            )}
            {mode === "signup" && (
              <>
                <span>Already have an account?</span>
                <Link to="/login" className="hover:text-foreground">Sign in →</Link>
              </>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <Link to="/login" className="hover:text-foreground">← Back to sign in</Link>
            )}
          </div>
        </div>

        <div className="font-mono text-[10.5px] text-muted-foreground">SOC 2 · GDPR · EU-hosted</div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border md:block">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-end p-10">
          <blockquote className="max-w-md text-[22px] font-serif-display italic leading-snug text-foreground">
            "We retired three internal tools the week we adopted Leadsy. The workers replaced our SDR ops layer entirely."
          </blockquote>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-muted-foreground">
            <div className="h-6 w-6 rounded-full bg-surface-3" />
            <span>Mateus Rocha · CTO, Vela Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="caption">{label}</span>
      <input
        {...props}
        className="mt-1 h-9 w-full rounded-[6px] border border-input bg-surface px-3 text-[13px] outline-none placeholder:text-muted-foreground/60 focus:border-primary"
      />
    </label>
  );
}
