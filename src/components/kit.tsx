import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "ink" }) {
  const look = {
    primary: "bg-primary text-white",
    ghost: "border border-line bg-card text-ink",
    danger: "bg-danger text-white",
    ink: "bg-ink text-white",
  }[variant];
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${look} ${className}`}
      {...props}
    />
  );
}

export function Field({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-11 w-full rounded-lg border border-line bg-card px-3 text-sm outline-none ${className}`} {...props} />;
}

export function Area(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="min-h-28 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none" {...props} />;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-line bg-card p-4 md:p-5 ${className}`}>{children}</section>;
}

export function PageTitle({ title, lede, action }: { title: string; lede?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {lede ? <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{lede}</p> : null}
      </div>
      {action}
    </header>
  );
}

const STATUS: Record<string, string> = {
  done: "bg-ok/15 text-ok-ink",
  review: "bg-amber-100 text-warn",
  failed: "bg-red-100 text-danger",
  duplicate: "bg-slate-100 text-muted",
  active: "bg-ok/15 text-ok-ink",
  expiring: "bg-amber-100 text-warn",
  expired: "bg-red-100 text-danger",
  terminated: "bg-slate-100 text-muted",
  pending_signature: "bg-amber-100 text-warn",
  signed_internal: "bg-ok/15 text-ok-ink",
  sent: "bg-primary/10 text-primary",
  draft: "bg-slate-100 text-muted",
  declined: "bg-red-100 text-danger",
  trial: "bg-primary/10 text-primary",
  cancelled: "bg-slate-100 text-muted",
  suspended: "bg-red-100 text-danger",
  paid: "bg-ok/15 text-ok-ink",
  unpaid: "bg-amber-100 text-warn",
  disputed: "bg-red-100 text-danger",
  overdue: "bg-red-100 text-danger",
};

export function Badge({ value }: { value: string }) {
  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${STATUS[value] ?? "bg-slate-100 text-ink"}`}>{value}</span>;
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Panel>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </Panel>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <Panel className="text-center">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Panel>
  );
}
