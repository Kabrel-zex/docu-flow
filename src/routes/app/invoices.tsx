import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnDocument, getInvoicePdf, getInvoices } from "@/lib/docuflow/api";
import { formatMoney } from "@/lib/docuflow/engine";
import { useOrg } from "@/components/shell";
import { Badge, Button, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/invoices")({ component: InvoicesPage });

type Row = Awaited<ReturnType<typeof getInvoices>>["invoices"][number];

function pdfBlob(base64: string): string {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}

function InvoicesPage() {
  const { org, tick, tx, bump } = useOrg();
  const [data, setData] = useState<Awaited<ReturnType<typeof getInvoices>> | null>(null);
  const [filter, setFilter] = useState<"all" | "unpaid" | "overdue" | "paid">("all");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ title: string; url: string; note: string } | null>(null);

  function load() {
    getInvoices({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
  }
  useEffect(load, [org.id, tick]);
  useEffect(() => () => { if (preview?.url) URL.revokeObjectURL(preview.url); }, [preview]);

  async function openPdf(row: Row, download: boolean) {
    setError("");
    try {
      const file = await getInvoicePdf({ data: { orgId: org.id, id: row.id } });
      const url = pdfBlob(file.base64);
      if (download) {
        const a = document.createElement("a");
        a.href = url;
        a.download = file.filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        return;
      }
      setPreview({ title: row.title, url, note: file.source === "original" ? tx("PDF d'origine", "Original PDF") : tx("Copie générée depuis les champs extraits", "Copy generated from extracted fields") });
    } catch (e) {
      setError(messageOf(e));
    }
  }

  async function pay(row: Row, status: "paid" | "unpaid" | "disputed") {
    setError("");
    try {
      await actOnDocument({ data: { orgId: org.id, id: row.id, action: { type: "payment", status } } });
      bump();
      load();
    } catch (e) {
      setError(messageOf(e));
    }
  }

  const rows = (data?.invoices ?? []).filter((row) => {
    if (filter === "unpaid") return row.paymentStatus === "unpaid";
    if (filter === "overdue") return row.overdue;
    if (filter === "paid") return row.paymentStatus === "paid";
    return true;
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageTitle
        title={tx("Factures", "Invoices")}
        lede={tx("Registre des pièces classées facture. Le PDF d'origine est conservé jusqu'à 1,2 Mo. Sinon, une copie est produite à partir des montants extraits.", "Invoice register. Original PDFs are kept up to 1.2 MB.")}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <Panel><p className="text-xs text-muted">{tx("Ouvertes", "Open")}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{data?.unpaidCount ?? "—"}</p></Panel>
        <Panel><p className="text-xs text-muted">{tx("En retard", "Overdue")}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{data?.overdueCount ?? "—"}</p></Panel>
        <Panel><p className="text-xs text-muted">{tx("TTC encore dû", "Outstanding incl. tax")}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{data ? formatMoney(data.unpaidTotal) : "—"}</p></Panel>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "unpaid", "overdue", "paid"] as const).map((key) => (
          <Button key={key} variant={filter === key ? "primary" : "ghost"} onClick={() => setFilter(key)}>
            {key === "all" ? tx("Toutes", "All") : key === "unpaid" ? tx("Impayées", "Unpaid") : key === "overdue" ? tx("En retard", "Overdue") : tx("Payées", "Paid")}
          </Button>
        ))}
      </div>
      <Panel>
        {rows.length === 0 ? <p className="text-sm text-muted">{tx("Aucune facture dans ce filtre. Importez un PDF ou chargez la démonstration.", "No invoice in this filter.")}</p> : (
          <ul className="divide-y divide-line">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <Link to="/app/documents/$documentId" params={{ documentId: row.id }} className="font-medium">{row.title}</Link>
                  <p className="text-xs text-muted">{row.supplier || tx("Fournisseur non extrait", "Supplier not extracted")} · {row.docNumber || "—"} · {tx("échéance", "due")} {row.dueDate ?? "—"}</p>
                  <p className="mt-1 text-sm tabular-nums">{formatMoney(row.amountTtc, row.currency)} <span className="text-muted">TTC</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge value={row.overdue ? "overdue" : row.paymentStatus} />
                  <Button variant="ghost" onClick={() => void openPdf(row, false)}>{tx("Aperçu", "Preview")}</Button>
                  <Button variant="ghost" onClick={() => void openPdf(row, true)}>{tx("Télécharger", "Download")}</Button>
                  {row.paymentStatus !== "paid" ? <Button onClick={() => void pay(row, "paid")}>{tx("Marquer payée", "Mark paid")}</Button> : <Button variant="ghost" onClick={() => void pay(row, "unpaid")}>{tx("Rouvrir", "Reopen")}</Button>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      {preview ? (
        <Panel>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium">{preview.title}</h2>
              <p className="text-xs text-muted">{preview.note}</p>
            </div>
            <Button variant="ghost" onClick={() => setPreview(null)}>{tx("Fermer", "Close")}</Button>
          </div>
          <iframe title={preview.title} src={preview.url} className="mt-3 h-[32rem] w-full rounded-lg border border-line bg-white" />
        </Panel>
      ) : null}
    </div>
  );
}
