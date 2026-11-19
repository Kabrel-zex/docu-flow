import { o as __toESM } from "../_runtime.mjs";
import { n as ROLE_LABELS } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, b as Link, p as useRouterState, w as require_jsx_runtime, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { a as hasGateSessionMarker } from "./server-Co7q7Lrs.mjs";
import { t as useCurrentUser } from "./use-current-user-B7Cbrtsy.mjs";
import { h as getBootstrap } from "./api-DxdX6Upq.mjs";
import { c as messageOf } from "./kit-DSHZiqd4.mjs";
import { _ as CreditCard, a as Sparkles, c as Search, d as Menu, f as LayoutDashboard, g as FileStack, h as Files, l as Receipt, m as FolderTree, n as Users, o as Shield, p as GitBranch, r as Upload, s as Settings, t as X, u as PenLine, v as ChartColumn, y as Bell } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-XiO1ryX5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var OrgContext = (0, import_react.createContext)(null);
function useOrg() {
	const ctx = (0, import_react.useContext)(OrgContext);
	if (!ctx) throw new Error("Organisation indisponible");
	return ctx;
}
function OrgProvider({ children }) {
	const [boot, setBoot] = (0, import_react.useState)(null);
	const [orgId, setOrgIdState] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [tick, setTick] = (0, import_react.useState)(0);
	const [lang, setLangState] = (0, import_react.useState)("fr");
	function load() {
		getBootstrap().then((data) => {
			setBoot(data);
			const stored = localStorage.getItem("docuflow.org");
			const next = data.orgs.find((o) => o.id === stored)?.id ?? data.orgs[0]?.id ?? null;
			setOrgIdState(next);
			if (next) localStorage.setItem("docuflow.org", next);
			setError("");
		}).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("docuflow.lang");
		if (saved === "en" || saved === "fr") setLangState(saved);
		load();
	}, []);
	const org = boot?.orgs.find((o) => o.id === orgId) ?? boot?.orgs[0];
	const tx = (fr, en) => lang === "en" ? en : fr;
	const value = (0, import_react.useMemo)(() => {
		if (!boot || !org) return null;
		return {
			boot,
			org,
			tick,
			lang,
			tx,
			setOrgId: (id) => {
				localStorage.setItem("docuflow.org", id);
				setOrgIdState(id);
				setTick((n) => n + 1);
			},
			bump: () => setTick((n) => n + 1),
			setLang: (next) => {
				localStorage.setItem("docuflow.lang", next);
				setLangState(next);
			},
			reload: load
		};
	}, [
		boot,
		org,
		tick,
		lang
	]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-md text-sm text-danger",
			children: error
		})
	});
	if (!value) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-paper text-sm text-muted",
		children: "DOCUFLOW AI"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgContext.Provider, {
		value,
		children
	});
}
var LINKS = [
	{
		to: "/app",
		fr: "Tableau de bord",
		en: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/app/documents",
		fr: "Mes documents",
		en: "Documents",
		icon: Files
	},
	{
		to: "/app/invoices",
		fr: "Factures",
		en: "Invoices",
		icon: Receipt
	},
	{
		to: "/app/import",
		fr: "Importation",
		en: "Import",
		icon: Upload
	},
	{
		to: "/app/folders",
		fr: "Dossiers",
		en: "Folders",
		icon: FolderTree
	},
	{
		to: "/app/search",
		fr: "Recherche",
		en: "Search",
		icon: Search
	},
	{
		to: "/app/contracts",
		fr: "Contrats",
		en: "Contracts",
		icon: FileStack
	},
	{
		to: "/app/signatures",
		fr: "Signatures",
		en: "Signatures",
		icon: PenLine
	},
	{
		to: "/app/alerts",
		fr: "Alertes",
		en: "Alerts",
		icon: Bell
	},
	{
		to: "/app/workflows",
		fr: "Workflows",
		en: "Workflows",
		icon: GitBranch
	},
	{
		to: "/app/assistant",
		fr: "Assistant IA",
		en: "AI assistant",
		icon: Sparkles
	},
	{
		to: "/app/reports",
		fr: "Rapports",
		en: "Reports",
		icon: ChartColumn
	},
	{
		to: "/app/team",
		fr: "Utilisateurs",
		en: "Users",
		icon: Users
	},
	{
		to: "/app/settings",
		fr: "Paramètres",
		en: "Settings",
		icon: Settings
	},
	{
		to: "/app/billing",
		fr: "Abonnement",
		en: "Subscription",
		icon: CreditCard
	}
];
function Shell({ children }) {
	const { boot, org, setOrgId, lang, setLang, tx } = useOrg();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const items = boot.platformAdmin ? [...LINKS, {
		to: "/app/admin",
		fr: "Super admin",
		en: "Super admin",
		icon: Shield
	}] : LINKS;
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-sm font-semibold tracking-wide text-white",
				children: "DOCUFLOW AI"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-sidefg/70",
				children: tx("Documents organisés", "Documents, organized")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex-1 space-y-1 overflow-y-auto px-3 pb-4",
			children: items.map((item) => {
				const active = item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: `flex h-11 items-center gap-3 rounded-lg px-3 text-sm ${active ? "bg-white/10 text-white" : "text-sidefg/80"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), lang === "en" ? item.en : item.fr]
				}, item.to);
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden bg-sidebar text-sidefg md:block",
				children: nav
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "absolute inset-0 bg-ink/40",
					"aria-label": "Fermer",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "relative h-full w-72 bg-sidebar text-sidefg",
					children: nav
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid size-11 place-items-center rounded-lg border border-line md:hidden",
								onClick: () => setOpen(true),
								"aria-label": "Menu",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Organisation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "h-11 w-full max-w-xs rounded-lg border border-line bg-card px-3 text-sm",
									value: org.id,
									onChange: (e) => setOrgId(e.target.value),
									children: boot.orgs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.name
									}, item.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden text-xs text-muted lg:inline",
								children: [
									ROLE_LABELS[org.role] ?? org.role,
									" · ",
									org.planName
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "h-11 rounded-lg border border-line px-3 text-xs font-medium",
								onClick: () => setLang(lang === "fr" ? "en" : "fr"),
								children: lang === "fr" ? "EN" : "FR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						]
					}),
					org.writesBlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "bg-amber-50 px-4 py-2 text-sm text-warn",
						children: "Abonnement inactif. Les documents restent consultables, les modifications sont suspendues."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 md:px-8",
						children
					})
				]
			})
		]
	});
}
//#endregion
export { useOrg as i, RedirectToSignIn as n, Shell as r, OrgProvider as t };
