import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { importDocuments } from "@/lib/docuflow/api";
import { prepareFiles } from "@/lib/docuflow/prepare-file";
import type { ImportResult } from "@/lib/docuflow/types";
import { useOrg } from "@/components/shell";
import { Badge, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/import")({ component: ImportPage });

const STEPS = ["Format", "Taille", "Empreinte", "Doublon", "Stockage", "Extraction", "Classification"];

function ImportPage() {
  const { org, bump, tx } = useOrg();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [results, setResults] = useState<ImportResult[]>([]);

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setError("");
    setResults([]);
    try {
      const prepared = await prepareFiles([...list]);
      setNotes(prepared.errors);
      if (prepared.ok.length) {
        const out = await importDocuments({
          data: {
            orgId: org.id,
            folderId: null,
            files: prepared.ok.map(({ name, mime, size, sha256, text, pdfBase64 }) => ({ name, mime, size, sha256, text, pdfBase64: pdfBase64 ?? "" })),
          },
        });
        setResults(out);
        bump();
      }
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle
        title={tx("Importation", "Import")}
        lede={tx("PDF, Office, images, TXT, CSV ou ZIP. Le PDF original est conservé jusqu'à 1,2 Mo. Au-delà, le texte est extrait et une copie PDF peut être régénérée depuis les champs.", "PDF, Office, images, text, CSV or ZIP. Original PDFs are kept up to 1.2 MB.")}
      />
      <Panel>
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper px-4 text-center">
          <span className="text-sm font-medium">{busy ? tx("Traitement…", "Processing…") : tx("Déposez des fichiers ou parcourez", "Drop files or browse")}</span>
          <span className="mt-1 text-xs text-muted">20 Mo · lot de 12 · ZIP non imbriqué</span>
          <input className="sr-only" type="file" multiple disabled={busy || org.writesBlocked} onChange={(e) => void onFiles(e.target.files)} />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-line px-4 text-sm">
            {tx("Dossier", "Folder")}
            <input className="sr-only" type="file" multiple disabled={busy} {...{ webkitdirectory: "", directory: "" }} onChange={(e) => void onFiles(e.target.files)} />
          </label>
          <label className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-line px-4 text-sm">
            {tx("Caméra", "Camera")}
            <input className="sr-only" type="file" accept="image/*" capture="environment" disabled={busy} onChange={(e) => void onFiles(e.target.files)} />
          </label>
        </div>
        <ol className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          {STEPS.map((step) => <li key={step} className="rounded-md bg-paper px-2 py-1">{busy ? "…" : "·"} {step}</li>)}
        </ol>
      </Panel>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notes.map((n) => <p key={n} className="text-sm text-warn">{n}</p>)}
      {results.map((r) => (
        <Panel key={`${r.fileName}-${r.documentId}`}>
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{r.fileName}</p>
            <Badge value={r.status === "done" || r.status === "review" ? r.status : r.status} />
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{r.category ? `${r.category}. ` : ""}{r.message}</p>
        </Panel>
      ))}
      <p className="text-xs leading-5 text-muted">
        {tx("L'import cloud (Drive) et l'antivirus externe ne sont pas connectés. Le contrôle MIME, la signature de fichier, le refus des macros et la limite de décompression ZIP sont actifs.", "Cloud import and external antivirus are not connected. MIME, file signature, macro rejection and ZIP limits are active.")}
      </p>
    </div>
  );
}
