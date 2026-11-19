import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createFolder, getFolders } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/folders")({ component: FoldersPage });

function FoldersPage() {
  const { org, tx } = useOrg();
  const [rows, setRows] = useState<{ id: string; name: string; parent_id: string | null; n: number }[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  function load() {
    getFolders({ data: { orgId: org.id } }).then((d) => setRows(d as typeof rows)).catch((e) => setError(messageOf(e)));
  }
  useEffect(load, [org.id]);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title={tx("Dossiers", "Folders")} lede={tx("Classement hiérarchique de l'espace principal.", "Hierarchy of the main workspace.")} />
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void createFolder({ data: { orgId: org.id, name, parentId: "" } }).then(() => { setName(""); load(); }).catch((err) => setError(messageOf(err))); }}>
        <Field value={name} onChange={(e) => setName(e.target.value)} placeholder={tx("Nouveau dossier", "New folder")} />
        <Button disabled={org.writesBlocked}>{tx("Créer", "Create")}</Button>
      </form>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Panel>
        <ul className="divide-y divide-line">
          {rows.map((f) => <li key={f.id} className="flex justify-between py-3 text-sm"><span>{f.name}</span><span className="tabular-nums text-muted">{f.n}</span></li>)}
        </ul>
      </Panel>
    </div>
  );
}
