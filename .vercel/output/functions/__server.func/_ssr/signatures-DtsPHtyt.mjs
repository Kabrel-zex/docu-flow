import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as getSignatures, i as actOnSignature, y as getDocuments } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signatures-DtsPHtyt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignaturesPage() {
	const { org } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [docs, setDocs] = (0, import_react.useState)([]);
	const [docId, setDocId] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("internal_validation");
	const [signer, setSigner] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		getSignatures({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id]);
	(0, import_react.useEffect)(() => {
		getDocuments({ data: {
			orgId: org.id,
			q: "",
			status: "",
			folderId: ""
		} }).then((rows) => setDocs(rows.map((r) => ({
			id: r.id,
			title: r.title
		})))).catch(() => setDocs([]));
	}, [org.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Signatures",
				lede: data?.legalNote ?? "La valeur juridique dépend du prestataire et du droit applicable."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Préparer une demande"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-lg border border-line bg-card px-3 text-sm",
						value: docId,
						onChange: (e) => setDocId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Document"
						}), docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.title
						}, d.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-lg border border-line bg-card px-3 text-sm",
						value: provider,
						onChange: (e) => setProvider(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "internal_validation",
								children: "Validation interne (non qualifiée)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "docusign",
								children: "DocuSign — suivi seulement"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dropbox_sign",
								children: "Dropbox Sign — suivi seulement"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						placeholder: "Nom du signataire",
						value: signer,
						onChange: (e) => setSigner(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						placeholder: "E-mail",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !docId,
						onClick: () => void actOnSignature({ data: {
							orgId: org.id,
							type: "create",
							documentId: docId,
							provider,
							signers: [{
								name: signer,
								email
							}]
						} }).then(() => {
							setSigner("");
							setEmail("");
							load();
						}).catch((e) => setError(messageOf(e))),
						children: "Créer"
					})
				]
			})] }),
			(data?.requests)?.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: req.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						req.provider,
						" · ",
						req.integrity_sha256.slice(0, 16)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: req.status })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void actOnSignature({ data: {
							orgId: org.id,
							type: "send",
							requestId: req.id
						} }).then(load).catch((e) => setError(messageOf(e))),
						children: "Marquer envoyée"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void actOnSignature({ data: {
							orgId: org.id,
							type: "complete",
							requestId: req.id
						} }).then(load).catch((e) => setError(messageOf(e))),
						children: "Valider en interne"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void actOnSignature({ data: {
							orgId: org.id,
							type: "decline",
							requestId: req.id
						} }).then(load).catch((e) => setError(messageOf(e))),
						children: "Refuser"
					})
				]
			})] }, req.id))
		]
	});
}
//#endregion
export { SignaturesPage as component };
