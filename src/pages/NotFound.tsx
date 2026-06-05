import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">404</div>
      <h1 className="mt-2 text-[28px] tracking-tight">This page isn't part of the workflow.</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">It may have moved, or never existed.</p>
      <Link to="/app" className="mt-6 inline-flex h-9 items-center rounded-[6px] bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
        Back to workspace
      </Link>
    </div>
  );
}
