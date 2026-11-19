import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnSignature, getDocuments, getSignatures } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Badge, Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/signatures")({ component: SignaturesPage });

function SignaturesPage() {
  const { org } = useOrg();
  const [data, setData] = useState<Awaited<ReturnType<typeof getSignatures>> | null>(null);
  const [docs, setDocs] = useState<{ id: string; title: string }[]>([]);
  const [docId, setDocId] = useState("");
  const [provider, setProvider] = useState("internal_validation");
  const [signer, setSigner] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  function load() { getSignatures({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e))); }
  useEffect(load, [org.id]);
  useEffect(() => { getDocuments({ data: { orgId: org.id, q: "", status: "", folderId: "" } }).then((rows) => setDocs(rows.map((r) => ({ id: r.id, title: r.title })))).catch(() => setDocs([])); }, [org.id]);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title="Signatures" lede={data?.legalNote ?? "La valeur juridique dépend du prestataire et du droit applicable."} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Panel>
        <h2 className="text-sm font-medium">Préparer une demande</h2>
        <div className="mt-3 grid gap-2">
          <select className="h-11 rounded-lg border border-line bg-card px-3 text-sm" value={docId} onChange={(e) => setDocId(e.target.value)}>
            <option value="">Document</option>
            {docs.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
          <select className="h-11 rounded-lg border border-line bg-card px-3 text-sm" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="internal_validation">Validation interne (non qualifiée)</option>
            <option value="docusign">DocuSign — suivi seulement</option>
            <option value="dropbox_sign">Dropbox Sign — suivi seulement</option>
          </select>
          <Field placeholder="Nom du signataire" value={signer} onChange={(e) => setSigner(e.target.value)} />
          <Field placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button disabled={!docId} onClick={() => void actOnSignature({ data: { orgId: org.id, type: "create", documentId: docId, provider, signers: [{ name: signer, email }] } }).then(() => { setSigner(""); setEmail(""); load(); }).catch((e) => setError(messageOf(e)))}>Créer</Button>
        </div>
      </Panel>
      {(data?.requests as { id: string; title: string; provider: string; status: string; integrity_sha256: string }[] | undefined)?.map((req) => (
        <Panel key={req.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">{req.title}</p>
              <p className="text-xs text-muted">{req.provider} · {req.integrity_sha256.slice(0, 16)}</p>
            </div>
            <Badge value={req.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => void actOnSignature({ data: { orgId: org.id, type: "send", requestId: req.id } }).then(load).catch((e) => setError(messageOf(e)))}>Marquer envoyée</Button>
            <Button variant="ghost" onClick={() => void actOnSignature({ data: { orgId: org.id, type: "complete", requestId: req.id } }).then(load).catch((e) => setError(messageOf(e)))}>Valider en interne</Button>
            <Button variant="ghost" onClick={() => void actOnSignature({ data: { orgId: org.id, type: "decline", requestId: req.id } }).then(load).catch((e) => setError(messageOf(e)))}>Refuser</Button>
          </div>
        </Panel>
      ))}
    </div>
  );
}
