import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-Co7q7Lrs.mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
import { i as Field, n as Button } from "./kit-DSHZiqd4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CSzhkwiS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("up");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (ready && !isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	async function submit(e) {
		e.preventDefault();
		setError("");
		setPending(true);
		try {
			if (password.length < 8) throw new Error("8 caractères minimum.");
			const result = mode === "up" ? await authClient.signUp.email({
				email,
				password,
				name: name || email,
				callbackURL: "/app"
			}) : await authClient.signIn.email({
				email,
				password,
				callbackURL: "/app"
			});
			if (result.error) throw new Error(result.error.message || "Connexion impossible.");
			window.location.assign("/app");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Connexion impossible.");
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-line bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-sm font-semibold",
					children: "DOCUFLOW AI"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-2xl font-semibold tracking-tight",
					children: mode === "up" ? "Créer un compte" : "Connexion"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted",
					children: "L'espace est isolé par organisation. La vérification d'e-mail par message n'est pas branchée : le compte est actif dès l'inscription."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit: submit,
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							placeholder: "Nom",
							value: name,
							onChange: (e) => setName(e.target.value),
							autoComplete: "name"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							type: "email",
							required: true,
							placeholder: "E-mail professionnel",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							type: "password",
							required: true,
							placeholder: "Mot de passe",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: mode === "up" ? "new-password" : "current-password"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: pending,
							children: pending ? "Patientez…" : mode === "up" ? "Créer l'espace" : "Entrer"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-3 text-sm text-primary",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "J'ai déjà un compte" : "Créer un compte"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-5 h-px bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "w-full",
						onClick: () => void signIn(p.providerId, { callbackURL: "/app" }),
						children: ["Continuer avec ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs leading-5 text-muted",
					children: "La réinitialisation par e-mail nécessite un canal d'envoi, non activé ici. La double authentification dépend du fournisseur Google lorsqu'il est utilisé."
				})
			]
		})
	});
}
//#endregion
export { Login as component };
