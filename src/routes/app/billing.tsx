import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnBilling, createOrg, getBilling, getBillingPdf } from "@/lib/docuflow/api";
import { formatEurFromCents, formatMoney } from "@/lib/docuflow/engine";
import { useOrg } from "@/components/shell";
import { Badge, Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/billing")({
  validateSearch: (search: Record<string, unknown>) => ({
    checkout: search.checkout === "success" || search.checkout === "cancel" ? search.checkout : "",
    session_id: typeof search.session_id === "string" ? search.session_id.slice(0, 200) : "",
  }),
  component: BillingPage,
});

function stripeHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && (parsed.hostname === "checkout.stripe.com" || parsed.hostname === "billing.stripe.com");
  } catch {
    return false;
  }
}

function BillingPage() {
  const { org, reload } = useOrg();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [data, setData] = useState<Awaited<ReturnType<typeof getBilling>> | null>(null);
  const [code, setCode] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  function load() {
    getBilling({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
  }
  useEffect(load, [org.id]);
  useEffect(() => {
    if (!search.session_id) return;
    setBusy("confirm");
    void actOnBilling({ data: { orgId: org.id, type: "confirm", sessionId: search.session_id } })
      .then(() => {
        setNote("Paiement confirmé. L'offre est active.");
        setError("");
        load();
        reload();
      })
      .catch((e) => setError(messageOf(e)))
      .finally(() => {
        setBusy("");
        void navigate({ to: "/app/billing", search: { checkout: "", session_id: "" }, replace: true });
      });
  }, [org.id, search.session_id, navigate, reload]);

  async function pay(type: string, extra: Record<string, string> = {}) {
    setError("");
    setBusy(type);
    try {
      const result = await actOnBilling({ data: { orgId: org.id, type, ...extra } });
      if (result.url) {
        if (!stripeHost(result.url)) throw new Error("Adresse de paiement inattendue.");
        window.location.assign(result.url);
        return true;
      }
      if (result.updated) setNote(type === "cancel" ? "Résiliation enregistrée. Les documents restent conservés." : "Offre mise à jour.");
      load();
      reload();
      return true;
    } catch (e) {
      setError(messageOf(e));
      return false;
    } finally {
      setBusy("");
    }
  }

  const plans = data?.plans ?? [];
  const invoices = data?.invoices ?? [];
  const sub = data?.subscription;
  const current = sub?.plan_code;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageTitle title="Abonnement" lede={data?.notice} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {note ? <p className="text-sm text-ok">{note}</p> : null}
      {search.checkout === "cancel" ? <p className="text-sm text-muted">Paiement annulé. Aucun prélèvement n'a été enregistré.</p> : null}
      {busy === "confirm" ? <p className="text-sm">Confirmation du paiement auprès de Stripe…</p> : null}
      <Panel>
        <p className="text-sm">
          Statut <Badge value={String(sub?.status ?? "")} /> · offre effective {data?.effective} · remise {sub?.discount_percent ?? 0} %
          {sub?.period_end ? ` · période jusqu'au ${sub.period_end}` : ""}
        </p>
        <div className="mt-3 flex gap-2">
          <Field value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code DOCUFLOW30" />
          <Button variant="ghost" disabled={busy !== ""} onClick={() => void pay("promo", { code }).then((ok) => { if (ok) setCode(""); })}>Appliquer</Button>
        </div>
      </Panel>
      <div className="grid gap-3 md:grid-cols-2">
        {plans.map((plan) => {
          const active = current === plan.code && (sub?.status === "active" || sub?.status === "canceling");
          return (
            <Panel key={plan.code}>
              <h2 className="text-lg font-medium">{plan.name}</h2>
              <p className="mt-1 text-xl font-semibold tabular-nums">{formatMoney(plan.price_xaf)}</p>
              <p className="text-sm text-muted">
                {plan.catalog ? "Tarif du catalogue Stripe" : `${formatEurFromCents(plan.eur_cents)} / mois`}
                {sub?.discount_percent ? ` après remise, soit ${formatMoney(plan.amount_xaf)}` : ""}
              </p>
              <p className="mt-2 text-sm text-muted">{plan.max_users} utilisateurs · {plan.storage_mb} Mo · {plan.docs_per_month} docs / mois</p>
              <p className="mt-2 text-sm leading-6">{plan.features}</p>
              <Button className="mt-4" disabled={!data?.stripeReady || busy !== "" || (active && sub?.status === "active")} onClick={() => void pay("activate", { plan: plan.code })}>
                {active && sub?.status === "canceling" ? "Reprendre cette offre" : active ? "Offre en cours" : "Payer avec Stripe"}
              </Button>
            </Panel>
          );
        })}
      </div>
      <Panel>
        <h2 className="text-sm font-medium">Factures</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {invoices.length === 0 ? <li className="text-muted">Aucun encaissement pour le moment.</li> : null}
          {invoices.map((inv) => (
            <li key={inv.number} className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {inv.issued_on} · {inv.number} · {formatMoney(inv.amount_xaf)}
                {inv.amount_eur_cents ? ` · ${formatEurFromCents(inv.amount_eur_cents)}` : ""} · {inv.status}
              </span>
              <Button variant="ghost" onClick={() => void getBillingPdf({ data: { orgId: org.id, number: inv.number } }).then((file) => {
                const bin = atob(file.base64);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
                const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = file.filename;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1500);
              }).catch((e) => setError(messageOf(e)))}>PDF</Button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" disabled={!data?.stripeReady || !sub?.stripe_customer_id || busy !== ""} onClick={() => void pay("portal")}>Portail Stripe</Button>
          <Button variant="danger" disabled={busy !== ""} onClick={() => void pay("cancel")}>
            {sub?.stripe_subscription_id ? "Résilier en fin de période" : "Interrompre l'essai"}
          </Button>
        </div>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Autre organisation</h2>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void createOrg({ data: { name: orgName } }).then(() => { setOrgName(""); reload(); }).catch((err) => setError(messageOf(err))); }}>
          <Field value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Nom" />
          <Button>Créer</Button>
        </form>
      </Panel>
    </div>
  );
}
