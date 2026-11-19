import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as getContracts, n as actOnContract } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contracts-CQ9209-m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContractsPage() {
	const { org } = useOrg();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		getContracts({ data: { orgId: org.id } }).then((d) => setRows(d)).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-4xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Contrats",
				lede: "Statuts recalculés à partir des dates de fin extraites. Le renouvellement tacite est un indicateur, pas un acte juridique."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			[
				"active",
				"expiring",
				"pending_signature",
				"expired",
				"terminated"
			].map((status) => {
				const list = rows.filter((r) => r.status === status);
				if (!list.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: status })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line",
					children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									c.counterparty || "Partie non extraite",
									" · fin ",
									c.ends_on ?? "—",
									" · préavis ",
									c.notice_days,
									" j · ",
									c.auto_renew ? "reconduction" : "sans reconduction automatique"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									c.document_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/app/documents/$documentId",
										params: { documentId: c.document_id },
										className: "text-sm text-primary",
										children: "Pièce"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void actOnContract({ data: {
											orgId: org.id,
											id: c.id,
											status: "",
											autoRenew: !c.auto_renew
										} }).then(load).catch((e) => setError(messageOf(e))),
										children: "Reconduction"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void actOnContract({ data: {
											orgId: org.id,
											id: c.id,
											status: "terminated",
											autoRenew: null
										} }).then(load).catch((e) => setError(messageOf(e))),
										children: "Résilier"
									})
								]
							})]
						})
					}, c.id))
				})] }, status);
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Aucun contrat. Importez une pièce contenant « contrat » et une date de fin."
			}) : null
		]
	});
}
//#endregion
export { ContractsPage as component };
