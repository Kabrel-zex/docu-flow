import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { searchDocuments } from "@/lib/docuflow/api";
import { formatMoney } from "@/lib/docuflow/engine";
import type { DocRow } from "@/lib/docuflow/types";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/search")({ component: SearchPage });

const EXAMPLES = [
  "Trouve toutes les factures du fournisseur ABC supérieures à 500 000 FCFA",
  "Retrouve les contrats qui arrivent à expiration en décembre",
];

function SearchPage() {
  const { org, tx } = useOrg();
  const [q, setQ] = useState(EXAMPLES[0]);
  const [note, setNote] = useState("");
  const [rows, setRows] = useState<DocRow[]>([]);
  const [error, setError] = useState("");
  async function run(natural: boolean) {
    setError("");
    try {
      const res = await searchDocuments({ data: { orgId: org.id, q, natural } });
      setRows(res.documents);
      setNote(res.interpretation);
    } catch (e) {
      setError(messageOf(e));
    }
  }
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title={tx("Recherche intelligente", "Intelligent search")} lede={tx("Plein texte, métadonnées extraites, ou une phrase en français. Les filtres sont calculés ici, pas inventés.", "Full text, extracted metadata, or a French sentence.")} />
      <Field value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void run(true)}>{tx("Comprendre la phrase", "Understand the sentence")}</Button>
        <Button variant="ghost" onClick={() => void run(false)}>{tx("Plein texte", "Full text")}</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => <button key={ex} className="rounded-lg border border-line px-3 py-2 text-left text-xs" onClick={() => setQ(ex)}>{ex}</button>)}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {note ? <p className="text-xs leading-5 text-muted">{note}</p> : null}
      <Panel>
        {rows.length === 0 ? <p className="text-sm text-muted">{tx("Aucun résultat pour l'instant.", "No results yet.")}</p> : (
          <ul className="divide-y divide-line">
            {rows.map((doc) => (
              <li key={doc.id} className="py-3">
                <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="font-medium">{doc.title}</Link>
                <p className="text-xs text-muted">{doc.supplier} · {formatMoney(doc.amountTtc, doc.currency)} · {doc.dueDate ?? "—"}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
