import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAlerts, readNotifications, saveAlerts } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/alerts")({ component: AlertsPage });

function AlertsPage() {
  const { org, bump } = useOrg();
  const [days, setDays] = useState("90,30,15,7,1");
  const [email, setEmail] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [sms, setSms] = useState(false);
  const [rows, setRows] = useState<{ id: string; label: string; due_on: string; kind: string }[]>([]);
  const [notes, setNotes] = useState<{ id: string; title: string; body: string; read: boolean }[]>([]);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    getAlerts({ data: { orgId: org.id } }).then((d) => {
      const deadlines = d.deadlines as { id: string; label: string; due_on: string; kind: string }[];
      setRows(deadlines);
      setNotes(d.notifications as { id: string; title: string; body: string; read: boolean }[]);
      const rule = d.rules as { days?: string; channel_email?: boolean; channel_whatsapp?: boolean; channel_sms?: boolean } | null;
      if (rule?.days) setDays(rule.days);
      setEmail(Boolean(rule?.channel_email));
      setWhatsapp(Boolean(rule?.channel_whatsapp));
      setSms(Boolean(rule?.channel_sms));
    }).catch((e) => setError(messageOf(e)));
  }, [org.id]);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title="Alertes" lede="Les notifications internes sont réelles. E-mail, WhatsApp et SMS sont des préférences en attente d'un connecteur." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Panel>
        <Field value={days} onChange={(e) => setDays(e.target.value)} />
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} /> E-mail</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} /> WhatsApp</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} /> SMS</label>
        </div>
        <Button className="mt-4" onClick={() => void saveAlerts({ data: { orgId: org.id, days, channels: { inapp: true, email, whatsapp, sms } } }).then((r) => setInfo(r.external)).catch((e) => setError(messageOf(e)))}>Enregistrer la règle</Button>
        {info ? <p className="mt-3 text-sm text-muted">{info}</p> : null}
      </Panel>
      <Panel>
        <div className="flex items-center justify-between"><h2 className="text-sm font-medium">Échéances</h2><Button variant="ghost" onClick={() => void readNotifications({ data: { orgId: org.id } }).then(() => bump())}>Marquer lues</Button></div>
        <ul className="mt-3 divide-y divide-line text-sm">
          {rows.map((r) => <li key={r.id} className="flex justify-between py-2"><span>{r.label}</span><span className="tabular-nums text-muted">{r.due_on}</span></li>)}
        </ul>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Notifications</h2>
        <ul className="mt-3 space-y-2 text-sm">{notes.map((n) => <li key={n.id}>{n.title} · {n.body}</li>)}</ul>
      </Panel>
    </div>
  );
}
