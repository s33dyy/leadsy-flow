import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Props {
  mode: "login" | "signup" | "forgot";
}

export default function AuthShell({ mode }: Props) {
  const title =
    mode === "login" ? "Welcome back" :
    mode === "signup" ? "Create your workspace" :
    "Reset your password";

  const sub =
    mode === "login" ? "Operate your pipeline." :
    mode === "signup" ? "10-minute setup. No credit card." :
    "We'll email you a one-time link.";

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
          <div className="caption">{mode === "signup" ? "Get started" : mode === "forgot" ? "Recovery" : "Sign in"}</div>
          <h1 className="mt-1 text-[26px] tracking-tight">{title}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>

          <form className="mt-7 space-y-3">
            {mode === "signup" && (
              <Field label="Workspace name" placeholder="Helio Operations" />
            )}
            <Field label="Email" placeholder="iris@helio.co" type="email" />
            {mode !== "forgot" && <Field label="Password" placeholder="••••••••" type="password" />}

            <button className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[6px] bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
              {mode === "login" && "Sign in"}
              {mode === "signup" && "Create workspace"}
              {mode === "forgot" && "Send reset link"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {mode !== "forgot" && (
              <button type="button" className="h-9 w-full rounded-[6px] border border-border bg-surface-2 text-[13px] hover:bg-surface-3">
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
            {mode === "forgot" && (
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
