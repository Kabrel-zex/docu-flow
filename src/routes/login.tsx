import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button, Field } from "@/components/kit";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [ready, setReady] = useState(false);
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => setReady(true), []);

  if (ready && !isPending && user) return <Navigate to="/app" />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (password.length < 8) throw new Error("8 caractères minimum.");
      const result = mode === "up"
        ? await authClient.signUp.email({ email, password, name: name || email, callbackURL: "/app" })
        : await authClient.signIn.email({ email, password, callbackURL: "/app" });
      if (result.error) throw new Error(result.error.message || "Connexion impossible.");
      window.location.assign("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-line bg-card p-6">
        <Link to="/" className="text-sm font-semibold">DOCUFLOW AI</Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{mode === "up" ? "Créer un compte" : "Connexion"}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          L'espace est isolé par organisation. La vérification d'e-mail par message n'est pas branchée : le compte est actif dès l'inscription.
        </p>
        <form className="mt-6 space-y-3" onSubmit={submit}>
          {mode === "up" ? <Field placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /> : null}
          <Field type="email" required placeholder="E-mail professionnel" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <Field type="password" required placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button className="w-full" disabled={pending}>{pending ? "Patientez…" : mode === "up" ? "Créer l'espace" : "Entrer"}</Button>
        </form>
        <button className="mt-3 text-sm text-primary" onClick={() => setMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? "J'ai déjà un compte" : "Créer un compte"}
        </button>
        <div className="my-5 h-px bg-line" />
        <div className="space-y-2">
          {GROK_PROVIDERS.map((p) => (
            <Button key={p.providerId} variant="ghost" className="w-full" onClick={() => void signIn(p.providerId, { callbackURL: "/app" })}>
              Continuer avec {p.label}
            </Button>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">
          La réinitialisation par e-mail nécessite un canal d'envoi, non activé ici. La double authentification dépend du fournisseur Google lorsqu'il est utilisé.
        </p>
      </div>
    </main>
  );
}
