import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/docuflow/api";
import { formatMoney } from "@/lib/docuflow/engine";
import type { DocRow } from "@/lib/docuflow/types";
import { useOrg } from "@/components/shell";
import { Badge, Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/documents")({ component: DocumentsPage });

function DocumentsPage() {
  const { org, tick, tx } = useOrg();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<DocRow[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getDocuments({ data: { orgId: org.id, q, status, folderId: "" } }).then(setRows).catch((e) => setError(messageOf(e)));
  }, [org.id, tick, q, status]);
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageTitle title={tx("Mes documents", "Documents")} lede={tx("Liste réelle de l'organisation active.", "Live list for the active organization.")} />
      <div className="flex flex-wrap gap-2">
        <Field placeholder={tx("Titre, fournisseur, numéro", "Title, supplier, number")} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <select className="h-11 rounded-lg border border-line bg-card px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{tx("Tous les statuts", "All statuses")}</option>
          <option value="review">review</option>
          <option value="done">done</option>
          <option value="archived">archived</option>
        </select>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Panel>
        {!rows ? <p className="text-sm text-muted">…</p> : rows.length === 0 ? <p className="text-sm text-muted">{tx("Aucun document.", "No documents.")}</p> : (
          <ul className="divide-y divide-line">
            {rows.map((doc) => (
              <li key={doc.id} className="grid gap-2 py-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="font-medium">{doc.title}</Link>
                  <p className="text-xs text-muted">{doc.categoryName} · {doc.fileName}</p>
                </div>
                <span className="text-sm tabular-nums">{formatMoney(doc.amountTtc, doc.currency)}</span>
                <Badge value={doc.archived ? "archived" : doc.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Link to="/app/import"><Button variant="ghost">{tx("Importer des fichiers", "Import files")}</Button></Link>
    </div>
  );
}
