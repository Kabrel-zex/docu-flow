import { o as __toESM } from "../_runtime.mjs";
import { f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as getDocuments } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-DJt27ZIv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocumentsPage() {
	const { org, tick, tx } = useOrg();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getDocuments({ data: {
			orgId: org.id,
			q,
			status,
			folderId: ""
		} }).then(setRows).catch((e) => setError(messageOf(e)));
	}, [
		org.id,
		tick,
		q,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: tx("Mes documents", "Documents"),
				lede: tx("Liste réelle de l'organisation active.", "Live list for the active organization.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					placeholder: tx("Titre, fournisseur, numéro", "Title, supplier, number"),
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-lg border border-line bg-card px-3 text-sm",
					value: status,
					onChange: (e) => setStatus(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: tx("Tous les statuts", "All statuses")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "review",
							children: "review"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "done",
							children: "done"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "archived",
							children: "archived"
						})
					]
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: !rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "…"
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: tx("Aucun document.", "No documents.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: rows.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-2 py-3 md:grid-cols-[1fr_auto_auto] md:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/documents/$documentId",
							params: { documentId: doc.id },
							className: "font-medium",
							children: doc.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								doc.categoryName,
								" · ",
								doc.fileName
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tabular-nums",
							children: formatMoney(doc.amountTtc, doc.currency)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: doc.archived ? "archived" : doc.status })
					]
				}, doc.id))
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/import",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					children: tx("Importer des fichiers", "Import files")
				})
			})
		]
	});
}
//#endregion
export { DocumentsPage as component };
