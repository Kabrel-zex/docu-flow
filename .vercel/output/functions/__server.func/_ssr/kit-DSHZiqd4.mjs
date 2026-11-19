import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kit-DSHZiqd4.js
var import_jsx_runtime = require_jsx_runtime();
function messageOf(error) {
	return error instanceof Error ? error.message : "Une erreur est survenue.";
}
function Button({ variant = "primary", className = "", ...props }) {
	const look = {
		primary: "bg-primary text-white",
		ghost: "border border-line bg-card text-ink",
		danger: "bg-danger text-white",
		ink: "bg-ink text-white"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: `inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${look} ${className}`,
		...props
	});
}
function Field({ className = "", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: `h-11 w-full rounded-lg border border-line bg-card px-3 text-sm outline-none ${className}`,
		...props
	});
}
function Panel({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `rounded-3xl border border-line bg-card p-4 md:p-5 ${className}`,
		children
	});
}
function PageTitle({ title, lede, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: title
		}), lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm leading-6 text-muted",
			children: lede
		}) : null] }), action]
	});
}
var STATUS = {
	done: "bg-ok/15 text-ok-ink",
	review: "bg-amber-100 text-warn",
	failed: "bg-red-100 text-danger",
	duplicate: "bg-slate-100 text-muted",
	active: "bg-ok/15 text-ok-ink",
	expiring: "bg-amber-100 text-warn",
	expired: "bg-red-100 text-danger",
	terminated: "bg-slate-100 text-muted",
	pending_signature: "bg-amber-100 text-warn",
	signed_internal: "bg-ok/15 text-ok-ink",
	sent: "bg-primary/10 text-primary",
	draft: "bg-slate-100 text-muted",
	declined: "bg-red-100 text-danger",
	trial: "bg-primary/10 text-primary",
	cancelled: "bg-slate-100 text-muted",
	suspended: "bg-red-100 text-danger",
	paid: "bg-ok/15 text-ok-ink",
	unpaid: "bg-amber-100 text-warn",
	disputed: "bg-red-100 text-danger",
	overdue: "bg-red-100 text-danger"
};
function Badge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex rounded-md px-2 py-1 text-xs font-medium ${STATUS[value] ?? "bg-slate-100 text-ink"}`,
		children: value
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-2xl font-semibold tabular-nums tracking-tight",
			children: value
		}),
		hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: hint
		}) : null
	] });
}
function Empty({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm leading-6 text-muted",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			}) : null
		]
	});
}
//#endregion
export { PageTitle as a, messageOf as c, Field as i, Button as n, Panel as o, Empty as r, Stat as s, Badge as t };
