import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actOnTeam, getTeam } from "@/lib/docuflow/api";
import { ROLE_LABELS } from "@/lib/docuflow/engine";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/team")({ component: TeamPage });

const ROLES = Object.keys(ROLE_LABELS);

function TeamPage() {
  const { org } = useOrg();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("collaborator");
  const [dept, setDept] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof getTeam>> | null>(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  function load() { getTeam({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e))); }
  useEffect(load, [org.id]);
  const members = (data?.members ?? []) as { id: string; display_name: string; email: string; role: string }[];
  const invites = (data?.invites ?? []) as { id: string; email: string; role: string; token: string }[];
  const departments = (data?.departments ?? []) as { id: string; name: string }[];
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title="Utilisateurs" lede="Invitation par lien. Le compte rejoint l'organisation à la prochaine connexion avec le même e-mail." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Panel>
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <Field type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select className="h-11 rounded-lg border border-line bg-card px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          <Button onClick={() => void actOnTeam({ data: { orgId: org.id, type: "invite", email, role } }).then((r) => { if (r.token) setLink(`${window.location.origin}/login?invite=${r.token}`); setEmail(""); load(); }).catch((e) => setError(messageOf(e)))}>Inviter</Button>
        </div>
        {link ? <p className="mt-3 break-all text-xs">{link}</p> : null}
      </Panel>
      <Panel>
        <ul className="divide-y divide-line text-sm">
          {members.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span>{m.display_name || m.email} · {ROLE_LABELS[m.role] ?? m.role}</span>
              <Button variant="ghost" onClick={() => void actOnTeam({ data: { orgId: org.id, type: "remove", memberId: m.id } }).then(load).catch((e) => setError(messageOf(e)))}>Retirer</Button>
            </li>
          ))}
        </ul>
        {invites.length ? <p className="mt-3 text-xs text-muted">Invitations : {invites.map((i) => `${i.email} (${ROLE_LABELS[i.role] ?? i.role})`).join(", ")}</p> : null}
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Départements</h2>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void actOnTeam({ data: { orgId: org.id, type: "department", name: dept } }).then(() => { setDept(""); load(); }); }}>
          <Field value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Nom" />
          <Button>Ajouter</Button>
        </form>
        <p className="mt-3 text-sm">{departments.map((d) => d.name).join(" · ")}</p>
      </Panel>
    </div>
  );
}
