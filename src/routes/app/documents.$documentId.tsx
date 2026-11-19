import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnDocument, compareDocs, getDocument, getDocuments, getInvoicePdf } from "@/lib/docuflow/api";
import { formatMoney } from "@/lib/docuflow/engine";
import { useOrg } from "@/components/shell";
import { Badge, Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/documents/$documentId")({ component: DocumentPage });

type Detail = Awaited<ReturnType<typeof getDocument>>;

function DocumentPage() {
  const { documentId } = Route.useParams();
  const { org, bump } = useOrg();
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [task, setTask] = useState("");
  const [other, setOther] = useState("");
  const [peers, setPeers] = useState<{ id: string; title: string }[]>([]);
  const [compare, setCompare] = useState<Awaited<ReturnType<typeof compareDocs>> | null>(null);
  const [share, setShare] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfNote, setPdfNote] = useState("");

  function load() {
    getDocument({ data: { orgId: org.id, id: documentId } }).then(setData).catch((e) => setError(messageOf(e)));
  }
  useEffect(() => { load(); }, [org.id, documentId]);
  useEffect(() => {
    getDocuments({ data: { orgId: org.id, q: "", status: "", folderId: "" } })
      .then((rows) => setPeers(rows.filter((r) => r.id !== documentId).map((r) => ({ id: r.id, title: r.title }))))
      .catch(() => setPeers([]));
  }, [org.id, documentId]);

  async function run(action: Record<string, unknown>) {
    setError("");
    try {
      const res = await actOnDocument({ data: { orgId: org.id, id: documentId, action } });
      if (res.token) setShare(`${window.location.origin}/share/${res.token}`);
      bump();
      load();
    } catch (e) {
      setError(messageOf(e));
    }
  }

  if (!data && !error) return <p className="text-sm text-muted">…</p>;
  if (!data) return <p className="text-sm text-danger">{error}</p>;
  const doc = data.doc;
  const showPdf = doc.categorySlug === "facture" || doc.hasOriginal;

  async function openStoredPdf(download: boolean) {
    setError("");
    const file = await getInvoicePdf({ data: { orgId: org.id, id: documentId } });
    const bin = atob(file.base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    if (download) {
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      return;
    }
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(url);
    setPdfNote(file.source === "original" ? "PDF d'origine" : "Copie générée depuis les champs extraits");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageTitle title={doc.title} lede={doc.summary} action={<Link to="/app/documents"><Button variant="ghost">Retour</Button></Link>} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Badge value={doc.status} />
        <Badge value={doc.categorySlug} />
        <span className="text-sm text-muted">{Math.round(doc.confidence * 100)} % · {doc.sha256.slice(0, 12)}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {showPdf ? (
          <Panel className="lg:col-span-2">
            <h2 className="text-sm font-medium">PDF</h2>
            <p className="mt-1 text-xs text-muted">{doc.hasOriginal ? "Fichier d'origine conservé." : "Pas de PDF d'origine : une copie peut être produite."} {doc.categorySlug === "facture" ? `Paiement : ${doc.paymentStatus}.` : ""}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => void openStoredPdf(false).catch((e) => setError(messageOf(e)))}>Aperçu</Button>
              <Button variant="ghost" onClick={() => void openStoredPdf(true).catch((e) => setError(messageOf(e)))}>Télécharger</Button>
              {doc.categorySlug === "facture" && doc.paymentStatus !== "paid" ? <Button onClick={() => void run({ type: "payment", status: "paid" })}>Marquer payée</Button> : null}
              {doc.categorySlug === "facture" && doc.paymentStatus === "paid" ? <Button variant="ghost" onClick={() => void run({ type: "payment", status: "unpaid" })}>Rouvrir</Button> : null}
            </div>
            {pdfNote ? <p className="mt-2 text-xs text-muted">{pdfNote}</p> : null}
            {pdfUrl ? <iframe title="PDF" src={pdfUrl} className="mt-3 h-80 w-full rounded-lg border border-line bg-white" /> : null}
          </Panel>
        ) : null}
        <Panel>
          <h2 className="text-sm font-medium">Champs extraits</h2>
          <p className="mt-1 text-xs leading-5 text-muted">Une confiance basse reste « suggested » jusqu'à validation humaine. Ce n'est pas une certification.</p>
          <ul className="mt-3 divide-y divide-line">
            {data.fields.map((field) => {
              const row = field as { id: string; label: string; value: string; confidence: number; status: string; data_type: string };
              const shown = row.data_type === "money" ? formatMoney(Number(row.value)) : row.value;
              return (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-xs text-muted">{row.label} · {Math.round(Number(row.confidence) * 100)} %</p>
                    <p className="text-sm">{shown}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge value={row.status} />
                    {row.status === "suggested" ? (
                      <>
                        <Button variant="ghost" onClick={() => void run({ type: "validate_field", extractionId: row.id, decision: "validated" })}>Valider</Button>
                        <Button variant="ghost" onClick={() => void run({ type: "validate_field", extractionId: row.id, decision: "rejected" })}>Rejeter</Button>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel>
            <h2 className="text-sm font-medium">Contenu indexé</h2>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-sm leading-6">{doc.content}</pre>
          </Panel>
          <Panel className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => void run({ type: "archive" })}>Archiver</Button>
            <Button variant="ghost" onClick={() => void run({ type: "restore" })}>Désarchiver</Button>
            <Button variant="ghost" onClick={() => void run({ type: "ai_extract" })}>Analyse IA</Button>
            <label className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-line px-4 text-sm">
              OCR image
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file || file.size > 1_200_000) {
                  setError("Image requise, 1,2 Mo maximum.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = typeof reader.result === "string" ? reader.result : "";
                  void run({ type: "ai_ocr", dataUrl });
                };
                reader.readAsDataURL(file);
              }} />
            </label>
            <Button variant="danger" onClick={() => void run({ type: "trash" })}>Supprimer</Button>
            <Button variant="ghost" onClick={() => void run({ type: "share" })}>Lien 7 jours</Button>
          </Panel>
          {share ? <p className="break-all text-sm">{share}</p> : null}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-sm font-medium">Commentaire</h2>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void run({ type: "comment", body: comment }); setComment(""); }}>
            <Field value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Note interne" />
            <Button type="submit">Publier</Button>
          </form>
          <ul className="mt-4 space-y-3 text-sm">
            {data.comments.map((c) => {
              const row = c as { id: string; author_name: string; body: string; created_at: string };
              return <li key={row.id}><span className="font-medium">{row.author_name}</span> · <span className="text-muted">{row.created_at}</span><p>{row.body}</p></li>;
            })}
          </ul>
        </Panel>
        <Panel>
          <h2 className="text-sm font-medium">Tâche ou validation</h2>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void run({ type: "task", title: task, kind: "approval" }); setTask(""); }}>
            <Field value={task} onChange={(e) => setTask(e.target.value)} placeholder="Demander une validation" />
            <Button type="submit">Assigner</Button>
          </form>
          <ul className="mt-4 space-y-2 text-sm">
            {data.tasks.map((t) => {
              const row = t as { id: string; title: string; status: string };
              return (
                <li key={row.id} className="flex items-center justify-between gap-2">
                  <span>{row.title}</span>
                  {row.status === "open" ? <Button variant="ghost" onClick={() => void run({ type: "task_status", taskId: row.id, status: "done" })}>Clôturer</Button> : <Badge value="done" />}
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
      <Panel>
        <h2 className="text-sm font-medium">Comparer</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select className="h-11 rounded-lg border border-line bg-card px-3 text-sm" value={other} onChange={(e) => setOther(e.target.value)}>
            <option value="">Second document</option>
            {peers.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <Button variant="ghost" disabled={!other} onClick={() => void compareDocs({ data: { orgId: org.id, a: documentId, b: other, useAi: false } }).then(setCompare).catch((e) => setError(messageOf(e)))}>Métadonnées</Button>
          <Button disabled={!other} onClick={() => void compareDocs({ data: { orgId: org.id, a: documentId, b: other, useAi: true } }).then(setCompare).catch((e) => setError(messageOf(e)))}>Comparer avec l'IA</Button>
        </div>
        {compare ? (
          <div className="mt-4">
            <p className="text-sm leading-6">{compare.narrative}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {compare.rows.map((row) => <li key={row.label}><span className="text-muted">{row.label}.</span> {row.a} → {row.b}</li>)}
            </ul>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
