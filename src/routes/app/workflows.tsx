import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnWorkflow, getWorkflows } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Badge, Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/workflows")({ component: WorkflowsPage });

function WorkflowsPage() {
  const { org } = useOrg();
  const [data, setData] = useState<Awaited<ReturnType<typeof getWorkflows>> | null>(null);
  const [name, setName] = useState("");
  const [steps, setSteps] = useState("Réception, Contrôle, Archivage");
  const [error, setError] = useState("");
  function load() { getWorkflows({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e))); }
  useEffect(load, [org.id]);
  const stepRows = (data?.steps ?? []) as { workflow_id: string; position: number; name: string }[];
  const runs = (data?.runs ?? []) as { id: string; document_title: string; workflow_name: string; current_step: number; status: string }[];
  const flows = (data?.workflows ?? []) as { id: string; name: string; trigger_category: string; active: boolean }[];
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title="Workflows" lede="Trois circuits sont livrés (facture, contrat, RH). Un circuit personnalisé demande l'offre Professional. L'éditeur est une liste d'étapes, pas un canevas graphique." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {flows.map((wf) => (
        <Panel key={wf.id}>
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{wf.name}</p>
            <Badge value={wf.active ? "active" : "draft"} />
          </div>
          <p className="mt-1 text-xs text-muted">Déclencheur : {wf.trigger_category || "manuel"}</p>
          <ol className="mt-3 space-y-1 text-sm">
            {stepRows.filter((s) => s.workflow_id === wf.id).map((s) => <li key={`${wf.id}-${s.position}`}>{s.position + 1}. {s.name}</li>)}
          </ol>
          <Button className="mt-3" variant="ghost" onClick={() => void actOnWorkflow({ data: { orgId: org.id, type: "toggle", workflowId: wf.id } }).then(load).catch((e) => setError(messageOf(e)))}>Activer / suspendre</Button>
        </Panel>
      ))}
      <Panel>
        <h2 className="text-sm font-medium">Nouveau circuit</h2>
        <div className="mt-3 grid gap-2">
          <Field value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
          <Field value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Étapes séparées par des virgules" />
          <Button onClick={() => void actOnWorkflow({ data: { orgId: org.id, type: "create", name, trigger: "", steps: steps.split(",").map((s) => ({ name: s.trim() })).filter((s) => s.name) } }).then(() => { setName(""); load(); }).catch((e) => setError(messageOf(e)))}>Créer</Button>
        </div>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Exécutions</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {runs.map((run) => (
            <li key={run.id} className="flex flex-wrap items-center justify-between gap-2">
              <span>{run.workflow_name} · {run.document_title} · étape {run.current_step + 1} · {run.status}</span>
              {run.status === "running" ? <Button variant="ghost" onClick={() => void actOnWorkflow({ data: { orgId: org.id, type: "advance", runId: run.id } }).then(load).catch((e) => setError(messageOf(e)))}>Avancer</Button> : null}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
