import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getDashboard, seedDemo } from "@/lib/docuflow/api";
import { formatMoney } from "@/lib/docuflow/engine";
import { useOrg } from "@/components/shell";
import { Badge, Button, Empty, PageTitle, Panel, Stat, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const { org, tick, bump, tx } = useOrg();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    getDashboard({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
  }, [org.id, tick]);

  async function demo() {
    setBusy(true);
    try {
      await seedDemo({ data: { orgId: org.id } });
      bump();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!data) return <p className="text-sm text-muted">{tx("Chargement de l'espace…", "Loading workspace…")}</p>;
  const mb = (data.bytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageTitle
        title={tx("Tableau de bord", "Dashboard")}
        lede={`${org.name} · ${data.planName}. ${tx("Les chiffres viennent des documents de cette organisation.", "Figures come from this organization's documents.")}`}
        action={<Button onClick={() => void demo()} disabled={busy || org.writesBlocked}>{busy ? "…" : tx("Charger un jeu de démonstration", "Load a demo set")}</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={tx("Documents", "Documents")} value={String(data.total)} hint={`${data.month} / ${data.quotaDocs} ${tx("ce mois", "this month")}`} />
        <Stat label={tx("À valider", "Needs review")} value={String(data.review)} />
        <Stat label={tx("Archivés", "Archived")} value={String(data.archived)} />
        <Stat label={tx("Stockage", "Storage")} value={`${mb} Mo`} hint={`/ ${data.quotaMb} Mo`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Panel>
          <h2 className="text-sm font-medium">{tx("Répartition", "Breakdown")}</h2>
          <div className="mt-4 h-56">
            {data.byCategory.length === 0 ? <p className="text-sm text-muted">{tx("Aucun document classé.", "Nothing classified yet.")}</p> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byCategory}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} hide={data.byCategory.length > 6} />
                  <YAxis allowDecimals={false} width={28} />
                  <Bar dataKey="n" fill="var(--color-primary)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-sm font-medium">{tx("Recommandations", "Recommendations")}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {data.recommendations.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h2 className="mt-6 text-sm font-medium">{tx("Échéances 30 jours", "Due in 30 days")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.deadlines.length === 0 ? <li className="text-muted">{tx("Aucune.", "None.")}</li> : data.deadlines.map((d) => (
              <li key={d.id} className="flex justify-between gap-3"><span className="truncate">{d.label}</span><span className="tabular-nums text-muted">{d.due_on}</span></li>
            ))}
          </ul>
        </Panel>
      </div>
      {data.total === 0 ? (
        <Empty title={tx("L'espace est vide", "The workspace is empty")} body={tx("Chargez le jeu de démonstration pour voir factures, bail et bulletin, ou importez vos fichiers.", "Load the demo set, or import your own files.")} action={<Link to="/app/import"><Button variant="ghost">{tx("Importer", "Import")}</Button></Link>} />
      ) : (
        <Panel>
          <h2 className="text-sm font-medium">{tx("Derniers documents", "Latest documents")}</h2>
          <ul className="mt-3 divide-y divide-line">
            {data.recent.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="font-medium">{doc.title}</Link>
                  <p className="text-xs text-muted">{doc.categoryName} · {doc.supplier || tx("émetteur non lu", "issuer unread")}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="tabular-nums">{formatMoney(doc.amountTtc, doc.currency)}</span>
                  <Badge value={doc.status} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <Panel>
        <h2 className="text-sm font-medium">{tx("Activité", "Activity")}</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {data.activity.length === 0 ? <li>{tx("Aucune action enregistrée.", "No recorded action.")}</li> : data.activity.map((a, i) => (
            <li key={`${a.created_at}-${i}`}>{a.created_at} · {a.action} · {a.detail}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
