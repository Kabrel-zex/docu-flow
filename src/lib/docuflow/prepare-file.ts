import { sha256Hex } from "@/lib/docuflow/engine";

export type PreparedFile = {
  name: string;
  mime: string;
  size: number;
  sha256: string;
  text: string;
  dataUrl?: string;
  pdfBase64?: string;
};

const EXT = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "jpg", "jpeg", "png", "tif", "tiff", "webp"]);

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function sniff(buf: Uint8Array): string {
  if (buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return "pdf";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b) return "zip";
  if (buf.length >= 2 && buf[0] === 0x49 && buf[1] === 0x49) return "tiff";
  if (buf.length >= 2 && buf[0] === 0x4d && buf[1] === 0x4d) return "tiff";
  return "text";
}

function stripXml(xml: string): string {
  return xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<w:p[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function zipText(buf: ArrayBuffer, kind: "docx" | "xlsx" | "pptx"): Promise<string> {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(buf);
  if ((zip.file(/vbaProject\.bin/i) ?? []).length > 0) throw new Error("Macros refusées.");
  const parts: string[] = [];
  const files = Object.values(zip.files);
  if (files.length > 80) throw new Error("Archive trop complexe.");
  for (const file of files) {
    if (file.dir) continue;
    const path = file.name;
    const take =
      (kind === "docx" && path === "word/document.xml") ||
      (kind === "xlsx" && (path === "xl/sharedStrings.xml" || path.endsWith("/sharedStrings.xml"))) ||
      (kind === "pptx" && /ppt\/slides\/slide\d+\.xml$/.test(path));
    if (!take) continue;
    parts.push(stripXml(await file.async("string")));
  }
  return parts.join("\n").slice(0, 200000);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

async function pdfText(buf: ArrayBuffer): Promise<string> {
  const unpdf = (await import("unpdf")) as {
    extractText: (data: Uint8Array, opts: { mergePages: boolean }) => Promise<{ text: string | string[] }>;
  };
  const result = await unpdf.extractText(new Uint8Array(buf), { mergePages: true });
  const text = Array.isArray(result.text) ? result.text.join("\n") : result.text;
  return (text || "").slice(0, 200000);
}

async function one(file: File): Promise<PreparedFile> {
  const ext = extOf(file.name);
  if (!EXT.has(ext)) throw new Error(`${file.name} : format non accepté.`);
  if (file.size > 20 * 1024 * 1024) throw new Error(`${file.name} : 20 Mo maximum.`);
  const buf = await file.arrayBuffer();
  const kind = sniff(new Uint8Array(buf.slice(0, 8)));
  if (ext === "pdf" && kind !== "pdf") throw new Error(`${file.name} : le contenu n'est pas un PDF.`);
  if ((ext === "jpg" || ext === "jpeg") && kind !== "jpeg") throw new Error(`${file.name} : image JPEG invalide.`);
  if (ext === "png" && kind !== "png") throw new Error(`${file.name} : image PNG invalide.`);
  if ((ext === "docx" || ext === "xlsx" || ext === "pptx") && kind !== "zip") {
    throw new Error(`${file.name} : conteneur Office invalide.`);
  }
  const sha256 = await sha256Hex(buf);
  let text = "";
  let dataUrl: string | undefined;
  let pdfBase64: string | undefined;
  if (ext === "txt" || ext === "csv") text = new TextDecoder().decode(buf).slice(0, 200000);
  else if (ext === "pdf") {
    text = await pdfText(buf);
    if (file.size <= 1_200_000) pdfBase64 = bytesToBase64(new Uint8Array(buf));
  } else if (ext === "docx" || ext === "xlsx" || ext === "pptx") text = await zipText(buf, ext);
  else if (ext === "doc" || ext === "xls") {
    text = `${file.name}\nFormat binaire ancien. Enregistrez en DOCX ou XLSX pour extraire le texte.`;
  } else if (ext === "tif" || ext === "tiff" || ext === "webp" || ext === "jpg" || ext === "jpeg" || ext === "png") {
    text = `Image importée : ${file.name}. Lancez l'OCR IA depuis la fiche pour extraire le texte visible.`;
    if (file.size < 1_200_000 && (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp")) {
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (const b of bytes) binary += String.fromCharCode(b);
      const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      dataUrl = `data:${mime};base64,${btoa(binary)}`;
    }
  }
  if (!text.trim()) text = `${file.name}\nAucun texte natif détecté. Une validation humaine est requise.`;
  return { name: file.name, mime: file.type || "application/octet-stream", size: file.size, sha256, text, dataUrl, pdfBase64 };
}

export async function prepareFiles(list: File[]): Promise<{ ok: PreparedFile[]; errors: string[] }> {
  const ok: PreparedFile[] = [];
  const errors: string[] = [];
  const queue: File[] = [];
  for (const file of list) {
    if (extOf(file.name) === "zip") {
      try {
        queue.push(...(await unwrapZip(file)));
      } catch (error) {
        errors.push(error instanceof Error ? error.message : `${file.name} : archive refusée.`);
      }
    } else queue.push(file);
  }
  for (const file of queue.slice(0, 12)) {
    try {
      ok.push(await one(file));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `${file.name} : échec.`);
    }
  }
  if (queue.length > 12) errors.push("Seuls les 12 premiers fichiers du lot sont traités.");
  return { ok, errors };
}

async function unwrapZip(file: File): Promise<File[]> {
  if (file.size > 30 * 1024 * 1024) throw new Error("ZIP trop volumineux.");
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entries = Object.values(zip.files).filter((f) => !f.dir);
  if (entries.length > 25) throw new Error("ZIP refusé : trop de fichiers (protection anti-bombe).");
  if (entries.some((f) => f.name.toLowerCase().endsWith(".zip"))) throw new Error("ZIP imbriqué refusé.");
  const out: File[] = [];
  let total = 0;
  for (const entry of entries) {
    const buf = await entry.async("uint8array");
    if (buf.byteLength > 8 * 1024 * 1024) throw new Error(`${entry.name} dépasse 8 Mo dans l'archive.`);
    total += buf.byteLength;
    if (total > 30 * 1024 * 1024) throw new Error("Archive trop lourde après décompression.");
    const name = entry.name.split("/").pop() || entry.name;
    if (!EXT.has(extOf(name))) continue;
    const copy = new Uint8Array(buf.byteLength);
    copy.set(buf);
    out.push(new File([copy], name));
  }
  return out;
}
