import { o as __toESM } from "../_runtime.mjs";
import { f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as getInvoices, r as actOnDocument, x as getInvoicePdf } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices-D46oz_dP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function pdfBlob(base64) {
	const bin = atob(base64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}
function InvoicesPage() {
	const { org, tick, tx, bump } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [error, setError] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	function load() {
		getInvoices({ data: { orgId: org.id } }).then(setData).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(load, [org.id, tick]);
	(0, import_react.useEffect)(() => () => {
		if (preview?.url) URL.revokeObjectURL(preview.url);
	}, [preview]);
	async function openPdf(row, download) {
		setError("");
		try {
			const file = await getInvoicePdf({ data: {
				orgId: org.id,
				id: row.id
			} });
			const url = pdfBlob(file.base64);
			if (download) {
				const a = document.createElement("a");
				a.href = url;
				a.download = file.filename;
				a.click();
				setTimeout(() => URL.revokeObjectURL(url), 1500);
				return;
			}
			setPreview({
				title: row.title,
				url,
				note: file.source === "original" ? tx("PDF d'origine", "Original PDF") : tx("Copie générée depuis les champs extraits", "Copy generated from extracted fields")
			});
		} catch (e) {
			setError(messageOf(e));
		}
	}
	async function pay(row, status) {
		setError("");
		try {
			await actOnDocument({ data: {
				orgId: org.id,
				id: row.id,
				action: {
					type: "payment",
					status
				}
			} });
			bump();
			load();
		} catch (e) {
			setError(messageOf(e));
		}
	}
	const rows = (data?.invoices ?? []).filter((row) => {
		if (filter === "unpaid") return row.paymentStatus === "unpaid";
		if (filter === "overdue") return row.overdue;
		if (filter === "paid") return row.paymentStatus === "paid";
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: tx("Factures", "Invoices"),
				lede: tx("Registre des pièces classées facture. Le PDF d'origine est conservé jusqu'à 1,2 Mo. Sinon, une copie est produite à partir des montants extraits.", "Invoice register. Original PDFs are kept up to 1.2 MB.")
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: tx("Ouvertes", "Open")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-semibold tabular-nums",
						children: data?.unpaidCount ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: tx("En retard", "Overdue")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-semibold tabular-nums",
						children: data?.overdueCount ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: tx("TTC encore dû", "Outstanding incl. tax")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-semibold tabular-nums",
						children: data ? formatMoney(data.unpaidTotal) : "—"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"all",
					"unpaid",
					"overdue",
					"paid"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: filter === key ? "primary" : "ghost",
					onClick: () => setFilter(key),
					children: key === "all" ? tx("Toutes", "All") : key === "unpaid" ? tx("Impayées", "Unpaid") : key === "overdue" ? tx("En retard", "Overdue") : tx("Payées", "Paid")
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: tx("Aucune facture dans ce filtre. Importez un PDF ou chargez la démonstration.", "No invoice in this filter.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/documents/$documentId",
							params: { documentId: row.id },
							className: "font-medium",
							children: row.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								row.supplier || tx("Fournisseur non extrait", "Supplier not extracted"),
								" · ",
								row.docNumber || "—",
								" · ",
								tx("échéance", "due"),
								" ",
								row.dueDate ?? "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm tabular-nums",
							children: [
								formatMoney(row.amountTtc, row.currency),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "TTC"
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: row.overdue ? "overdue" : row.paymentStatus }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => void openPdf(row, false),
								children: tx("Aperçu", "Preview")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => void openPdf(row, true),
								children: tx("Télécharger", "Download")
							}),
							row.paymentStatus !== "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void pay(row, "paid"),
								children: tx("Marquer payée", "Mark paid")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => void pay(row, "unpaid"),
								children: tx("Rouvrir", "Reopen")
							})
						]
					})]
				}, row.id))
			}) }),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: preview.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: preview.note
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setPreview(null),
					children: tx("Fermer", "Close")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: preview.title,
				src: preview.url,
				className: "mt-3 h-[32rem] w-full rounded-lg border border-line bg-white"
			})] }) : null
		]
	});
}
//#endregion
export { InvoicesPage as component };
