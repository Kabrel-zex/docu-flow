import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell, CreditCard, FileStack, Files, FolderTree, GitBranch, LayoutDashboard,
  Menu, PenLine, Receipt, Search, Settings, Sparkles, Upload, Users, X, BarChart3, Shield,
} from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { getBootstrap } from "@/lib/docuflow/api";
import type { Bootstrap, OrgSummary } from "@/lib/docuflow/types";
import { ROLE_LABELS } from "@/lib/docuflow/engine";
import { messageOf } from "@/components/kit";

type Ctx = {
  boot: Bootstrap;
  org: OrgSummary;
  setOrgId: (id: string) => void;
  tick: number;
  bump: () => void;
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
  tx: (fr: string, en: string) => string;
  reload: () => void;
};

const OrgContext = createContext<Ctx | null>(null);

export function useOrg(): Ctx {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("Organisation indisponible");
  return ctx;
}

export function OrgProvider({ children }: { children: ReactNode }) {
  const [boot, setBoot] = useState<Bootstrap | null>(null);
  const [orgId, setOrgIdState] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const [lang, setLangState] = useState<"fr" | "en">("fr");

  function load() {
    getBootstrap()
      .then((data) => {
        setBoot(data);
        const stored = localStorage.getItem("docuflow.org");
        const next = data.orgs.find((o) => o.id === stored)?.id ?? data.orgs[0]?.id ?? null;
        setOrgIdState(next);
        if (next) localStorage.setItem("docuflow.org", next);
        setError("");
      })
      .catch((e) => setError(messageOf(e)));
  }

  useEffect(() => {
    const saved = localStorage.getItem("docuflow.lang");
    if (saved === "en" || saved === "fr") setLangState(saved);
    load();
  }, []);

  const org = boot?.orgs.find((o) => o.id === orgId) ?? boot?.orgs[0];
  const tx = (fr: string, en: string) => (lang === "en" ? en : fr);
  const value = useMemo<Ctx | null>(() => {
    if (!boot || !org) return null;
    return {
      boot, org, tick, lang, tx,
      setOrgId: (id: string) => {
        localStorage.setItem("docuflow.org", id);
        setOrgIdState(id);
        setTick((n) => n + 1);
      },
      bump: () => setTick((n) => n + 1),
      setLang: (next) => {
        localStorage.setItem("docuflow.lang", next);
        setLangState(next);
      },
      reload: load,
    };
  }, [boot, org, tick, lang]);

  if (error) {
    return <div className="grid min-h-screen place-items-center p-6 text-center"><p className="max-w-md text-sm text-danger">{error}</p></div>;
  }
  if (!value) {
    return <div className="grid min-h-screen place-items-center bg-paper text-sm text-muted">DOCUFLOW AI</div>;
  }
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

const LINKS: { to: string; fr: string; en: string; icon: typeof Files; exact?: boolean }[] = [
  { to: "/app", fr: "Tableau de bord", en: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/documents", fr: "Mes documents", en: "Documents", icon: Files },
  { to: "/app/invoices", fr: "Factures", en: "Invoices", icon: Receipt },
  { to: "/app/import", fr: "Importation", en: "Import", icon: Upload },
  { to: "/app/folders", fr: "Dossiers", en: "Folders", icon: FolderTree },
  { to: "/app/search", fr: "Recherche", en: "Search", icon: Search },
  { to: "/app/contracts", fr: "Contrats", en: "Contracts", icon: FileStack },
  { to: "/app/signatures", fr: "Signatures", en: "Signatures", icon: PenLine },
  { to: "/app/alerts", fr: "Alertes", en: "Alerts", icon: Bell },
  { to: "/app/workflows", fr: "Workflows", en: "Workflows", icon: GitBranch },
  { to: "/app/assistant", fr: "Assistant IA", en: "AI assistant", icon: Sparkles },
  { to: "/app/reports", fr: "Rapports", en: "Reports", icon: BarChart3 },
  { to: "/app/team", fr: "Utilisateurs", en: "Users", icon: Users },
  { to: "/app/settings", fr: "Paramètres", en: "Settings", icon: Settings },
  { to: "/app/billing", fr: "Abonnement", en: "Subscription", icon: CreditCard },
];

export function Shell({ children }: { children: ReactNode }) {
  const { boot, org, setOrgId, lang, setLang, tx } = useOrg();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const items = boot.platformAdmin ? [...LINKS, { to: "/app/admin", fr: "Super admin", en: "Super admin", icon: Shield }] : LINKS;

  const nav = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Link to="/" className="text-sm font-semibold tracking-wide text-white">DOCUFLOW AI</Link>
        <p className="mt-1 text-xs text-sidefg/70">{tx("Documents organisés", "Documents, organized")}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {items.map((item) => {
          const active = item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm ${active ? "bg-white/10 text-white" : "text-sidefg/80"}`}
            >
              <Icon className="size-4" />
              {lang === "en" ? item.en : item.fr}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden bg-sidebar text-sidefg md:block">{nav}</aside>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-ink/40" aria-label="Fermer" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 bg-sidebar text-sidefg">{nav}</aside>
        </div>
      ) : null}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
          <button className="grid size-11 place-items-center rounded-lg border border-line md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Organisation</span>
            <select
              className="h-11 w-full max-w-xs rounded-lg border border-line bg-card px-3 text-sm"
              value={org.id}
              onChange={(e) => setOrgId(e.target.value)}
            >
              {boot.orgs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <span className="hidden text-xs text-muted lg:inline">{ROLE_LABELS[org.role] ?? org.role} · {org.planName}</span>
          <button className="h-11 rounded-lg border border-line px-3 text-xs font-medium" onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <UserButton />
        </header>
        {org.writesBlocked ? (
          <p className="bg-amber-50 px-4 py-2 text-sm text-warn">Abonnement inactif. Les documents restent consultables, les modifications sont suspendues.</p>
        ) : null}
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
