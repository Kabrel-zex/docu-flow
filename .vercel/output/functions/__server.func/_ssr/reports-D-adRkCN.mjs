import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as getReports } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-D-adRkCN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { org } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getReports({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}, [org.id]);
	function csv() {
		if (!data) return;
		const lines = [["categorie", "nombre"], ...data.byCategory.map((r) => [r.name, String(r.n)])];
		const blob = new Blob([lines.map((r) => r.map((c) => `"${c.replace(/"/g, "\"\"")}"`).join(",")).join("\n")], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "docuflow-rapport.csv";
		a.click();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-4xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Rapports",
				lede: "Agrégats de l'organisation. L'export CSV s'ouvre dans un tableur. L'impression du navigateur sert de PDF.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: csv,
						children: "Excel / CSV"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => window.print(),
						children: "Imprimer"
					})]
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Documents par mois"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-52",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data.months,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								width: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "n",
								fill: "var(--color-ink)",
								radius: 4
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Catégories et contrats"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 text-sm",
					children: data.byCategory.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: r.n
						})]
					}, r.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 text-sm",
					children: data.contracts.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						r.status,
						" · ",
						r.n
					] }, r.status))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: [
						"Stockage ",
						(data.bytes / 1048576).toFixed(2),
						" Mo"
					]
				})
			] })] }) : null
		]
	});
}
//#endregion
export { ReportsPage as component };
