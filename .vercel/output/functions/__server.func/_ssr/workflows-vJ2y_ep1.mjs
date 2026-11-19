import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as getWorkflows, o as actOnWorkflow } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflows-vJ2y_ep1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkflowsPage() {
	const { org } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [steps, setSteps] = (0, import_react.useState)("Réception, Contrôle, Archivage");
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		getWorkflows({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id]);
	const stepRows = data?.steps ?? [];
	const runs = data?.runs ?? [];
	const flows = data?.workflows ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Workflows",
				lede: "Trois circuits sont livrés (facture, contrat, RH). Un circuit personnalisé demande l'offre Professional. L'éditeur est une liste d'étapes, pas un canevas graphique."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			flows.map((wf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: wf.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: wf.active ? "active" : "draft" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted",
					children: ["Déclencheur : ", wf.trigger_category || "manuel"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-3 space-y-1 text-sm",
					children: stepRows.filter((s) => s.workflow_id === wf.id).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						s.position + 1,
						". ",
						s.name
					] }, `${wf.id}-${s.position}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					variant: "ghost",
					onClick: () => void actOnWorkflow({ data: {
						orgId: org.id,
						type: "toggle",
						workflowId: wf.id
					} }).then(load).catch((e) => setError(messageOf(e))),
					children: "Activer / suspendre"
				})
			] }, wf.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Nouveau circuit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Nom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: steps,
						onChange: (e) => setSteps(e.target.value),
						placeholder: "Étapes séparées par des virgules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void actOnWorkflow({ data: {
							orgId: org.id,
							type: "create",
							name,
							trigger: "",
							steps: steps.split(",").map((s) => ({ name: s.trim() })).filter((s) => s.name)
						} }).then(() => {
							setName("");
							load();
						}).catch((e) => setError(messageOf(e))),
						children: "Créer"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Exécutions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3 text-sm",
				children: runs.map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						run.workflow_name,
						" · ",
						run.document_title,
						" · étape ",
						run.current_step + 1,
						" · ",
						run.status
					] }), run.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void actOnWorkflow({ data: {
							orgId: org.id,
							type: "advance",
							runId: run.id
						} }).then(load).catch((e) => setError(messageOf(e))),
						children: "Avancer"
					}) : null]
				}, run.id))
			})] })
		]
	});
}
//#endregion
export { WorkflowsPage as component };
