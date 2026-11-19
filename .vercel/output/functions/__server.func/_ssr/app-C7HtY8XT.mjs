import { o as __toESM } from "../_runtime.mjs";
import { f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as seedDemo, _ as getDashboard } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, n as Button, o as Panel, r as Empty, s as Stat, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-C7HtY8XT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { org, tick, bump, tx } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getDashboard({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}, [org.id, tick]);
	async function demo() {
		setBusy(true);
		try {
			await seedDemo({ data: { orgId: org.id } });
			bump();
		} catch (e) {
			setError(messageOf(e));
		} finally {
			setBusy(false);
		}
	}
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: tx("Chargement de l'espace…", "Loading workspace…")
	});
	const mb = (data.bytes / 1048576).toFixed(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: tx("Tableau de bord", "Dashboard"),
				lede: `${org.name} · ${data.planName}. ${tx("Les chiffres viennent des documents de cette organisation.", "Figures come from this organization's documents.")}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void demo(),
					disabled: busy || org.writesBlocked,
					children: busy ? "…" : tx("Charger un jeu de démonstration", "Load a demo set")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: tx("Documents", "Documents"),
						value: String(data.total),
						hint: `${data.month} / ${data.quotaDocs} ${tx("ce mois", "this month")}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: tx("À valider", "Needs review"),
						value: String(data.review)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: tx("Archivés", "Archived"),
						value: String(data.archived)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: tx("Stockage", "Storage"),
						value: `${mb} Mo`,
						hint: `/ ${data.quotaMb} Mo`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1.3fr_0.7fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: tx("Répartition", "Breakdown")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-56",
					children: data.byCategory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: tx("Aucun document classé.", "Nothing classified yet.")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: data.byCategory,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: { fontSize: 11 },
									interval: 0,
									hide: data.byCategory.length > 6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									allowDecimals: false,
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "n",
									fill: "var(--color-primary)",
									radius: 4
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: tx("Recommandations", "Recommendations")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm leading-6",
						children: data.recommendations.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 text-sm font-medium",
						children: tx("Échéances 30 jours", "Due in 30 days")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: data.deadlines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: tx("Aucune.", "None.")
						}) : data.deadlines.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: d.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: d.due_on
							})]
						}, d.id))
					})
				] })]
			}),
			data.total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: tx("L'espace est vide", "The workspace is empty"),
				body: tx("Chargez le jeu de démonstration pour voir factures, bail et bulletin, ou importez vos fichiers.", "Load the demo set, or import your own files."),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/import",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						children: tx("Importer", "Import")
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: tx("Derniers documents", "Latest documents")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line",
				children: data.recent.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/documents/$documentId",
						params: { documentId: doc.id },
						className: "font-medium",
						children: doc.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							doc.categoryName,
							" · ",
							doc.supplier || tx("émetteur non lu", "issuer unread")
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatMoney(doc.amountTtc, doc.currency)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: doc.status })]
					})]
				}, doc.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: tx("Activité", "Activity")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 text-sm text-muted",
				children: data.activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("Aucune action enregistrée.", "No recorded action.") }) : data.activity.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					a.created_at,
					" · ",
					a.action,
					" · ",
					a.detail
				] }, `${a.created_at}-${i}`))
			})] })
		]
	});
}
//#endregion
export { Dashboard as component };
