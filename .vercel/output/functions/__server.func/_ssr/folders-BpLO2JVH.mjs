import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as getFolders, l as createFolder } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/folders-BpLO2JVH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FoldersPage() {
	const { org, tx } = useOrg();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		getFolders({ data: { orgId: org.id } }).then((d) => setRows(d)).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: tx("Dossiers", "Folders"),
				lede: tx("Classement hiérarchique de l'espace principal.", "Hierarchy of the main workspace.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					createFolder({ data: {
						orgId: org.id,
						name,
						parentId: ""
					} }).then(() => {
						setName("");
						load();
					}).catch((err) => setError(messageOf(err)));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: tx("Nouveau dossier", "New folder")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: org.writesBlocked,
					children: tx("Créer", "Create")
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: rows.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: f.n
					})]
				}, f.id))
			}) })
		]
	});
}
//#endregion
export { FoldersPage as component };
