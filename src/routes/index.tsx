import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/kit";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const { user, isPending } = useCurrentUserState();
  useEffect(() => {
    const saved = localStorage.getItem("docuflow.lang");
    if (saved === "en" || saved === "fr") setLang(saved);
    setReady(true);
  }, []);
  const en = lang === "en";
  const t = (fr: string, english: string) => (en ? english : fr);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <span className="text-sm font-semibold tracking-wide">DOCUFLOW AI</span>
        <div className="flex items-center gap-2">
          <button className="h-11 rounded-lg px-3 text-sm" onClick={() => { const next = en ? "fr" : "en"; localStorage.setItem("docuflow.lang", next); setLang(next); }}>
            {en ? "FR" : "EN"}
          </button>
          {!ready || isPending ? <span className="h-11 w-28 rounded-lg bg-line" /> : user ? (
            <Link to="/app" className="inline-flex h-11 items-center rounded-lg bg-ink px-4 text-sm font-medium text-white">{t("Ouvrir l'espace", "Open workspace")}</Link>
          ) : (
            <Link to="/login" className="inline-flex h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white">{t("Connexion", "Sign in")}</Link>
          )}
        </div>
      </header>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm text-sidefg/80">{t("GED pour l'Afrique francophone et au-delà", "Document operations for Francophone Africa and beyond")}</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {t("Vos documents, intelligemment organisés.", "Your documents, intelligently organized.")}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-sidefg/85">
              {t(
                "Importez un lot de factures. DOCUFLOW identifie le fournisseur, les montants, l'échéance, classe la pièce et la rend cherchable. Sans tableur parallèle.",
                "Import a stack of invoices. DOCUFLOW identifies the supplier, amounts, due date, files the document and makes it searchable.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login"><Button>{t("Créer un espace", "Create a workspace")}</Button></Link>
              <a href="#offres"><Button variant="ghost" className="bg-transparent text-white">{t("Voir les offres", "See plans")}</Button></a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="rounded-2xl bg-card p-4 text-ink">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>FAC-ABC-8841</span>
                <span className="rounded-md bg-ok/15 px-2 py-1 text-ok-ink">750 000 FCFA</span>
              </div>
              <p className="mt-3 text-lg font-medium">ABC Industries SA</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted">{t("Échéance", "Due")}</dt><dd className="font-medium">15/12/2026</dd></div>
                <div><dt className="text-muted">{t("Confiance", "Confidence")}</dt><dd className="font-medium">86 %</dd></div>
                <div><dt className="text-muted">{t("Classe", "Class")}</dt><dd className="font-medium">{t("Facture", "Invoice")}</dd></div>
                <div><dt className="text-muted">{t("Statut", "Status")}</dt><dd className="font-medium">{t("À valider", "Needs review")}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {[
          [t("Isolé par organisation", "Isolated per organization"), t("Chaque société a son espace, ses rôles et ses quotas. Un lecteur ne voit pas ce qu'un juriste traite.", "Each company has its own space, roles and quotas.")],
          [t("Extraction vérifiable", "Checkable extraction"), t("Chaque champ a une confiance et peut être validé ou rejeté. L'assistant cite ses sources.", "Every field has a confidence score and can be confirmed. The assistant cites sources.")],
          [t("Échéances tenues", "Deadlines kept"), t("Contrats, factures et pièces administratives alimentent des alertes internes.", "Contracts, invoices and admin documents feed internal alerts.")],
        ].map(([title, body]) => (
          <article key={title} className="rounded-3xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </article>
        ))}
      </section>

      <section id="offres" className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-2xl font-semibold tracking-tight">{t("Quatre formules, en FCFA", "Four plans, in FCFA")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {t("Essai 14 jours sur le périmètre Business. Ensuite, l'abonnement est encaissé par Stripe en euros, à la parité fixe du franc CFA. Aucun document n'est effacé si l'abonnement s'arrête.", "14-day trial on the Business scope. After that, Stripe collects the subscription in euros at the fixed CFA peg. Documents are kept if a subscription stops.")}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Starter", "5 000", t("2 utilisateurs · 2 Go · 500 documents / mois", "2 users · 2 GB · 500 documents / month")],
            ["Business", "15 000", t("5 utilisateurs · 20 Go · assistant et contrats", "5 users · 20 GB · assistant and contracts")],
            ["Professional", "35 000", t("15 utilisateurs · workflows, API, rapports", "15 users · workflows, API, reports")],
            ["Enterprise", "100 000", t("Multi-organisations et quotas sur contrat", "Multiple organizations and contracted quotas")],
          ].map(([name, price, body]) => (
            <article key={name} className="rounded-3xl border border-line bg-card p-5">
              <h3 className="text-lg font-medium">{name}</h3>
              <p className="mt-3 text-2xl font-semibold tabular-nums">{price} <span className="text-sm font-normal text-muted">FCFA</span></p>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-4 py-8 text-center text-xs text-muted">
        {t("La signature interne n'est pas une signature qualifiée. L'assistant ne constitue pas un avis juridique.", "Internal sign-off is not a qualified signature. The assistant is not legal advice.")}
      </footer>
    </div>
  );
}
