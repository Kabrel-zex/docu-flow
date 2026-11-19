import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
import { n as Button } from "./kit-DSHZiqd4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BZfESFg1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [lang, setLang] = (0, import_react.useState)("fr");
	const { user, isPending } = useCurrentUserState();
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("docuflow.lang");
		if (saved === "en" || saved === "fr") setLang(saved);
		setReady(true);
	}, []);
	const en = lang === "en";
	const t = (fr, english) => en ? english : fr;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold tracking-wide",
					children: "DOCUFLOW AI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "h-11 rounded-lg px-3 text-sm",
						onClick: () => {
							const next = en ? "fr" : "en";
							localStorage.setItem("docuflow.lang", next);
							setLang(next);
						},
						children: en ? "FR" : "EN"
					}), !ready || isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-11 w-28 rounded-lg bg-line" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						className: "inline-flex h-11 items-center rounded-lg bg-ink px-4 text-sm font-medium text-white",
						children: t("Ouvrir l'espace", "Open workspace")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "inline-flex h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white",
						children: t("Connexion", "Sign in")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-ink text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-sidefg/80",
							children: t("GED pour l'Afrique francophone et au-delà", "Document operations for Francophone Africa and beyond")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl",
							children: t("Vos documents, intelligemment organisés.", "Your documents, intelligently organized.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-lg text-base leading-7 text-sidefg/85",
							children: t("Importez un lot de factures. DOCUFLOW identifie le fournisseur, les montants, l'échéance, classe la pièce et la rend cherchable. Sans tableur parallèle.", "Import a stack of invoices. DOCUFLOW identifies the supplier, amounts, due date, files the document and makes it searchable.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: t("Créer un espace", "Create a workspace") })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#offres",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "bg-transparent text-white",
									children: t("Voir les offres", "See plans")
								})
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3xl border border-white/10 bg-white/5 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-4 text-ink",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FAC-ABC-8841" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-ok/15 px-2 py-1 text-ok-ink",
										children: "750 000 FCFA"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-lg font-medium",
									children: "ABC Industries SA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-4 grid grid-cols-2 gap-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: t("Échéance", "Due")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium",
											children: "15/12/2026"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: t("Confiance", "Confidence")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium",
											children: "86 %"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: t("Classe", "Class")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium",
											children: t("Facture", "Invoice")
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: t("Statut", "Status")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium",
											children: t("À valider", "Needs review")
										})] })
									]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3",
				children: [
					[t("Isolé par organisation", "Isolated per organization"), t("Chaque société a son espace, ses rôles et ses quotas. Un lecteur ne voit pas ce qu'un juriste traite.", "Each company has its own space, roles and quotas.")],
					[t("Extraction vérifiable", "Checkable extraction"), t("Chaque champ a une confiance et peut être validé ou rejeté. L'assistant cite ses sources.", "Every field has a confidence score and can be confirmed. The assistant cites sources.")],
					[t("Échéances tenues", "Deadlines kept"), t("Contrats, factures et pièces administratives alimentent des alertes internes.", "Contracts, invoices and admin documents feed internal alerts.")]
				].map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border border-line bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-medium",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted",
						children: body
					})]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "offres",
				className: "mx-auto max-w-6xl px-4 pb-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold tracking-tight",
						children: t("Quatre formules, en FCFA", "Four plans, in FCFA")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-6 text-muted",
						children: t("Essai 14 jours sur le périmètre Business. Ensuite, l'abonnement est encaissé par Stripe en euros, à la parité fixe du franc CFA. Aucun document n'est effacé si l'abonnement s'arrête.", "14-day trial on the Business scope. After that, Stripe collects the subscription in euros at the fixed CFA peg. Documents are kept if a subscription stops.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
						children: [
							[
								"Starter",
								"5 000",
								t("2 utilisateurs · 2 Go · 500 documents / mois", "2 users · 2 GB · 500 documents / month")
							],
							[
								"Business",
								"15 000",
								t("5 utilisateurs · 20 Go · assistant et contrats", "5 users · 20 GB · assistant and contracts")
							],
							[
								"Professional",
								"35 000",
								t("15 utilisateurs · workflows, API, rapports", "15 users · workflows, API, reports")
							],
							[
								"Enterprise",
								"100 000",
								t("Multi-organisations et quotas sur contrat", "Multiple organizations and contracted quotas")
							]
						].map(([name, price, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-3xl border border-line bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-medium",
									children: name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-2xl font-semibold tabular-nums",
									children: [
										price,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-normal text-muted",
											children: "FCFA"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-6 text-muted",
									children: body
								})
							]
						}, name))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line px-4 py-8 text-center text-xs text-muted",
				children: t("La signature interne n'est pas une signature qualifiée. L'assistant ne constitue pas un avis juridique.", "Internal sign-off is not a qualified signature. The assistant is not legal advice.")
			})
		]
	});
}
//#endregion
export { Home as component };
