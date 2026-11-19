import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
import { N as saveSettings, T as getSettings } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-z_MYzLjL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { org, reload } = useOrg();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		legalName: "",
		address: "",
		country: "",
		phone: "",
		email: "",
		sector: "",
		taxId: "",
		retentionYears: "10"
	});
	const [category, setCategory] = (0, import_react.useState)("");
	const [tokenLabel, setTokenLabel] = (0, import_react.useState)("Intégration");
	const [token, setToken] = (0, import_react.useState)("");
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [info, setInfo] = (0, import_react.useState)("");
	const [currentPassword, setCurrent] = (0, import_react.useState)("");
	const [newPassword, setNext] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getSettings({ data: { orgId: org.id } }).then((d) => {
			const row = d.org;
			if (row) setForm({
				name: String(row.name ?? ""),
				legalName: String(row.legal_name ?? ""),
				address: String(row.address ?? ""),
				country: String(row.country ?? ""),
				phone: String(row.phone ?? ""),
				email: String(row.email ?? ""),
				sector: String(row.sector ?? ""),
				taxId: String(row.tax_id ?? ""),
				retentionYears: String(row.retention_years ?? 10)
			});
			setSessions(d.sessions);
		}).catch((e) => setError(messageOf(e)));
	}, [org.id]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Paramètres",
				lede: "Profil d'organisation, conservation, sessions et jeton d'API. Le chiffrement de transport est celui de la plateforme. Les fichiers sont stockés en base, pas sur un volume local."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.name,
						onChange: (e) => set("name", e.target.value),
						placeholder: "Nom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.legalName,
						onChange: (e) => set("legalName", e.target.value),
						placeholder: "Raison sociale"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.address,
						onChange: (e) => set("address", e.target.value),
						placeholder: "Adresse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.country,
						onChange: (e) => set("country", e.target.value),
						placeholder: "Pays"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.phone,
						onChange: (e) => set("phone", e.target.value),
						placeholder: "Téléphone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.email,
						onChange: (e) => set("email", e.target.value),
						placeholder: "E-mail"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.sector,
						onChange: (e) => set("sector", e.target.value),
						placeholder: "Secteur"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.taxId,
						onChange: (e) => set("taxId", e.target.value),
						placeholder: "Identifiant fiscal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: form.retentionYears,
						onChange: (e) => set("retentionYears", e.target.value),
						placeholder: "Conservation (années)"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: () => void saveSettings({ data: {
					orgId: org.id,
					type: "org",
					...form,
					retentionYears: Number(form.retentionYears)
				} }).then(() => {
					setInfo("Organisation enregistrée.");
					reload();
				}).catch((e) => setError(messageOf(e))),
				children: "Enregistrer"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Catégorie propre"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					saveSettings({ data: {
						orgId: org.id,
						type: "category",
						name: category
					} }).then(() => setCategory(""));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					value: category,
					onChange: (e) => setCategory(e.target.value),
					placeholder: "Ex. Dossiers OHADA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Ajouter" })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Sessions et appareils"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [
								s.created_at,
								" · ",
								s.ip || "IP inconnue",
								" · ",
								s.user_agent || "appareil"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => void saveSettings({ data: {
								orgId: org.id,
								type: "revoke_session",
								sessionId: s.id
							} }).then(() => setSessions((rows) => rows.filter((r) => r.id !== s.id))),
							children: "Révoquer"
						})]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs leading-5 text-muted",
					children: "La double authentification applicative n'est pas disponible sur cette couche. Un compte Google peut imposer celle du fournisseur."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Mot de passe"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						type: "password",
						value: currentPassword,
						onChange: (e) => setCurrent(e.target.value),
						placeholder: "Mot de passe actuel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						type: "password",
						value: newPassword,
						onChange: (e) => setNext(e.target.value),
						placeholder: "Nouveau mot de passe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void authClient.changePassword({
							currentPassword,
							newPassword,
							revokeOtherSessions: true
						}).then((r) => {
							if (r.error) setError(r.error.message || "Échec");
							else setInfo("Mot de passe mis à jour.");
						}),
						children: "Changer"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "API Professional"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-5 text-muted",
					children: "POST /api/v1/documents avec Authorization: Bearer et un JSON title, fileName, text."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						value: tokenLabel,
						onChange: (e) => setTokenLabel(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void saveSettings({ data: {
							orgId: org.id,
							type: "token",
							label: tokenLabel
						} }).then((r) => {
							if (r.token) setToken(r.token);
						}).catch((e) => setError(messageOf(e))),
						children: "Créer un jeton"
					})]
				}),
				token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 break-all text-xs",
					children: ["Copiez-le maintenant : ", token]
				}) : null
			] }),
			info ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ok-ink",
				children: info
			}) : null
		]
	});
}
//#endregion
export { SettingsPage as component };
