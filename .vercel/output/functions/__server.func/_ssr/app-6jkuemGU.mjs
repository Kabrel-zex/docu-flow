import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, g as Outlet, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
import { n as RedirectToSignIn, r as Shell, t as OrgProvider } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-6jkuemGU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppLayout() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const { user, isPending } = useCurrentUserState();
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-paper text-sm text-muted",
		children: "DOCUFLOW AI"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) });
}
//#endregion
export { AppLayout as component };
