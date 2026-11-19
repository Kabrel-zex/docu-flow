import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getShared } from "@/lib/docuflow/api";
import { messageOf, Panel } from "@/components/kit";

export const Route = createFileRoute("/share/$token")({ component: SharePage });

function SharePage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<{ title: string; summary: string; category: string; excerpt: string; expiresAt: string } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getShared({ data: { token } }).then(setData).catch((e) => setError(messageOf(e)));
  }, [token]);
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-sm font-semibold">DOCUFLOW AI</p>
      {error ? <p className="mt-6 text-sm text-danger">{error}</p> : null}
      {data ? (
        <Panel className="mt-6">
          <p className="text-xs text-muted">{data.category} · expire {data.expiresAt.slice(0, 16)}</p>
          <h1 className="mt-2 text-2xl font-semibold">{data.title}</h1>
          <p className="mt-3 text-sm leading-6">{data.summary}</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm leading-6">{data.excerpt}</pre>
        </Panel>
      ) : !error ? <p className="mt-6 text-sm text-muted">Chargement du lien temporaire…</p> : null}
    </main>
  );
}
