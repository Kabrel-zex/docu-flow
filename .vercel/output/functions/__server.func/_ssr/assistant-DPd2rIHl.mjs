import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as getMessages, s as ask } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant-DPd2rIHl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROMPTS = [
	"Combien de factures ont été importées cette année ?",
	"Quels documents expirent ce mois-ci ?",
	"Quelle est la somme TTC des factures du fournisseur ABC ?"
];
function AssistantPage() {
	const { org, tx } = useOrg();
	const [conversationId, setConversationId] = (0, import_react.useState)("");
	const [question, setQuestion] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!conversationId) return;
		getMessages({ data: {
			orgId: org.id,
			conversationId
		} }).then((d) => setMessages(d.messages)).catch(() => void 0);
	}, [org.id, conversationId]);
	async function send(text) {
		if (!text.trim()) return;
		setBusy(true);
		setError("");
		setQuestion("");
		setMessages((m) => [...m, {
			role: "user",
			content: text,
			sources: ""
		}]);
		try {
			const res = await ask({ data: {
				orgId: org.id,
				conversationId,
				question: text
			} });
			setConversationId(res.conversationId);
			setMessages((m) => [...m, {
				role: "assistant",
				content: res.answer,
				sources: res.sources.map((s) => s.title).join(" | ")
			}]);
		} catch (e) {
			setError(messageOf(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "DOCUFLOW AI ASSISTANT",
				lede: tx("Les décomptes et les sommes viennent des champs extraits. Une réponse narrative cite les pièces accessibles et s'arrête si la donnée manque.", "Counts and sums come from extracted fields. Narrative answers cite accessible documents.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-lg border border-line px-3 py-2 text-left text-xs",
					onClick: () => void send(p),
					children: p
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "min-h-64 space-y-4",
				children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Posez une question sur les documents de ",
						org.name,
						"."
					]
				}) : messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: m.role === "user" ? "text-sm" : "rounded-2xl bg-paper p-3 text-sm leading-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: m.role === "user" ? "Vous" : "Assistant"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap",
							children: m.content
						}),
						m.sources ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: ["Sources : ", m.sources]
						}) : null
					]
				}, `${m.role}-${i}`))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					send(question);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					value: question,
					onChange: (e) => setQuestion(e.target.value),
					placeholder: "Question"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					children: busy ? "…" : "Envoyer"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-5 text-ai",
				children: "L'assistant n'est pas un conseil juridique. Le contenu des documents est traité comme une donnée non fiable."
			})
		]
	});
}
//#endregion
export { AssistantPage as component };
