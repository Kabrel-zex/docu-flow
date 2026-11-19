import { o as __toESM } from "../_runtime.mjs";
import { f as formatMoney } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as compareDocs, r as actOnDocument, v as getDocument, x as getInvoicePdf, y as getDocuments } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, i as Field, n as Button, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
import { n as Route } from "./router-DFFOnbxK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents._documentId-BXDRgUGx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocumentPage() {
	const { documentId } = Route.useParams();
	const { org, bump } = useOrg();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const [task, setTask] = (0, import_react.useState)("");
	const [other, setOther] = (0, import_react.useState)("");
	const [peers, setPeers] = (0, import_react.useState)([]);
	const [compare, setCompare] = (0, import_react.useState)(null);
	const [share, setShare] = (0, import_react.useState)("");
	const [pdfUrl, setPdfUrl] = (0, import_react.useState)("");
	const [pdfNote, setPdfNote] = (0, import_react.useState)("");
	function load() {
		getDocument({ data: {
			orgId: org.id,
			id: documentId
		} }).then(setData).catch((e) => setError(messageOf(e)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [org.id, documentId]);
	(0, import_react.useEffect)(() => {
		getDocuments({ data: {
			orgId: org.id,
			q: "",
			status: "",
			folderId: ""
		} }).then((rows) => setPeers(rows.filter((r) => r.id !== documentId).map((r) => ({
			id: r.id,
			title: r.title
		})))).catch(() => setPeers([]));
	}, [org.id, documentId]);
	async function run(action) {
		setError("");
		try {
			const res = await actOnDocument({ data: {
				orgId: org.id,
				id: documentId,
				action
			} });
			if (res.token) setShare(`${window.location.origin}/share/${res.token}`);
			bump();
			load();
		} catch (e) {
			setError(messageOf(e));
		}
	}
	if (!data && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "…"
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: error
	});
	const doc = data.doc;
	const showPdf = doc.categorySlug === "facture" || doc.hasOriginal;
	async function openStoredPdf(download) {
		setError("");
		const file = await getInvoicePdf({ data: {
			orgId: org.id,
			id: documentId
		} });
		const bin = atob(file.base64);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
		if (download) {
			const a = document.createElement("a");
			a.href = url;
			a.download = file.filename;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1500);
			return;
		}
		if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		setPdfUrl(url);
		setPdfNote(file.source === "original" ? "PDF d'origine" : "Copie générée depuis les champs extraits");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: doc.title,
				lede: doc.summary,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/documents",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						children: "Retour"
					})
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: doc.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: doc.categorySlug }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [
							Math.round(doc.confidence * 100),
							" % · ",
							doc.sha256.slice(0, 12)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					showPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									doc.hasOriginal ? "Fichier d'origine conservé." : "Pas de PDF d'origine : une copie peut être produite.",
									" ",
									doc.categorySlug === "facture" ? `Paiement : ${doc.paymentStatus}.` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void openStoredPdf(false).catch((e) => setError(messageOf(e))),
										children: "Aperçu"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void openStoredPdf(true).catch((e) => setError(messageOf(e))),
										children: "Télécharger"
									}),
									doc.categorySlug === "facture" && doc.paymentStatus !== "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => void run({
											type: "payment",
											status: "paid"
										}),
										children: "Marquer payée"
									}) : null,
									doc.categorySlug === "facture" && doc.paymentStatus === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void run({
											type: "payment",
											status: "unpaid"
										}),
										children: "Rouvrir"
									}) : null
								]
							}),
							pdfNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: pdfNote
							}) : null,
							pdfUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								title: "PDF",
								src: pdfUrl,
								className: "mt-3 h-80 w-full rounded-lg border border-line bg-white"
							}) : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Champs extraits"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-5 text-muted",
							children: "Une confiance basse reste « suggested » jusqu'à validation humaine. Ce n'est pas une certification."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-line",
							children: data.fields.map((field) => {
								const row = field;
								const shown = row.data_type === "money" ? formatMoney(Number(row.value)) : row.value;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center justify-between gap-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											row.label,
											" · ",
											Math.round(Number(row.confidence) * 100),
											" %"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: shown
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: row.status }), row.status === "suggested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => void run({
												type: "validate_field",
												extractionId: row.id,
												decision: "validated"
											}),
											children: "Valider"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => void run({
												type: "validate_field",
												extractionId: row.id,
												decision: "rejected"
											}),
											children: "Rejeter"
										})] }) : null]
									})]
								}, row.id);
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Contenu indexé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-sm leading-6",
								children: doc.content
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void run({ type: "archive" }),
										children: "Archiver"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void run({ type: "restore" }),
										children: "Désarchiver"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void run({ type: "ai_extract" }),
										children: "Analyse IA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "inline-flex h-11 cursor-pointer items-center rounded-lg border border-line px-4 text-sm",
										children: ["OCR image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "sr-only",
											type: "file",
											accept: "image/png,image/jpeg,image/webp",
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (!file || file.size > 12e5) {
													setError("Image requise, 1,2 Mo maximum.");
													return;
												}
												const reader = new FileReader();
												reader.onload = () => {
													run({
														type: "ai_ocr",
														dataUrl: typeof reader.result === "string" ? reader.result : ""
													});
												};
												reader.readAsDataURL(file);
											}
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "danger",
										onClick: () => void run({ type: "trash" }),
										children: "Supprimer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => void run({ type: "share" }),
										children: "Lien 7 jours"
									})
								]
							}),
							share ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-all text-sm",
								children: share
							}) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Commentaire"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							run({
								type: "comment",
								body: comment
							});
							setComment("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							value: comment,
							onChange: (e) => setComment(e.target.value),
							placeholder: "Note interne"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Publier"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3 text-sm",
						children: data.comments.map((c) => {
							const row = c;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: row.author_name
								}),
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: row.created_at
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row.body })
							] }, row.id);
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Tâche ou validation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							run({
								type: "task",
								title: task,
								kind: "approval"
							});
							setTask("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							value: task,
							onChange: (e) => setTask(e.target.value),
							placeholder: "Demander une validation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Assigner"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: data.tasks.map((t) => {
							const row = t;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.title }), row.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => void run({
										type: "task_status",
										taskId: row.id,
										status: "done"
									}),
									children: "Clôturer"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: "done" })]
							}, row.id);
						})
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Comparer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-lg border border-line bg-card px-3 text-sm",
							value: other,
							onChange: (e) => setOther(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Second document"
							}), peers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.title
							}, p.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							disabled: !other,
							onClick: () => void compareDocs({ data: {
								orgId: org.id,
								a: documentId,
								b: other,
								useAi: false
							} }).then(setCompare).catch((e) => setError(messageOf(e))),
							children: "Métadonnées"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !other,
							onClick: () => void compareDocs({ data: {
								orgId: org.id,
								a: documentId,
								b: other,
								useAi: true
							} }).then(setCompare).catch((e) => setError(messageOf(e))),
							children: "Comparer avec l'IA"
						})
					]
				}),
				compare ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-6",
						children: compare.narrative
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: compare.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [row.label, "."]
							}),
							" ",
							row.a,
							" → ",
							row.b
						] }, row.label))
					})]
				}) : null
			] })
		]
	});
}
//#endregion
export { DocumentPage as component };
