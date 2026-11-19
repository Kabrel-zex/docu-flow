import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as saveAlerts, f as getAlerts, j as readNotifications } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-BZK-RC7g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const { org, bump } = useOrg();
	const [days, setDays] = (0, import_react.useState)("90,30,15,7,1");
	const [email, setEmail] = (0, import_react.useState)(false);
	const [whatsapp, setWhatsapp] = (0, import_react.useState)(false);
	const [sms, setSms] = (0, import_react.useState)(false);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [info, setInfo] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getAlerts({ data: { orgId: org.id } }).then((d) => {
			const deadlines = d.deadlines;
			setRows(deadlines);
			setNotes(d.notifications);
			const rule = d.rules;
			if (rule?.days) setDays(rule.days);
			setEmail(Boolean(rule?.channel_email));
			setWhatsapp(Boolean(rule?.channel_whatsapp));
			setSms(Boolean(rule?.channel_sms));
		}).catch((e) => setError(messageOf(e)));
	}, [org.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Alertes",
				lede: "Les notifications internes sont réelles. E-mail, WhatsApp et SMS sont des préférences en attente d'un connecteur."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					value: days,
					onChange: (e) => setDays(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: email,
								onChange: (e) => setEmail(e.target.checked)
							}), " E-mail"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: whatsapp,
								onChange: (e) => setWhatsapp(e.target.checked)
							}), " WhatsApp"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: sms,
								onChange: (e) => setSms(e.target.checked)
							}), " SMS"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: () => void saveAlerts({ data: {
						orgId: org.id,
						days,
						channels: {
							inapp: true,
							email,
							whatsapp,
							sms
						}
					} }).then((r) => setInfo(r.external)).catch((e) => setError(messageOf(e))),
					children: "Enregistrer la règle"
				}),
				info ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: info
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Échéances"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => void readNotifications({ data: { orgId: org.id } }).then(() => bump()),
					children: "Marquer lues"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line text-sm",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: r.due_on
					})]
				}, r.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Notifications"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 text-sm",
				children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					n.title,
					" · ",
					n.body
				] }, n.id))
			})] })
		]
	});
}
//#endregion
export { AlertsPage as component };
