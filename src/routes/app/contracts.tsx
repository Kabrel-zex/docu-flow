import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnContract, getContracts } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Badge, Button, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/contracts")({ component: ContractsPage });

type Contract = { id: string; document_id: string | null; title: string; status: string; counterparty: string; ends_on: string | null; auto_renew: boolean; notice_days: number; object_text: string };

function ContractsPage() {
  const { org } = useOrg();
  const [rows, setRows] = useState<Contract[]>([]);
  const [error, setError] = useState("");
  function load() { getContracts({ data: { orgId: org.id } }).then((d) => setRows(d as Contract[])).catch((e) => setError(messageOf(e))); }
  useEffect(load, [org.id]);
  const groups = ["active", "expiring", "pending_signature", "expired", "terminated"];
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageTitle title="Contrats" lede="Statuts recalculés à partir des dates de fin extraites. Le renouvellement tacite est un indicateur, pas un acte juridique." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {groups.map((status) => {
        const list = rows.filter((r) => r.status === status);
        if (!list.length) return null;
        return (
          <Panel key={status}>
            <div className="mb-2"><Badge value={status} /></div>
            <ul className="divide-y divide-line">
              {list.map((c) => (
                <li key={c.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted">{c.counterparty || "Partie non extraite"} · fin {c.ends_on ?? "—"} · préavis {c.notice_days} j · {c.auto_renew ? "reconduction" : "sans reconduction automatique"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c.document_id ? <Link to="/app/documents/$documentId" params={{ documentId: c.document_id }} className="text-sm text-primary">Pièce</Link> : null}
                      <Button variant="ghost" onClick={() => void actOnContract({ data: { orgId: org.id, id: c.id, status: "", autoRenew: !c.auto_renew } }).then(load).catch((e) => setError(messageOf(e)))}>Reconduction</Button>
                      <Button variant="ghost" onClick={() => void actOnContract({ data: { orgId: org.id, id: c.id, status: "terminated", autoRenew: null } }).then(load).catch((e) => setError(messageOf(e)))}>Résilier</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        );
      })}
      {rows.length === 0 ? <p className="text-sm text-muted">Aucun contrat. Importez une pièce contenant « contrat » et une date de fin.</p> : null}
    </div>
  );
}
