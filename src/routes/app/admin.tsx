import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdmin, updatePlan } from "@/lib/docuflow/api";
import { formatMoney } from "@/lib/docuflow/engine";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, Stat, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

function AdminPage() {
  const { boot } = useOrg();
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdmin>> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!boot.platformAdmin) return;
    getAdmin().then(setData).catch((e) => setError(messageOf(e)));
  }, [boot.platformAdmin]);
  if (!boot.platformAdmin) return <p className="text-sm">Cette console est réservée au premier compte de la plateforme.</p>;
  const plans = (data?.plans ?? []) as { code: string; name: string; price_xaf: number; docs_per_month: number; max_users: number; storage_mb: number }[];
  const orgs = (data?.orgRows ?? []) as { id: string; name: string; country: string; plan_code: string; status: string; documents: number }[];
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageTitle title="Super administrateur" lede="Pilotage des organisations, des offres et de la consommation IA. Les prix modifiés s'appliquent aux prochaines activations." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {data ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Organisations" value={String(data.organizations)} />
          <Stat label="Utilisateurs" value={String(data.users)} />
          <Stat label="Documents" value={String(data.documents)} hint={`${(data.bytes / (1024 * 1024)).toFixed(1)} Mo`} />
          <Stat label="MRR interne" value={formatMoney(data.mrr)} hint={`${data.activeSubscriptions} actifs · ${data.cancelled} résiliés · ${data.aiCalls} appels IA`} />
        </div>
      ) : null}
      <Panel>
        <h2 className="text-sm font-medium">Offres</h2>
        <ul className="mt-3 space-y-3">
          {plans.map((plan) => <PlanRow key={plan.code} plan={plan} onSaved={() => void getAdmin().then(setData)} onError={setError} />)}
        </ul>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Organisations</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {orgs.map((o) => <li key={o.id} className="flex justify-between py-2"><span>{o.name} · {o.country}</span><span className="text-muted">{o.plan_code} · {o.status} · {o.documents}</span></li>)}
        </ul>
      </Panel>
    </div>
  );
}

function PlanRow({ plan, onSaved, onError }: { plan: { code: string; name: string; price_xaf: number; docs_per_month: number; max_users: number; storage_mb: number }; onSaved: () => void; onError: (s: string) => void }) {
  const [price, setPrice] = useState(String(plan.price_xaf));
  const [docs, setDocs] = useState(String(plan.docs_per_month));
  const [users, setUsers] = useState(String(plan.max_users));
  const [storage, setStorage] = useState(String(plan.storage_mb));
  return (
    <li className="grid gap-2 md:grid-cols-[8rem_1fr_1fr_1fr_1fr_auto] md:items-center">
      <span className="text-sm font-medium">{plan.name}</span>
      <Field value={price} onChange={(e) => setPrice(e.target.value)} />
      <Field value={docs} onChange={(e) => setDocs(e.target.value)} />
      <Field value={users} onChange={(e) => setUsers(e.target.value)} />
      <Field value={storage} onChange={(e) => setStorage(e.target.value)} />
      <Button variant="ghost" onClick={() => void updatePlan({ data: { code: plan.code, price: Number(price), docs: Number(docs), users: Number(users), storage: Number(storage) } }).then(onSaved).catch((e) => onError(messageOf(e)))}>Sauver</Button>
    </li>
  );
}
