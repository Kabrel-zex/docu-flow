import { o as __toESM } from "../_runtime.mjs";
import { f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as updatePlan, d as getAdmin } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel, s as Stat } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CT8y5Vab.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { boot } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!boot.platformAdmin) return;
		getAdmin().then(setData).catch((e) => setError(messageOf(e)));
	}, [boot.platformAdmin]);
	if (!boot.platformAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm",
		children: "Cette console est réservée au premier compte de la plateforme."
	});
	const plans = data?.plans ?? [];
	const orgs = data?.orgRows ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: "Super administrateur",
				lede: "Pilotage des organisations, des offres et de la consommation IA. Les prix modifiés s'appliquent aux prochaines activations."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Organisations",
						value: String(data.organizations)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Utilisateurs",
						value: String(data.users)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Documents",
						value: String(data.documents),
						hint: `${(data.bytes / 1048576).toFixed(1)} Mo`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "MRR interne",
						value: formatMoney(data.mrr),
						hint: `${data.activeSubscriptions} actifs · ${data.cancelled} résiliés · ${data.aiCalls} appels IA`
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Offres"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanRow, {
					plan,
					onSaved: () => void getAdmin().then(setData),
					onError: setError
				}, plan.code))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Organisations"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line text-sm",
				children: orgs.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						o.name,
						" · ",
						o.country
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							o.plan_code,
							" · ",
							o.status,
							" · ",
							o.documents
						]
					})]
				}, o.id))
			})] })
		]
	});
}
function PlanRow({ plan, onSaved, onError }) {
	const [price, setPrice] = (0, import_react.useState)(String(plan.price_xaf));
	const [docs, setDocs] = (0, import_react.useState)(String(plan.docs_per_month));
	const [users, setUsers] = (0, import_react.useState)(String(plan.max_users));
	const [storage, setStorage] = (0, import_react.useState)(String(plan.storage_mb));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid gap-2 md:grid-cols-[8rem_1fr_1fr_1fr_1fr_auto] md:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: plan.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				value: price,
				onChange: (e) => setPrice(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				value: docs,
				onChange: (e) => setDocs(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				value: users,
				onChange: (e) => setUsers(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				value: storage,
				onChange: (e) => setStorage(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => void updatePlan({ data: {
					code: plan.code,
					price: Number(price),
					docs: Number(docs),
					users: Number(users),
					storage: Number(storage)
				} }).then(onSaved).catch((e) => onError(messageOf(e))),
				children: "Sauver"
			})
		]
	});
}
//#endregion
export { AdminPage as component };
