import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { getSettings, saveSettings } from "@/lib/docuflow/api";
import { useOrg } from "@/components/shell";
import { Button, Field, PageTitle, Panel, messageOf } from "@/components/kit";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { org, reload } = useOrg();
  const [form, setForm] = useState({ name: "", legalName: "", address: "", country: "", phone: "", email: "", sector: "", taxId: "", retentionYears: "10" });
  const [category, setCategory] = useState("");
  const [tokenLabel, setTokenLabel] = useState("Intégration");
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState<{ id: string; user_agent: string; ip: string; created_at: string }[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");

  useEffect(() => {
    getSettings({ data: { orgId: org.id } }).then((d) => {
      const row = d.org as Record<string, string | number> | null;
      if (row) {
        setForm({
          name: String(row.name ?? ""), legalName: String(row.legal_name ?? ""), address: String(row.address ?? ""),
          country: String(row.country ?? ""), phone: String(row.phone ?? ""), email: String(row.email ?? ""),
          sector: String(row.sector ?? ""), taxId: String(row.tax_id ?? ""), retentionYears: String(row.retention_years ?? 10),
        });
      }
      setSessions(d.sessions as typeof sessions);
    }).catch((e) => setError(messageOf(e)));
  }, [org.id]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle title="Paramètres" lede="Profil d'organisation, conservation, sessions et jeton d'API. Le chiffrement de transport est celui de la plateforme. Les fichiers sont stockés en base, pas sur un volume local." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Panel>
        <div className="grid gap-2 md:grid-cols-2">
          <Field value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nom" />
          <Field value={form.legalName} onChange={(e) => set("legalName", e.target.value)} placeholder="Raison sociale" />
          <Field value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Adresse" />
          <Field value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Pays" />
          <Field value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Téléphone" />
          <Field value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="E-mail" />
          <Field value={form.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Secteur" />
          <Field value={form.taxId} onChange={(e) => set("taxId", e.target.value)} placeholder="Identifiant fiscal" />
          <Field value={form.retentionYears} onChange={(e) => set("retentionYears", e.target.value)} placeholder="Conservation (années)" />
        </div>
        <Button className="mt-3" onClick={() => void saveSettings({ data: { orgId: org.id, type: "org", ...form, retentionYears: Number(form.retentionYears) } }).then(() => { setInfo("Organisation enregistrée."); reload(); }).catch((e) => setError(messageOf(e)))}>Enregistrer</Button>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Catégorie propre</h2>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void saveSettings({ data: { orgId: org.id, type: "category", name: category } }).then(() => setCategory("")); }}>
          <Field value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex. Dossiers OHADA" />
          <Button>Ajouter</Button>
        </form>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Sessions et appareils</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2">
              <span className="truncate">{s.created_at} · {s.ip || "IP inconnue"} · {s.user_agent || "appareil"}</span>
              <Button variant="ghost" onClick={() => void saveSettings({ data: { orgId: org.id, type: "revoke_session", sessionId: s.id } }).then(() => setSessions((rows) => rows.filter((r) => r.id !== s.id)))}>Révoquer</Button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted">La double authentification applicative n'est pas disponible sur cette couche. Un compte Google peut imposer celle du fournisseur.</p>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">Mot de passe</h2>
        <div className="mt-3 grid gap-2">
          <Field type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} placeholder="Mot de passe actuel" />
          <Field type="password" value={newPassword} onChange={(e) => setNext(e.target.value)} placeholder="Nouveau mot de passe" />
          <Button variant="ghost" onClick={() => void authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true }).then((r) => { if (r.error) setError(r.error.message || "Échec"); else setInfo("Mot de passe mis à jour."); })}>Changer</Button>
        </div>
      </Panel>
      <Panel>
        <h2 className="text-sm font-medium">API Professional</h2>
        <p className="mt-1 text-xs leading-5 text-muted">POST /api/v1/documents avec Authorization: Bearer et un JSON title, fileName, text.</p>
        <div className="mt-3 flex gap-2">
          <Field value={tokenLabel} onChange={(e) => setTokenLabel(e.target.value)} />
          <Button onClick={() => void saveSettings({ data: { orgId: org.id, type: "token", label: tokenLabel } }).then((r) => { if (r.token) setToken(r.token); }).catch((e) => setError(messageOf(e)))}>Créer un jeton</Button>
        </div>
        {token ? <p className="mt-3 break-all text-xs">Copiez-le maintenant : {token}</p> : null}
      </Panel>
      {info ? <p className="text-sm text-ok-ink">{info}</p> : null}
    </div>
  );
}
