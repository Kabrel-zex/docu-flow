import { o as __toESM } from "../_runtime.mjs";
import { C as useRouter, Z as require_react, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, w as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-Co7q7Lrs.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DFFOnbxK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-D4EOHvtS.css";
var Route$24 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "DOCUFLOW AI" },
			{
				name: "description",
				content: "Vos documents, intelligemment organisés. GED, extraction et archivage pour les entreprises."
			},
			{
				name: "theme-color",
				content: "#111827"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$20 = () => import("./routes-BZfESFg1.mjs");
var Route$23 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./app-6jkuemGU.mjs");
var Route$22 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./login-CSzhkwiS.mjs");
var Route$21 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./app-C7HtY8XT.mjs");
var Route$20 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin-CT8y5Vab.mjs");
var Route$19 = createFileRoute("/app/admin")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./alerts-BZK-RC7g.mjs");
var Route$18 = createFileRoute("/app/alerts")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./assistant-DPd2rIHl.mjs");
var Route$17 = createFileRoute("/app/assistant")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./billing-BgOKFXbb.mjs");
var Route$16 = createFileRoute("/app/billing")({
	validateSearch: (search) => ({
		checkout: search.checkout === "success" || search.checkout === "cancel" ? search.checkout : "",
		session_id: typeof search.session_id === "string" ? search.session_id.slice(0, 200) : ""
	}),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./contracts-CQ9209-m.mjs");
var Route$15 = createFileRoute("/app/contracts")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./documents-DJt27ZIv.mjs");
var Route$14 = createFileRoute("/app/documents")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./folders-BpLO2JVH.mjs");
var Route$13 = createFileRoute("/app/folders")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./import-cFlIuVMJ.mjs");
var Route$12 = createFileRoute("/app/import")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./invoices-D46oz_dP.mjs");
var Route$11 = createFileRoute("/app/invoices")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./reports-D-adRkCN.mjs");
var Route$10 = createFileRoute("/app/reports")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./search-B2-gItU_.mjs");
var Route$9 = createFileRoute("/app/search")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./settings-z_MYzLjL.mjs");
var Route$8 = createFileRoute("/app/settings")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./signatures-DtsPHtyt.mjs");
var Route$7 = createFileRoute("/app/signatures")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./team-Qk3aQk72.mjs");
var Route$6 = createFileRoute("/app/team")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./workflows-vJ2y_ep1.mjs");
var Route$5 = createFileRoute("/app/workflows")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./share._token-Cw8RziH9.mjs");
var Route$4 = createFileRoute("/share/$token")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var Route$3 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route$2 = createFileRoute("/api/stripe/webhook")({ server: { handlers: { POST: async ({ request }) => {
	const { handleStripeWebhook } = await import("./stripe.server-CvxQSQyq.mjs");
	const raw = await request.text();
	const signature = request.headers.get("stripe-signature") ?? "";
	try {
		return Response.json(await handleStripeWebhook(raw, signature));
	} catch (error) {
		const status = error instanceof Error && "status" in error && typeof error.status === "number" ? error.status : 500;
		const message = error instanceof Error ? error.message : "Webhook refusé.";
		return Response.json({ error: message }, { status });
	}
} } } });
var Route$1 = createFileRoute("/api/v1/documents")({ server: { handlers: { POST: async ({ request }) => {
	const { importViaBearer } = await import("./store.server-D7iQq_dP.mjs");
	let body = {};
	try {
		body = await request.json();
	} catch {
		body = {};
	}
	const result = await importViaBearer(request.headers.get("authorization") ?? "", body);
	return Response.json(result.body, { status: result.status });
} } } });
var $$splitComponentImporter = () => import("./documents._documentId-BXDRgUGx.mjs");
var Route = createFileRoute("/app/documents/$documentId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$23.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$24
});
var AppRoute = Route$22.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$24
});
var LoginRoute = Route$21.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$24
});
var AppIndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppAdminRoute = Route$19.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AppRoute
});
var AppAlertsRoute = Route$18.update({
	id: "/alerts",
	path: "/alerts",
	getParentRoute: () => AppRoute
});
var AppAssistantRoute = Route$17.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => AppRoute
});
var AppBillingRoute = Route$16.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => AppRoute
});
var AppContractsRoute = Route$15.update({
	id: "/contracts",
	path: "/contracts",
	getParentRoute: () => AppRoute
});
var AppDocumentsRoute = Route$14.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => AppRoute
});
var AppFoldersRoute = Route$13.update({
	id: "/folders",
	path: "/folders",
	getParentRoute: () => AppRoute
});
var AppImportRoute = Route$12.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => AppRoute
});
var AppInvoicesRoute = Route$11.update({
	id: "/invoices",
	path: "/invoices",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$10.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppSearchRoute = Route$9.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppSignaturesRoute = Route$7.update({
	id: "/signatures",
	path: "/signatures",
	getParentRoute: () => AppRoute
});
var AppTeamRoute = Route$6.update({
	id: "/team",
	path: "/team",
	getParentRoute: () => AppRoute
});
var AppWorkflowsRoute = Route$5.update({
	id: "/workflows",
	path: "/workflows",
	getParentRoute: () => AppRoute
});
var ShareTokenRoute = Route$4.update({
	id: "/share/$token",
	path: "/share/$token",
	getParentRoute: () => Route$24
});
var ApiAuthSplatRoute = Route$3.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$24
});
var ApiStripeWebhookRoute = Route$2.update({
	id: "/api/stripe/webhook",
	path: "/api/stripe/webhook",
	getParentRoute: () => Route$24
});
var ApiV1DocumentsRoute = Route$1.update({
	id: "/api/v1/documents",
	path: "/api/v1/documents",
	getParentRoute: () => Route$24
});
var AppDocumentsRouteChildren = { AppDocumentsDocumentIdRoute: Route.update({
	id: "/$documentId",
	path: "/$documentId",
	getParentRoute: () => AppDocumentsRoute
}) };
var AppRouteChildren = {
	AppAdminRoute,
	AppAlertsRoute,
	AppAssistantRoute,
	AppBillingRoute,
	AppContractsRoute,
	AppDocumentsRoute: AppDocumentsRoute._addFileChildren(AppDocumentsRouteChildren),
	AppFoldersRoute,
	AppImportRoute,
	AppInvoicesRoute,
	AppReportsRoute,
	AppSearchRoute,
	AppSettingsRoute,
	AppSignaturesRoute,
	AppTeamRoute,
	AppWorkflowsRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	ShareTokenRoute,
	ApiAuthSplatRoute,
	ApiStripeWebhookRoute,
	ApiV1DocumentsRoute
};
var routeTree = Route$24._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$16 as i, Route as n, Route$4 as r, router_exports as t };
