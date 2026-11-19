import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getReports } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Button, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/reports")({ component: ReportsPage });

function ReportsPage() {
  const { org } = useOrg();
  const [data, setData] = useState<Awaited<ReturnType<typeof getReports>> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getReports({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e))); }, [org.id]);

  function csv() {
    if (!data) return;
    const lines = [["categorie", "nombre"], ...data.byCategory.map((r) => [r.name, String(r.n)])];
    const blob = new Blob([lines.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "docuflow-rapport.csv";
    a.click();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageTitle title="Rapports" lede="Agrégats de l'organisation. L'export CSV s'ouvre dans un tableur. L'impression du navigateur sert de PDF." action={<div className="flex gap-2"><Button variant="ghost" onClick={csv}>Excel / CSV</Button><Button variant="ghost" onClick={() => window.print()}>Imprimer</Button></div>} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {data ? (
        <>
          <Panel>
            <h2 className="text-sm font-medium">Documents par mois</h2>
            <div className="mt-3 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.months}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} width={28} />
                  <Bar dataKey="n" fill="var(--color-ink)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel>
            <h2 className="text-sm font-medium">Catégories et contrats</h2>
            <ul className="mt-3 text-sm">{data.byCategory.map((r) => <li key={r.name} className="flex justify-between py-1"><span>{r.name}</span><span className="tabular-nums">{r.n}</span></li>)}</ul>
            <ul className="mt-4 text-sm">{data.contracts.map((r) => <li key={r.status}>{r.status} · {r.n}</li>)}</ul>
            <p className="mt-4 text-sm text-muted">Stockage {(data.bytes / (1024 * 1024)).toFixed(2)} Mo</p>
          </Panel>
        </>
      ) : null}
    </div>
  );
}
