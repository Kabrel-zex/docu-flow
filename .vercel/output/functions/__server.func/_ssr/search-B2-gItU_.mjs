import { o as __toESM } from "../_runtime.mjs";
import { f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as searchDocuments } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-B2-gItU_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXAMPLES = ["Trouve toutes les factures du fournisseur ABC supérieures à 500 000 FCFA", "Retrouve les contrats qui arrivent à expiration en décembre"];
function SearchPage() {
	const { org, tx } = useOrg();
	const [q, setQ] = (0, import_react.useState)(EXAMPLES[0]);
	const [note, setNote] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	async function run(natural) {
		setError("");
		try {
			const res = await searchDocuments({ data: {
				orgId: org.id,
				q,
				natural
			} });
			setRows(res.documents);
			setNote(res.interpretation);
		} catch (e) {
			setError(messageOf(e));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: tx("Recherche intelligente", "Intelligent search"),
				lede: tx("Plein texte, métadonnées extraites, ou une phrase en français. Les filtres sont calculés ici, pas inventés.", "Full text, extracted metadata, or a French sentence.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				value: q,
				onChange: (e) => setQ(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void run(true),
					children: tx("Comprendre la phrase", "Understand the sentence")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => void run(false),
					children: tx("Plein texte", "Full text")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: EXAMPLES.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-lg border border-line px-3 py-2 text-left text-xs",
					onClick: () => setQ(ex),
					children: ex
				}, ex))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-5 text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: tx("Aucun résultat pour l'instant.", "No results yet.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: rows.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/documents/$documentId",
						params: { documentId: doc.id },
						className: "font-medium",
						children: doc.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							doc.supplier,
							" · ",
							formatMoney(doc.amountTtc, doc.currency),
							" · ",
							doc.dueDate ?? "—"
						]
					})]
				}, doc.id))
			}) })
		]
	});
}
//#endregion
export { SearchPage as component };
