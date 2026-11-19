import { o as __toESM } from "../_runtime.mjs";
import { d as formatEurFromCents, f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as getBillingPdf, p as getBilling, t as actOnBilling, u as createOrg } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
import { i as Route$16 } from "./router-DFFOnbxK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-BgOKFXbb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function stripeHost(url) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === "https:" && (parsed.hostname === "checkout.stripe.com" || parsed.hostname === "billing.stripe.com");
	} catch {
		return false;
	}
}
function BillingPage() {
	const { org, reload } = useOrg();
	const search = Route$16.useSearch();
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [orgName, setOrgName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)("");
	function load() {
		getBilling({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id]);
	(0, import_react.useEffect)(() => {
		if (!search.session_id) return;
		setBusy("confirm");
		actOnBilling({ data: {
			orgId: org.id,
			type: "confirm",
			sessionId: search.session_id
		} }).then(() => {
			setNote("Paiement confirmé. L'offre est active.");
			setError("");
			load();
			reload();
		}).catch((e) => setError(messageOf(e))).finally(() => {
			setBusy("");
			navigate({
				to: "/app/billing",
				search: {
					checkout: "",
					session_id: ""
				},
				replace: true
			});
		});
	}, [
		org.id,
		search.session_id,
		navigate,
		reload
	]);
	async function pay(type, extra = {}) {
		setError("");
		setBusy(type);
		try {
			const result = await actOnBilling({ data: {
				orgId: org.id,
				type,
				...extra
			} });
			if (result.url) {
				if (!stripeHost(result.url)) throw new Error("Adresse de paiement inattendue.");
				window.location.assign(result.url);
				return true;
			}
			if (result.updated) setNote(type === "cancel" ? "Résiliation enregistrée. Les documents restent conservés." : "Offre mise à jour.");
			load();
			reload();
			return true;
		} catch (e) {
			setError(messageOf(e));
			return false;
		} finally {
			setBusy("");
		}
	}
	const plans = data?.plans ?? [];
	const invoices = data?.invoices ?? [];
	const sub = data?.subscription;
	const current = sub?.plan_code;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-4xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Abonnement",
				lede: data?.notice
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ok",
				children: note
			}) : null,
			search.checkout === "cancel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Paiement annulé. Aucun prélèvement n'a été enregistré."
			}) : null,
			busy === "confirm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Confirmation du paiement auprès de Stripe…"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					"Statut ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: String(sub?.status ?? "") }),
					" · offre effective ",
					data?.effective,
					" · remise ",
					sub?.discount_percent ?? 0,
					" %",
					sub?.period_end ? ` · période jusqu'au ${sub.period_end}` : ""
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					value: code,
					onChange: (e) => setCode(e.target.value),
					placeholder: "Code DOCUFLOW30"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					disabled: busy !== "",
					onClick: () => void pay("promo", { code }).then((ok) => {
						if (ok) setCode("");
					}),
					children: "Appliquer"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: plans.map((plan) => {
					const active = current === plan.code && (sub?.status === "active" || sub?.status === "canceling");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: plan.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-semibold tabular-nums",
							children: formatMoney(plan.price_xaf)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [plan.catalog ? "Tarif du catalogue Stripe" : `${formatEurFromCents(plan.eur_cents)} / mois`, sub?.discount_percent ? ` après remise, soit ${formatMoney(plan.amount_xaf)}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								plan.max_users,
								" utilisateurs · ",
								plan.storage_mb,
								" Mo · ",
								plan.docs_per_month,
								" docs / mois"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6",
							children: plan.features
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							disabled: !data?.stripeReady || busy !== "" || active && sub?.status === "active",
							onClick: () => void pay("activate", { plan: plan.code }),
							children: active && sub?.status === "canceling" ? "Reprendre cette offre" : active ? "Offre en cours" : "Payer avec Stripe"
						})
					] }, plan.code);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Factures"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [invoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "Aucun encaissement pour le moment."
					}) : null, invoices.map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							inv.issued_on,
							" · ",
							inv.number,
							" · ",
							formatMoney(inv.amount_xaf),
							inv.amount_eur_cents ? ` · ${formatEurFromCents(inv.amount_eur_cents)}` : "",
							" · ",
							inv.status
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => void getBillingPdf({ data: {
								orgId: org.id,
								number: inv.number
							} }).then((file) => {
								const bin = atob(file.base64);
								const bytes = new Uint8Array(bin.length);
								for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
								const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
								const a = document.createElement("a");
								a.href = url;
								a.download = file.filename;
								a.click();
								setTimeout(() => URL.revokeObjectURL(url), 1500);
							}).catch((e) => setError(messageOf(e))),
							children: "PDF"
						})]
					}, inv.number))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: !data?.stripeReady || !sub?.stripe_customer_id || busy !== "",
						onClick: () => void pay("portal"),
						children: "Portail Stripe"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						disabled: busy !== "",
						onClick: () => void pay("cancel"),
						children: sub?.stripe_subscription_id ? "Résilier en fin de période" : "Interrompre l'essai"
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Autre organisation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					createOrg({ data: { name: orgName } }).then(() => {
						setOrgName("");
						reload();
					}).catch((err) => setError(messageOf(err)));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					value: orgName,
					onChange: (e) => setOrgName(e.target.value),
					placeholder: "Nom"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Créer" })]
			})] })
		]
	});
}
//#endregion
export { BillingPage as component };
