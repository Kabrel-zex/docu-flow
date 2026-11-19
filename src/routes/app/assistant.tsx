import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ask, getMessages } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/assistant")({ component: AssistantPage });

const PROMPTS = [
  "Combien de factures ont été importées cette année ?",
  "Quels documents expirent ce mois-ci ?",
  "Quelle est la somme TTC des factures du fournisseur ABC ?",
];

function AssistantPage() {
  const { org, tx } = useOrg();
  const [conversationId, setConversationId] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; sources: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!conversationId) return;
    getMessages({ data: { orgId: org.id, conversationId } }).then((d) => setMessages(d.messages as typeof messages)).catch(() => undefined);
  }, [org.id, conversationId]);

  async function send(text: string) {
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    setQuestion("");
    setMessages((m) => [...m, { role: "user", content: text, sources: "" }]);
    try {
      const res = await ask({ data: { orgId: org.id, conversationId, question: text } });
      setConversationId(res.conversationId);
      setMessages((m) => [...m, { role: "assistant", content: res.answer, sources: res.sources.map((s) => s.title).join(" | ") }]);
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title="DOCUFLOW AI ASSISTANT" lede={tx("Les décomptes et les sommes viennent des champs extraits. Une réponse narrative cite les pièces accessibles et s'arrête si la donnée manque.", "Counts and sums come from extracted fields. Narrative answers cite accessible documents.")} />
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => <button key={p} className="rounded-lg border border-line px-3 py-2 text-left text-xs" onClick={() => void send(p)}>{p}</button>)}
      </div>
      <Panel className="min-h-64 space-y-4">
        {messages.length === 0 ? <p className="text-sm text-muted">Posez une question sur les documents de {org.name}.</p> : messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={m.role === "user" ? "text-sm" : "rounded-2xl bg-paper p-3 text-sm leading-6"}>
            <p className="text-xs text-muted">{m.role === "user" ? "Vous" : "Assistant"}</p>
            <p className="whitespace-pre-wrap">{m.content}</p>
            {m.sources ? <p className="mt-2 text-xs text-muted">Sources : {m.sources}</p> : null}
          </div>
        ))}
      </Panel>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void send(question); }}>
        <Field value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
        <Button disabled={busy}>{busy ? "…" : "Envoyer"}</Button>
      </form>
      <p className="text-xs leading-5 text-ai">L'assistant n'est pas un conseil juridique. Le contenu des documents est traité comme une donnée non fiable.</p>
    </div>
  );
}
