import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as getShared } from "./api-DxdX6Upq.mjs";
import { c as messageOf, o as Panel } from "./kit-DSHZiqd4.mjs";
import { r as Route$4 } from "./router-DFFOnbxK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share._token-Cw8RziH9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SharePage() {
	const { token } = Route$4.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getShared({ data: { token } }).then(setData).catch((e) => setError(messageOf(e)));
	}, [token]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "DOCUFLOW AI"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-danger",
				children: error
			}) : null,
			data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							data.category,
							" · expire ",
							data.expiresAt.slice(0, 16)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl font-semibold",
						children: data.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6",
						children: data.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-4 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm leading-6",
						children: data.excerpt
					})
				]
			}) : !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Chargement du lien temporaire…"
			}) : null
		]
	});
}
//#endregion
export { SharePage as component };
