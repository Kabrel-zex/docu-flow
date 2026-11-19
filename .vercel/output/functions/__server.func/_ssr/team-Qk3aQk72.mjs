import { o as __toESM } from "../_runtime.mjs";
import { n as ROLE_LABELS } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as getTeam, a as actOnTeam } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-Qk3aQk72.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = Object.keys(ROLE_LABELS);
function TeamPage() {
	const { org } = useOrg();
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("collaborator");
	const [dept, setDept] = (0, import_react.useState)("");
	const [data, setData] = (0, import_react.useState)(null);
	const [link, setLink] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		getTeam({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id]);
	const members = data?.members ?? [];
	const invites = data?.invites ?? [];
	const departments = data?.departments ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Utilisateurs",
				lede: "Invitation par lien. Le compte rejoint l'organisation à la prochaine connexion avec le même e-mail."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 md:grid-cols-[1fr_auto_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						type: "email",
						placeholder: "E-mail",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 rounded-lg border border-line bg-card px-3 text-sm",
						value: role,
						onChange: (e) => setRole(e.target.value),
						children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r,
							children: ROLE_LABELS[r]
						}, r))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void actOnTeam({ data: {
							orgId: org.id,
							type: "invite",
							email,
							role
						} }).then((r) => {
							if (r.token) setLink(`${window.location.origin}/login?invite=${r.token}`);
							setEmail("");
							load();
						}).catch((e) => setError(messageOf(e))),
						children: "Inviter"
					})
				]
			}), link ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 break-all text-xs",
				children: link
			}) : null] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line text-sm",
				children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						m.display_name || m.email,
						" · ",
						ROLE_LABELS[m.role] ?? m.role
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void actOnTeam({ data: {
							orgId: org.id,
							type: "remove",
							memberId: m.id
						} }).then(load).catch((e) => setError(messageOf(e))),
						children: "Retirer"
					})]
				}, m.id))
			}), invites.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: ["Invitations : ", invites.map((i) => `${i.email} (${ROLE_LABELS[i.role] ?? i.role})`).join(", ")]
			}) : null] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Départements"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						actOnTeam({ data: {
							orgId: org.id,
							type: "department",
							name: dept
						} }).then(() => {
							setDept("");
							load();
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: dept,
						onChange: (e) => setDept(e.target.value),
						placeholder: "Nom"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Ajouter" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm",
					children: departments.map((d) => d.name).join(" · ")
				})
			] })
		]
	});
}
//#endregion
export { TeamPage as component };
