import { o as __toESM } from "../_runtime.mjs";
import { m as sha256Hex } from "./engine-Csc4DLfU.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as importDocuments } from "./api-DxdX6Upq.mjs";
import { a as PageTitle, c as messageOf, o as Panel, t as Badge } from "./kit-DSHZiqd4.mjs";
import { i as useOrg } from "./shell-XiO1ryX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-cFlIuVMJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXT = /* @__PURE__ */ new Set([
	"pdf",
	"doc",
	"docx",
	"xls",
	"xlsx",
	"ppt",
	"pptx",
	"txt",
	"csv",
	"jpg",
	"jpeg",
	"png",
	"tif",
	"tiff",
	"webp"
]);
function extOf(name) {
	const i = name.lastIndexOf(".");
	return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}
function sniff(buf) {
	if (buf.length >= 4 && buf[0] === 37 && buf[1] === 80 && buf[2] === 68 && buf[3] === 70) return "pdf";
	if (buf.length >= 3 && buf[0] === 255 && buf[1] === 216 && buf[2] === 255) return "jpeg";
	if (buf.length >= 4 && buf[0] === 137 && buf[1] === 80 && buf[2] === 78 && buf[3] === 71) return "png";
	if (buf.length >= 4 && buf[0] === 80 && buf[1] === 75) return "zip";
	if (buf.length >= 2 && buf[0] === 73 && buf[1] === 73) return "tiff";
	if (buf.length >= 2 && buf[0] === 77 && buf[1] === 77) return "tiff";
	return "text";
}
function stripXml(xml) {
	return xml.replace(/<w:tab\/>/g, "	").replace(/<w:p[^>]*>/g, "\n").replace(/<[^>]+>/g, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/\s+\n/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
}
async function zipText(buf, kind) {
	const { default: JSZip } = await import("../_libs/jszip+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const zip = await JSZip.loadAsync(buf);
	if ((zip.file(/vbaProject\.bin/i) ?? []).length > 0) throw new Error("Macros refusées.");
	const parts = [];
	const files = Object.values(zip.files);
	if (files.length > 80) throw new Error("Archive trop complexe.");
	for (const file of files) {
		if (file.dir) continue;
		const path = file.name;
		if (!(kind === "docx" && path === "word/document.xml" || kind === "xlsx" && (path === "xl/sharedStrings.xml" || path.endsWith("/sharedStrings.xml")) || kind === "pptx" && /ppt\/slides\/slide\d+\.xml$/.test(path))) continue;
		parts.push(stripXml(await file.async("string")));
	}
	return parts.join("\n").slice(0, 2e5);
}
function bytesToBase64(bytes) {
	let binary = "";
	for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
	return btoa(binary);
}
async function pdfText(buf) {
	const result = await (await import("../_libs/unpdf.mjs").then((n) => n.t)).extractText(new Uint8Array(buf), { mergePages: true });
	return ((Array.isArray(result.text) ? result.text.join("\n") : result.text) || "").slice(0, 2e5);
}
async function one(file) {
	const ext = extOf(file.name);
	if (!EXT.has(ext)) throw new Error(`${file.name} : format non accepté.`);
	if (file.size > 20971520) throw new Error(`${file.name} : 20 Mo maximum.`);
	const buf = await file.arrayBuffer();
	const kind = sniff(new Uint8Array(buf.slice(0, 8)));
	if (ext === "pdf" && kind !== "pdf") throw new Error(`${file.name} : le contenu n'est pas un PDF.`);
	if ((ext === "jpg" || ext === "jpeg") && kind !== "jpeg") throw new Error(`${file.name} : image JPEG invalide.`);
	if (ext === "png" && kind !== "png") throw new Error(`${file.name} : image PNG invalide.`);
	if ((ext === "docx" || ext === "xlsx" || ext === "pptx") && kind !== "zip") throw new Error(`${file.name} : conteneur Office invalide.`);
	const sha256 = await sha256Hex(buf);
	let text = "";
	let dataUrl;
	let pdfBase64;
	if (ext === "txt" || ext === "csv") text = new TextDecoder().decode(buf).slice(0, 2e5);
	else if (ext === "pdf") {
		text = await pdfText(buf);
		if (file.size <= 12e5) pdfBase64 = bytesToBase64(new Uint8Array(buf));
	} else if (ext === "docx" || ext === "xlsx" || ext === "pptx") text = await zipText(buf, ext);
	else if (ext === "doc" || ext === "xls") text = `${file.name}\nFormat binaire ancien. Enregistrez en DOCX ou XLSX pour extraire le texte.`;
	else if (ext === "tif" || ext === "tiff" || ext === "webp" || ext === "jpg" || ext === "jpeg" || ext === "png") {
		text = `Image importée : ${file.name}. Lancez l'OCR IA depuis la fiche pour extraire le texte visible.`;
		if (file.size < 12e5 && (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp")) {
			const bytes = new Uint8Array(buf);
			let binary = "";
			for (const b of bytes) binary += String.fromCharCode(b);
			dataUrl = `data:${ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg"};base64,${btoa(binary)}`;
		}
	}
	if (!text.trim()) text = `${file.name}\nAucun texte natif détecté. Une validation humaine est requise.`;
	return {
		name: file.name,
		mime: file.type || "application/octet-stream",
		size: file.size,
		sha256,
		text,
		dataUrl,
		pdfBase64
	};
}
async function prepareFiles(list) {
	const ok = [];
	const errors = [];
	const queue = [];
	for (const file of list) if (extOf(file.name) === "zip") try {
		queue.push(...await unwrapZip(file));
	} catch (error) {
		errors.push(error instanceof Error ? error.message : `${file.name} : archive refusée.`);
	}
	else queue.push(file);
	for (const file of queue.slice(0, 12)) try {
		ok.push(await one(file));
	} catch (error) {
		errors.push(error instanceof Error ? error.message : `${file.name} : échec.`);
	}
	if (queue.length > 12) errors.push("Seuls les 12 premiers fichiers du lot sont traités.");
	return {
		ok,
		errors
	};
}
async function unwrapZip(file) {
	if (file.size > 31457280) throw new Error("ZIP trop volumineux.");
	const { default: JSZip } = await import("../_libs/jszip+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const zip = await JSZip.loadAsync(await file.arrayBuffer());
	const entries = Object.values(zip.files).filter((f) => !f.dir);
	if (entries.length > 25) throw new Error("ZIP refusé : trop de fichiers (protection anti-bombe).");
	if (entries.some((f) => f.name.toLowerCase().endsWith(".zip"))) throw new Error("ZIP imbriqué refusé.");
	const out = [];
	let total = 0;
	for (const entry of entries) {
		const buf = await entry.async("uint8array");
		if (buf.byteLength > 8388608) throw new Error(`${entry.name} dépasse 8 Mo dans l'archive.`);
		total += buf.byteLength;
		if (total > 31457280) throw new Error("Archive trop lourde après décompression.");
		const name = entry.name.split("/").pop() || entry.name;
		if (!EXT.has(extOf(name))) continue;
		const copy = new Uint8Array(buf.byteLength);
		copy.set(buf);
		out.push(new File([copy], name));
	}
	return out;
}
var STEPS = [
	"Format",
	"Taille",
	"Empreinte",
	"Doublon",
	"Stockage",
	"Extraction",
	"Classification"
];
function ImportPage() {
	const { org, bump, tx } = useOrg();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [results, setResults] = (0, import_react.useState)([]);
	async function onFiles(list) {
		if (!list?.length) return;
		setBusy(true);
		setError("");
		setResults([]);
		try {
			const prepared = await prepareFiles([...list]);
			setNotes(prepared.errors);
			if (prepared.ok.length) {
				const out = await importDocuments({ data: {
					orgId: org.id,
					folderId: null,
					files: prepared.ok.map(({ name, mime, size, sha256, text, pdfBase64 }) => ({
						name,
						mime,
						size,
						sha256,
						text,
						pdfBase64: pdfBase64 ?? ""
					}))
				} });
				setResults(out);
				bump();
			}
		} catch (e) {
			setError(messageOf(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				title: tx("Importation", "Import"),
				lede: tx("PDF, Office, images, TXT, CSV ou ZIP. Le PDF original est conservé jusqu'à 1,2 Mo. Au-delà, le texte est extrait et une copie PDF peut être régénérée depuis les champs.", "PDF, Office, images, text, CSV or ZIP. Original PDFs are kept up to 1.2 MB.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper px-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: busy ? tx("Traitement…", "Processing…") : tx("Déposez des fichiers ou parcourez", "Drop files or browse")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 text-xs text-muted",
							children: "20 Mo · lot de 12 · ZIP non imbriqué"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "sr-only",
							type: "file",
							multiple: true,
							disabled: busy || org.writesBlocked,
							onChange: (e) => void onFiles(e.target.files)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-11 cursor-pointer items-center rounded-lg border border-line px-4 text-sm",
						children: [tx("Dossier", "Folder"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "sr-only",
							type: "file",
							multiple: true,
							disabled: busy,
							webkitdirectory: "",
							directory: "",
							onChange: (e) => void onFiles(e.target.files)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-11 cursor-pointer items-center rounded-lg border border-line px-4 text-sm",
						children: [tx("Caméra", "Camera"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "sr-only",
							type: "file",
							accept: "image/*",
							capture: "environment",
							disabled: busy,
							onChange: (e) => void onFiles(e.target.files)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 flex flex-wrap gap-2 text-xs text-muted",
					children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-paper px-2 py-1",
						children: [
							busy ? "…" : "·",
							" ",
							step
						]
					}, step))
				})
			] }),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: n
			}, n)),
			results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: r.fileName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: r.status === "done" || r.status === "review" ? r.status : r.status })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-6 text-muted",
				children: [r.category ? `${r.category}. ` : "", r.message]
			})] }, `${r.fileName}-${r.documentId}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-5 text-muted",
				children: tx("L'import cloud (Drive) et l'antivirus externe ne sont pas connectés. Le contrôle MIME, la signature de fichier, le refus des macros et la limite de décompression ZIP sont actifs.", "Cloud import and external antivirus are not connected. MIME, file signature, macro rejection and ZIP limits are active.")
			})
		]
	});
}
//#endregion
export { ImportPage as component };
